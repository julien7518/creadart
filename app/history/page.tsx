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

interface MatchData {
  id: string;
  date: string;
  player1: string;
  player2: string;
  winner: string;
}

export default async function MatchHistory() {
  const matchHistoryData: MatchData[] = [];

  return (
    <PageShell pageName="Historique" isHome={false}>
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Parties récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Joueur 1</TableHead>
                <TableHead>Joueur 2</TableHead>
                <TableHead>Gagnant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchHistoryData.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>{match.date}</TableCell>
                  <TableCell>{match.player1}</TableCell>
                  <TableCell>{match.player2}</TableCell>
                  <TableCell>{match.winner}</TableCell>
                  <TableCell>
                    <Button onClick={() => {}}>Détails</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
