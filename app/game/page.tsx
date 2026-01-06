import PageShell from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GamePage() {
  return (
    <PageShell pageName="Nouvelle partie" isHome={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Game Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameType">Game Type</Label>
              <select id="gameType" className="w-full p-2 border rounded-md">
                <option value="501">501</option>
                <option value="301">301</option>
                <option value="cricket">Cricket</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="player1">Player 1</Label>
              <Input id="player1" placeholder="Enter player name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="player2">Player 2</Label>
              <Input id="player2" placeholder="Enter player name" />
            </div>

            <Button className="w-full mt-6">Start Game</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• 501/301: Start with the selected score and race to zero</li>
              <li>
                • Cricket: Close all numbers (20, 19, 18, 17, 16, 15, Bull) and
                have the highest score
              </li>
              <li>• Each player throws 3 darts per turn</li>
              <li>• Must finish on a double (for 501/301)</li>
              <li>• First to win 3 legs wins the match</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
