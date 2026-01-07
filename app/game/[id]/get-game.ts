"use server";

import { getGameById } from "@/lib/games";

export async function getGameData(matchId: string) {
  try {
    // Vérifier si matchId est défini
    if (!matchId) {
      console.error("matchId is undefined in getGameData");
      return null;
    }
    
    const game = await getGameById(matchId);
    
    if (!game) {
      console.error("Game not found for matchId:", matchId);
      return null;
    }
    
    // Vérifier que game.id est défini
    if (!game.id) {
      console.error("Game object is missing id property");
      return null;
    }
    
    return {
      id: game.id,
      player1: game.player1,
      player2: game.player2,
      scores: game.scores,
      currentPlayer: game.currentPlayer,
      isFinished: game.isFinished,
      winner: game.winner,
      currentRound: game.currentRound,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de la partie:", error);
    return null;
  }
}
