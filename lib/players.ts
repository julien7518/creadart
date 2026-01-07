"use server";

import { sql } from "./db";
import { revalidatePath } from "next/cache";

export async function createPlayer(username: string, displayName: string) {
  try {
    // Validation des données
    if (!username || !displayName) {
      throw new Error("Le nom d'utilisateur et le nom affiché sont obligatoires");
    }

    // Vérifier que le username est unique
    const existingPlayers = await sql`
      SELECT id FROM players WHERE username = ${username}
    `;

    if (existingPlayers.length > 0) {
      throw new Error("Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.");
    }

    // Créer le nouveau joueur
    await sql`
      INSERT INTO players (username, display_name, total_points)
      VALUES (${username}, ${displayName}, 0)
    `;

    // Révalider le cache pour la page d'accueil
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la création du joueur:", error);
    
    if (error instanceof Error) {
      throw error; // Rejeter l'erreur pour qu'elle soit gérée par le client
    }
    
    throw new Error("Une erreur est survenue lors de la création du joueur");
  }
}
