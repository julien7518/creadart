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

export const dynamic = "force-dynamic";

export default async function Home() {
  const leaderboardData = await getLeaderboard();
  const ongoingGames = await getOngoingGames();

  return (
    <PageShell pageName="CreaDart" className="mb-8" isHome>
      <div className="w-full max-w-4xl mx-auto mb-8">
        {/* Premier joueur mis en valeur */}
        {leaderboardData.length > 0 && (
          <Card className="mb-6 border-2 border-yellow-500 bg-yellow-50/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                Top player
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <Link
                      href={`/players/${leaderboardData[0].username}`}
                      className="hover:underline"
                    >
                      <h3 className="text-xl font-bold">
                        {leaderboardData[0].name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      @{leaderboardData[0].username}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">
                    {leaderboardData[0].wins} 🏆
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {leaderboardData[0].losses} défaites
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tableau des autres joueurs à partir du rang 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="">Classement complet</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Rang</TableHead>
                  <TableHead>Joueur</TableHead>
                  <TableHead>Victoires</TableHead>
                  <TableHead>Défaites</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.slice(1).map((player) => {
                  // Déterminer la couleur et l'emoji en fonction du rang
                  let rankDisplay = String(player.rank);

                  if (player.rank === 2) {
                    rankDisplay = "🥈";
                  } else if (player.rank === 3) {
                    rankDisplay = "🥉";
                  }

                  return (
                    <TableRow key={player.username}>
                      <TableCell className="text-center">
                        {rankDisplay}
                      </TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

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
