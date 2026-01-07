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
import { getAllMatches } from "@/lib/matches";
import Link from "next/link";

export default async function MatchHistory() {
  const matches = await getAllMatches();

  return (
    <PageShell pageName="Historique" className="mb-8">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Parties récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Match</TableHead>
                <TableHead>Gagnant</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>
                    {match.player_1_name} - {match.player_2_name}
                  </TableCell>
                  <TableCell>{match.winner_name || "En cours"}</TableCell>
                  <TableCell>
                    <Link href={`/history/${match.id}`} passHref>
                      <Button variant="outline">Détails</Button>
                    </Link>
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
