"use client";

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
import { useState } from "react";

function SelectPlayer({
  players,
  onValueChange,
}: {
  players: { username: string; display_name: string }[];
  onValueChange?: (value: string) => void;
}) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sélectionner un joueur" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Joueurs</SelectLabel>
          {players.map((player) => (
            <SelectItem key={player.username} value={player.username}>
              {player.display_name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default function NewGame({
  players,
}: {
  players: { username: string; display_name: string }[];
}) {
  const [player1, setPlayer1] = useState<string>("");
  const [player2, setPlayer2] = useState<string>("");

  const handleStartGame = () => {
    console.log("Joueur 1 sélectionné:", player1);
    console.log("Joueur 2 sélectionné:", player2);
  };

  return (
    <PageShell pageName="Nouvelle partie" className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Réglage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player1">Joueur 1</Label>
              <SelectPlayer players={players} onValueChange={setPlayer1} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="player2">Joueur 2</Label>
              <SelectPlayer players={players} onValueChange={setPlayer2} />
            </div>

            <Button className="w-full mt-6" onClick={handleStartGame}>
              Commencez
            </Button>
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
