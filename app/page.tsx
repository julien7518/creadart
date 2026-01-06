import PageShell from "@/components/layout/page-shell";
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

export default function Home() {
  const leaderboardData = [
    { rank: 1, name: "Julien", wins: 8, losses: 2 },
    { rank: 2, name: "Alex", wins: 6, losses: 4 },
    { rank: 3, name: "Marie", wins: 5, losses: 5 },
    { rank: 4, name: "Thomas", wins: 4, losses: 6 },
    { rank: 5, name: "Sophie", wins: 3, losses: 7 },
  ];

  return (
    <PageShell pageName="CreaDart" isHome>
      <div className="flex justify-center gap-4 mb-8">
        <Link href="/game">
          <Button size="lg">Start New Game</Button>
        </Link>
        <Link href="/history">
          <Button size="lg" variant="outline">
            View Match History
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Top Players</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Wins</TableHead>
                <TableHead>Losses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((player) => (
                <TableRow key={player.rank}>
                  <TableCell>{player.rank}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.wins}</TableCell>
                  <TableCell>{player.losses}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
