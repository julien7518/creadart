"use server";

import { createGame } from "@/lib/games";

export async function startNewGame(
  player1Username: string,
  player2Username: string
): Promise<string> {
  try {
    // Validation des données
    if (!player1Username || !player2Username) {
      throw new Error("Les deux joueurs sont requis");
    }

    if (player1Username === player2Username) {
      throw new Error("Les joueurs doivent être différents");
    }

    // Créer la nouvelle partie
    const game = await createGame(player1Username, player2Username, 301);

    // Vérifier que game et game.id sont définis
    if (!game || !game.id) {
      throw new Error("Impossible de créer la partie");
    }

    return game.id;
  } catch (error) {
    console.error("Erreur lors de la création de la partie:", error);

    if (error instanceof Error) {
      if (
        error.message ===
        "Les deux joueurs doivent exister dans la base de données"
      ) {
        throw new Error(
          "Les joueurs spécifiés n'existent pas dans la base de données"
        );
      }

      if (error.message === "Impossible de trouver les joueurs spécifiés") {
        throw new Error("Impossible de trouver les joueurs spécifiés");
      }
    }

    throw new Error("Erreur lors de la création de la partie");
  }
}
