"use server";

import { revalidatePath } from "next/cache";
import { updateGameWithTurn } from "@/lib/games";

export async function submitTurn(matchId: string, dartScores: number[]) {
  try {
    // Validation des données
    if (!matchId) {
      throw new Error("ID de partie non valide");
    }
    
    if (!dartScores || !Array.isArray(dartScores) || dartScores.length !== 3) {
      throw new Error("Il faut exactement 3 scores de fléchettes");
    }
    
    // Vérifier que tous les scores sont des nombres valides
    if (dartScores.some(score => typeof score !== "number" || score < 0 || score > 60)) {
      throw new Error("Les scores doivent être des nombres entre 0 et 60");
    }
    
    // Mettre à jour la partie avec le nouveau tour
    const updatedGame = await updateGameWithTurn(matchId, dartScores);
    
    // Vérifier que updatedGame et updatedGame.id sont définis
    if (!updatedGame || !updatedGame.id) {
      throw new Error("Impossible de mettre à jour la partie");
    }
    
    // Révalider le cache pour la page de la partie
    revalidatePath(`/game/${matchId}`);
    
    return {
      success: true,
      game: {
        id: updatedGame.id,
        player1: updatedGame.player1.username,
        player2: updatedGame.player2.username,
        scores: updatedGame.scores,
        currentPlayer: updatedGame.currentPlayer.username,
        isFinished: updatedGame.isFinished,
        winner: updatedGame.winner?.username || null,
        currentRound: updatedGame.currentRound,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la soumission du tour:", error);
    
    if (error instanceof Error) {
      if (error.message === "Cannot go below 0 points") {
        throw new Error("Impossible de descendre en dessous de 0 points");
      }
      
      if (error.message === "Game not found or already finished") {
        throw new Error("Partie non trouvée ou déjà terminée");
      }
      
      if (error.message === "ID de partie non valide") {
        throw new Error("ID de partie non valide");
      }
      
      if (error.message === "Impossible de mettre à jour la partie") {
        throw new Error("Impossible de mettre à jour la partie");
      }
    }
    
    throw new Error("Erreur lors de la soumission du tour");
  }
}
