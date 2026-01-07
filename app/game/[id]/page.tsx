import { PageShell } from "@/components/layout/page-shell";
import { getGameData } from "./get-game";
import GamePageClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function GamePageWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialGame = await getGameData(id);

  return (
    <PageShell pageName="">
      <GamePageClient initialGame={initialGame} />
    </PageShell>
  );
}
