"use client";

import { PageShell } from "@/components/layout/page-shell";
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
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startNewGame } from "./start-new-game";

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
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isEmpty = player1 === "" || player2 === "";
  const isSame = player1 === player2 && player1 !== "";
  const isFormValid = !isEmpty && !isSame;

  const handleStartGame = async () => {
    if (!isFormValid) {
      return;
    }

    setError(null);

    try {
      startTransition(async () => {
        const gameId = await startNewGame(player1, player2);
        if (!gameId) {
          throw new Error("ID de partie non valide");
        }
        router.push(`/game/${gameId}`);
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    }
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

            <Button
              className="w-full mt-3"
              onClick={handleStartGame}
              disabled={!isFormValid || isPending}
            >
              {isPending ? "Création..." : "Commencez"}
            </Button>
            {isSame && (
              <p className="flex justify-center text-red-500 mt-2">
                Un joueur ne peut pas jouer contre lui même
              </p>
            )}
            {error && (
              <p className="flex justify-center text-red-500 mt-2">{error}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Règles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">📊</span>
                    <span>
                      Chaque joueur commence avec <strong>301 points</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">🏆</span>
                    <span>
                      Le but est d'atteindre <strong>exactement 0 point</strong>{" "}
                      en premier
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">🎯</span>
                    <span>
                      Chaque joueur lance <strong>3 fléchettes par tour</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">⚠️</span>
                    <span>
                      Il est interdit de <strong>dépasser 0 point</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">🔒</span>
                    <span>
                      La partie se termine{" "}
                      <strong>obligatoirement sur un double</strong>*
                    </span>
                  </li>
                </ul>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">
                  *Un double correspond à la zone extérieure fine de la cible
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
