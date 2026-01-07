"use server";

import { deleteGame } from "@/lib/games";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteGameAction(matchId: string) {
  try {
    // Supprimer la partie de la base de données
    await deleteGame(matchId);

    // Réinvalider le cache pour la page d'accueil
    revalidatePath("/");

    // Rediriger vers la page d'accueil
    redirect("/");
  } catch (error) {
    console.error("Erreur lors de la suppression de la partie:", error);
    throw new Error("Impossible de supprimer la partie");
  }
}
