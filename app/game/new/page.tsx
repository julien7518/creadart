import PageShell from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewGame() {
  return (
    <PageShell pageName="Nouvelle partie" isHome={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Réglage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player1">Joueur 1</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un joueur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Joueurs</SelectLabel>
                    <SelectItem value="test">Test</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="player2">Joueur 2</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un joueur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Joueurs</SelectLabel>
                    <SelectItem value="test">Test</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full mt-6">Commencez</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Règles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>Chaque joueur commence avec 301 points</li>
              <li>Le but est d'arriver le plus vite possible à 0</li>
              <li>Chaque joueur à 3 fléchettes par tour</li>
              <li>Il ne faut pas dépasser 0</li>
              <li>Il est obligatoire de finir sur un double</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
