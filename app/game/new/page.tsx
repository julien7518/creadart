import { sql } from "@/lib/db";
import NewGame from "./page-client";

export default async function NewGamePage() {
  const players = await sql<{ username: string; display_name: string }[]>`
    SELECT username, display_name
    FROM players
    ORDER BY display_name ASC;
  `;

  return <NewGame players={players} />;
}
