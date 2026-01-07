import { getGameData } from "./get-game";
import GamePageClient from "./page-client";

export default async function GamePageWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialGame = await getGameData(id);

  return <GamePageClient initialGame={initialGame} />;
}
