"use server";

import { revalidatePath } from "next/cache";
import { updateGameWithTurn } from "@/lib/games";
import { sql } from "@/lib/db";

export async function submitTurn(matchId: string, totalScore: number, currentPlayerId: string) {
  try {
    // Validation des données
    if (!matchId) {
      throw new Error("ID de partie non valide");
    }
    
    // Vérifier que le score total est un nombre valide
    if (typeof totalScore !== "number" || totalScore < 0 || totalScore > 180) {
      throw new Error("Le score total doit être un nombre entre 0 et 180");
    }
    
    // Vérifier que le score total est un multiple de 1 (score valide au dart)
    if (!Number.isInteger(totalScore)) {
      throw new Error("Le score total doit être un nombre entier");
    }
    
    // Mettre à jour la partie avec le nouveau tour
    const updatedGame = await updateGameWithTurn(matchId, totalScore);
    
    // Mettre à jour le total_points du joueur
    if (currentPlayerId) {
      await sql`
        UPDATE players 
        SET total_points = total_points + ${totalScore}
        WHERE id = ${currentPlayerId}
      `;
    }
    
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
        player1: updatedGame.player1.id,
        player2: updatedGame.player2.id,
        scores: updatedGame.scores,
        currentPlayer: updatedGame.currentPlayer.id,
        isFinished: updatedGame.isFinished,
        winner: updatedGame.winner?.id || null,
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
      
      if (error.message === "Le score total doit être un nombre entre 0 et 180") {
        throw new Error("Le score total doit être un nombre entre 0 et 180");
      }
      
      if (error.message === "Impossible de mettre à jour la partie") {
        throw new Error("Impossible de mettre à jour la partie");
      }
    }
    
    throw new Error("Erreur lors de la soumission du tour");
  }
}
