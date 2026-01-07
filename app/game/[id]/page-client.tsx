"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { submitTurn } from "./submit-turn";

interface PlayerData {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
}

interface GameData {
  id: string;
  player1: PlayerData;
  player2: PlayerData;
  scores: Record<string, number>;
  currentPlayer: PlayerData;
  isFinished: boolean;
  winner: PlayerData | null;
  currentRound: number;
}

interface PlayerScoreCardProps {
  player: {
    username: string;
    display_name: string;
  };
  score: number;
  isCurrentPlayer: boolean;
}

const PlayerScoreCard = ({
  player,
  score,
  isCurrentPlayer,
}: PlayerScoreCardProps) => {
  return (
    <Card
      className={`transition-all ${
        isCurrentPlayer
          ? "bg-primary text-primary-foreground border-primary shadow-lg"
          : ""
      }`}
    >
      <CardHeader>
        <CardTitle className="text-xl">{player.display_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-black">{score}</p>
      </CardContent>
    </Card>
  );
};

export default function GamePage({
  initialGame,
}: {
  initialGame: GameData | null;
}) {
  const router = useRouter();
  const [game, setGame] = useState<GameData | null>(initialGame);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dartScores, setDartScores] = useState(["", "", ""]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Si initialGame est null, c'est que la partie n'existe pas
  useEffect(() => {
    if (initialGame === null) {
      setError("Partie non trouvée");
    } else {
      setGame(initialGame);
    }
  }, [initialGame]);

  // Gérer les changements dans les inputs des fléchettes
  const handleDartScoreChange = (index: number, value: string) => {
    const newScores = [...dartScores];
    newScores[index] = value;
    setDartScores(newScores);
  };

  // Valider le tour
  const handleSubmitTurn = async () => {
    if (!game) return;

    setSubmitError(null);

    // Vérifier que tous les scores sont remplis
    if (dartScores.some((score) => score === "")) {
      setSubmitError("Veuillez remplir tous les scores des fléchettes");
      return;
    }

    // Convertir les scores en nombres
    const numericScores = dartScores.map((score) => parseInt(score || "0"));

    try {
      startTransition(async () => {
        const result = await submitTurn(game.id, numericScores);

        // Mettre à jour l'état local avec les nouvelles données
        setGame((prevGame) => {
          if (!prevGame) return null;

          // Trouver le joueur gagnant complet à partir des joueurs existants
          const winner = result.game.winner
            ? result.game.winner === prevGame.player1.username
              ? prevGame.player1
              : prevGame.player2
            : null;

          // Trouver le prochain joueur complet
          const nextPlayer =
            result.game.currentPlayer === prevGame.player1.username
              ? prevGame.player1
              : prevGame.player2;

          return {
            ...prevGame,
            scores: result.game.scores,
            currentPlayer: nextPlayer,
            isFinished: result.game.isFinished,
            winner: winner,
            currentRound: result.game.currentRound,
          };
        });

        setDartScores(["", "", ""]); // Réinitialiser les inputs

        // Vérifier si la partie est terminée
        if (result.game.isFinished) {
          setTimeout(() => {
            alert(`Partie terminée ! ${result.game.winner} a gagné !`);
          }, 100);
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Erreur lors de la soumission du tour");
      }
    }
  };

  // Vérifier si la partie est terminée
  useEffect(() => {
    if (game?.isFinished) {
      // Vous pourriez rediriger ou afficher un message
      // router.push(`/game/${game.id}/finished`);
    }
  }, [game?.isFinished, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen mx-auto px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
            <Button onClick={() => router.push("/")} className="w-full mt-4">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center h-screen mx-auto px-4 py-8">
        <p>Partie non trouvée</p>
      </div>
    );
  }

  // Vérifier si la partie est terminée
  if (game.isFinished) {
    return (
      <div className="flex items-center justify-center h-screen mx-auto px-4 py-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">🎉 Partie Terminée 🎉</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold">
              Gagnant : {game.winner?.display_name}
            </h2>
            <div className="space-y-2">
              <p className="text-lg">
                <strong>{game.player1.display_name}</strong>:{" "}
                {game.scores[game.player1.username]} points
              </p>
              <p className="text-lg">
                <strong>{game.player2.display_name}</strong>:{" "}
                {game.scores[game.player2.username]} points
              </p>
            </div>
            <Button onClick={() => router.push("/")} className="w-full mt-6">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Card du joueur actuel */}
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-muted-foreground">
              Tour de{" "}
              <div className="text-2xl font-black text-primary">
                {game.currentPlayer.display_name}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Inputs des fléchettes */}
            <div className="flex flex-col gap-4 items-center justify-center">
              Scores
              <div className="inline-flex gap-4 items-center">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex items-center">
                    <Input
                      type="number"
                      value={dartScores[index]}
                      onChange={(e) =>
                        handleDartScoreChange(index, e.target.value)
                      }
                      className="w-24 h-20 text-4xl font-bold rounded-xl text-center"
                      min="0"
                      max="60"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Total et bouton */}
            <div className="text-center space-y-4 pt-4">
              <div className="text-foreground">
                Total:{" "}
                <span className="">
                  {dartScores.reduce(
                    (sum, score) => sum + parseInt(score || "0"),
                    0
                  )}
                </span>{" "}
                points
              </div>
              <Button
                onClick={handleSubmitTurn}
                disabled={isPending || dartScores.some((score) => score === "")}
                className="w-full text-xl"
              >
                {isPending ? "Envoi..." : "Valider"}
              </Button>
              {submitError && (
                <p className="text-destructive font-semibold">{submitError}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card des scores */}
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Tableau des scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <PlayerScoreCard
                player={game.player1}
                score={game.scores[game.player1.username]}
                isCurrentPlayer={
                  game.currentPlayer.username === game.player1.username
                }
              />
              <PlayerScoreCard
                player={game.player2}
                score={game.scores[game.player2.username]}
                isCurrentPlayer={
                  game.currentPlayer.username === game.player2.username
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
