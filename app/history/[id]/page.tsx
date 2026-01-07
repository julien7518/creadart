import { PageShell } from "@/components/layout/page-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getMatchById, getMatchRounds } from "@/lib/matches";

interface MatchDetailsPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function MatchDetailsPage({
  params,
}: MatchDetailsPageProps) {
  const resolvedParams = await params;

  const match = await getMatchById(resolvedParams.id);
  const rounds = await getMatchRounds(resolvedParams.id);

  if (!match) {
    return (
      <PageShell pageName="Détails du match" href="/history" className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Match non trouvé</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Le match avec l'ID {resolvedParams.id} n'a pas été trouvé.</p>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell pageName="Détails du match" className="mb-8" href="/history">
      <div className="w-full max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Informations du match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Date de création
                </p>
                <p>{match.created_at.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de fin</p>
                <p>
                  {match.finished_at
                    ? match.finished_at.toLocaleString()
                    : "En cours"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joueur 1</p>
                <p>{match.player_1_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joueur 2</p>
                <p>{match.player_2_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gagnant</p>
                <p>{match.winner_name || "Match non terminé"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Manches du match</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manche</TableHead>
                  <TableHead>{match.player_1_name}</TableHead>
                  <TableHead>{match.player_2_name}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rounds.map((round) => (
                  <TableRow key={round.id}>
                    <TableCell>{round.round_number}</TableCell>
                    <TableCell>{round.player_1_score}</TableCell>
                    <TableCell>{round.player_2_score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
