import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { getLeaderboard } from "@/lib/leaderboard";
import { getOngoingGames } from "@/lib/games";
import { PlayerCreationButton } from "@/components/player-creation-button";

export default async function Home() {
  const leaderboardData = await getLeaderboard();
  const ongoingGames = await getOngoingGames();

  return (
    <PageShell pageName="CreaDart" className="mb-8" isHome>
      <Card className="w-full max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Classement</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rang</TableHead>
                <TableHead>Joueur</TableHead>
                <TableHead>Victoires</TableHead>
                <TableHead>Défaites</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((player) => (
                <TableRow key={player.username}>
                  <TableCell>{player.rank}</TableCell>
                  <TableCell>
                    <Link
                      href={`/players/${player.username}`}
                      className="hover:underline"
                    >
                      {player.name}
                    </Link>
                  </TableCell>
                  <TableCell>{player.wins}</TableCell>
                  <TableCell>{player.losses}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex-col mb-8">
        <div className="flex justify-center gap-4 mb-2">
          <Link href="/game/new/">
            <Button size="lg">Nouvelle partie</Button>
          </Link>
          <Link href="/history">
            <Button size="lg" variant="outline">
              Historique
            </Button>
          </Link>
        </div>
        <div className="flex w-full justify-center">
          <PlayerCreationButton />
        </div>
      </div>

      {(await ongoingGames).length > 0 && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Parties en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Joueur 1</TableHead>
                  <TableHead>Joueur 2</TableHead>
                  <TableHead>Tour actuel</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(await ongoingGames).map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>
                      <Link href={`/game/${game.id}`}>
                        {game.player1.display_name}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <Link href={`/game/${game.id}`}>
                        {game.player2.display_name}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <Link href={`/game/${game.id}`}>{game.currentRound}</Link>
                    </TableCell>

                    <TableCell>
                      <Link href={`/game/${game.id}`}>
                        {game.scores[game.player1.username]} -{" "}
                        {game.scores[game.player2.username]}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
