import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";

interface PlayerStats {
  username: string;
  display_name: string;
  games_played: number;
  wins: number;
  losses: number;
  total_score: number;
  avg_score: number;
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const [player] = await sql<PlayerStats[]>`
    SELECT
      p.username,
      p.display_name,
      COUNT(DISTINCT m.id) AS games_played,
      COUNT(m.id) FILTER (WHERE m.winner_id = p.id) AS wins,
      COUNT(m.id) FILTER (
        WHERE m.winner_id IS NOT NULL AND m.winner_id != p.id
      ) AS losses,
      COALESCE(SUM(
        CASE
          WHEN mr.player_1_score IS NOT NULL AND m.player_1_id = p.id THEN mr.player_1_score
          WHEN mr.player_2_score IS NOT NULL AND m.player_2_id = p.id THEN mr.player_2_score
          ELSE 0
        END
      ), 0) AS total_score,

      COALESCE(AVG(
        CASE
          WHEN mr.player_1_score IS NOT NULL AND m.player_1_id = p.id THEN mr.player_1_score
          WHEN mr.player_2_score IS NOT NULL AND m.player_2_id = p.id THEN mr.player_2_score
        END
      ), 0) AS avg_score
    FROM players p
    LEFT JOIN matches m
      ON p.id = m.player_1_id OR p.id = m.player_2_id
    LEFT JOIN match_rounds mr
      ON mr.match_id = m.id
    WHERE p.username = ${username}
    GROUP BY p.id;
  `;

  if (!player) notFound();

  return (
    <PageShell pageName={player.display_name}>
      <div className="max-w-5xl mx-auto">
        {/* HERO */}
        <div className="flex justify-center mb-8">
          <p className="flex text-sm text-muted-foreground">
            @{player.username}
          </p>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <StatCard title="🆚 Matches" value={player.games_played} />
          <StatCard title="🏆 Victoires" value={player.wins} />
          <StatCard title="👎 Défaites" value={player.losses} />
          <StatCard
            title="🔢 Ratio"
            value={Number((player.wins / player.games_played).toFixed(2))}
          />
          <StatCard
            title="🔥 Total de points"
            value={player.total_score ?? 0}
          />
          <StatCard
            title="📊 Moyenne par tour"
            value={Number(Number(player.avg_score ?? 0).toFixed(2))}
          />
        </div>

        {/* SUMMARY */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle>✨ Résumé de la saison</CardTitle>
          </CardHeader>
          <CardContent className="text-lg leading-relaxed">
            {player.display_name} a joué <b>{player.games_played}</b> matchs,
            avec <b>{player.wins}</b> victoires et <b>{player.losses}</b>{" "}
            défaites. Il a marqué un total de <b>{player.total_score ?? 0}</b>{" "}
            points, avec une moyenne de{" "}
            <b>{Number(player.avg_score ?? 0).toFixed(1)}</b> points par tour.
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-4xl font-bold text-center">
        {value}
      </CardContent>
    </Card>
  );
}
