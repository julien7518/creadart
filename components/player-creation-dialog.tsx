"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createPlayer } from "@/lib/players";

function normalizeUsername(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD") // enlève les accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_") // espaces → _
    .replace(/[^a-z0-9_]/g, ""); // supprime tout le reste
}

export function PlayerCreationDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Le nom d'utilisateur est obligatoire");
      return;
    }

    if (!displayName.trim()) {
      setError("Le nom affiché est obligatoire");
      return;
    }

    try {
      setIsLoading(true);
      await createPlayer(username, displayName);
      // Réinitialiser le formulaire
      setUsername("");
      setDisplayName("");
      // Fermer le dialogue
      onOpenChange(false);
      // Recharger la page pour voir le nouveau joueur
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue lors de la création du joueur");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialiser les erreurs et les champs lorsque le dialogue s'ouvre
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setError(null);
      setUsername("");
      setDisplayName("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau joueur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(normalizeUsername(e.target.value))}
              placeholder="Entrez un nom d'utilisateur unique"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName">Nom affiché</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Entrez votre nom complet"
              required
            />
          </div>
          {error && (
            <div className="text-destructive text-sm font-medium">{error}</div>
          )}
        </form>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Création..." : "Créer le joueur"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
