import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";

interface PlayerStats {
  username: string;
  display_name: string;
  total_points: number;
  total_rounds_played: number;
  games_played: number;
  wins: number;
  losses: number;
  total_score: number;
  avg_score: number;
  darts_thrown: number;
  total_playtime: number;
  current_win_streak: number;
}

export const dynamic = "force-dynamic";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const [player] = await sql<PlayerStats[]>`
    WITH completed_matches AS (
      -- Seuls les matchs terminés sont pris en compte pour les victoires/défaites
      SELECT id, player_1_id, player_2_id, winner_id, created_at
      FROM matches 
      WHERE winner_id IS NOT NULL AND finished_at IS NOT NULL
    ),
    all_rounds AS (
      -- Tous les rounds de tous les matchs
      SELECT 
        mr.match_id,
        mr.round_number,
        mr.current_player_id,
        mr.player_1_score,
        mr.player_2_score,
        -- Vérifier si c'est le dernier round
        (SELECT COUNT(*) FROM match_rounds mr2 WHERE mr2.match_id = mr.match_id) = mr.round_number AS is_last_round
      FROM match_rounds mr
      JOIN matches m ON mr.match_id = m.id
    )
    
    SELECT
      p.username,
      p.display_name,
      COUNT(DISTINCT m.id) AS games_played,
      COUNT(DISTINCT CASE WHEN cm.winner_id = p.id THEN cm.id END) AS wins,
      COUNT(DISTINCT CASE WHEN cm.winner_id != p.id AND cm.winner_id IS NOT NULL THEN cm.id END) AS losses,
      
      -- Points totaux = valeur directe depuis la colonne total_points (mise à jour à chaque tour)
      p.total_points AS total_score,

      -- Moyenne par tour = calcul simple basé sur les valeurs pré-calculées
      -- total_points / total_rounds_played
      CASE
        WHEN p.total_rounds_played > 0 THEN 
          p.total_points::FLOAT / p.total_rounds_played
        ELSE 0
      END AS avg_score,
      
      -- Nombre de fléchettes lancées = 3 * total_rounds_played
      p.total_rounds_played * 3 AS darts_thrown,
      
      -- Temps total de jeu en secondes (matchs terminés uniquement)
      COALESCE(
        SUM(
          EXTRACT(EPOCH FROM (m.finished_at - m.created_at))
        ),
        0
      ) AS total_playtime,
      
      -- Meilleure série de victoires consécutives (historique)
      COALESCE((
        SELECT MAX(win_count)
        FROM (
          SELECT COUNT(*) AS win_count
          FROM (
            SELECT
              m2.finished_at,
              m2.winner_id,
              SUM(
                CASE
                  WHEN m2.winner_id != p.id THEN 1
                  ELSE 0
                END
              ) OVER (ORDER BY m2.finished_at) AS loss_group
            FROM matches m2
            WHERE
              m2.finished_at IS NOT NULL
              AND p.id IN (m2.player_1_id, m2.player_2_id)
          ) grouped
          WHERE winner_id = p.id
          GROUP BY loss_group
        ) streaks
      ), 0) AS current_win_streak
    FROM players p
    LEFT JOIN completed_matches cm ON p.id = cm.player_1_id OR p.id = cm.player_2_id
    LEFT JOIN matches m
      ON p.id IN (m.player_1_id, m.player_2_id)
     AND m.finished_at IS NOT NULL
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
            value={
              player.games_played > 0
                ? Number(((player.wins / player.games_played) * 100).toFixed(2))
                : 0
            }
            suffix="%"
          />
          <StatCard
            title="💯 Total de points"
            value={player.total_score ?? 0}
          />
          <StatCard
            title="📊 Moyenne par tour"
            value={Number(Number(player.avg_score ?? 0).toFixed(2))}
          />
          <StatCard
            title="🎯 Fléchettes lancées"
            value={player.darts_thrown ?? 0}
          />
          {/*
          <StatCard
            title="⏱️ Temps total de jeu"
            value={(player.total_playtime) ?? 0}
            format="time"
          />
          <StatCard
            title="🔥 Meilleure série de victoires"
            value={player.current_win_streak ?? 0}
          />
          */}
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
            Il a lancé <b>{player.darts_thrown ?? 0}</b> fléchettes au total. Il
            a une série actuelle de <b>{player.current_win_streak ?? 0}</b>{" "}
            victoires consécutives. Temps total de jeu:{" "}
            <b>{Math.round(player.total_playtime ?? 0)}</b> minutes.
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function StatCard({
  title,
  value,
  suffix,
  format,
}: {
  title: string;
  value: number;
  suffix?: string;
  format?: string;
}) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
    } else {
      return `${minutes}min ${remainingSeconds.toString().padStart(2, "0")}s`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-4xl font-bold text-center">
        {format === "time" ? formatTime(value) : value}
        {suffix && " " + suffix}
      </CardContent>
    </Card>
  );
}
