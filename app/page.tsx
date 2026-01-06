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

interface leaderboardData {
  rank: number;
  name: string;
  wins: number;
  losses: number;
}

export default function Home() {
  const leaderboardData: leaderboardData[] = [];

  return (
    <PageShell pageName="CreaDart" isHome>
      <div className="flex justify-center gap-4 mb-8">
        <Link href="/game/new/">
          <Button size="lg">Nouvelle partie</Button>
        </Link>
        <Link href="/history">
          <Button size="lg" variant="outline">
            Historique
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
                <TableHead>Rang</TableHead>
                <TableHead>Joueur</TableHead>
                <TableHead>Victoires</TableHead>
                <TableHead>Défaites</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((player) => (
                <TableRow>
                  <TableCell>{player.rank}</TableCell>
                  <Link key={player.rank} href={`/players/${player.name}`}>
                    <TableCell>{player.name}</TableCell>
                  </Link>
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
