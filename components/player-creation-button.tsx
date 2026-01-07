"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlayerCreationDialog } from "./player-creation-dialog";

export function PlayerCreationButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button size="lg" onClick={() => setIsDialogOpen(true)}>
        Créer un joueur
      </Button>
      
      <PlayerCreationDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
