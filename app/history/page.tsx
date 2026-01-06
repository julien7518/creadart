import PageShell from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function MatchHistory() {
  // Mock data for match history
  const matchHistoryData = [
    {
      id: 1,
      date: "2024-01-15",
      players: "Julien vs Alex",
      winner: "Julien",
      score: "150-120",
      gameType: "501",
    },
    {
      id: 2,
      date: "2024-01-14",
      players: "Marie vs Thomas",
      winner: "Marie",
      score: "100-80",
      gameType: "301",
    },
    {
      id: 3,
      date: "2024-01-13",
      players: "Sophie vs Alex",
      winner: "Alex",
      score: "120-60",
      gameType: "501",
    },
    {
      id: 4,
      date: "2024-01-12",
      players: "Julien vs Marie",
      winner: "Julien",
      score: "150-100",
      gameType: "501",
    },
    {
      id: 5,
      date: "2024-01-11",
      players: "Thomas vs Sophie",
      winner: "Thomas",
      score: "80-60",
      gameType: "301",
    },
  ];

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
                <TableHead>Players</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Game Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchHistoryData.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>{match.date}</TableCell>
                  <TableCell>{match.players}</TableCell>
                  <TableCell>{match.winner}</TableCell>
                  <TableCell>{match.score}</TableCell>
                  <TableCell>{match.gameType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
