import { sql } from "./db";

export interface LeaderboardPlayer {
  rank: number;
  name: string;
  username: string;
  wins: number;
  losses: number;
}

export async function getLeaderboard(): Promise<LeaderboardPlayer[]> {
  const rows = await sql`
    SELECT
      p.username,
      p.display_name,
      p.total_points,
      COUNT(m.id) FILTER (WHERE m.winner_id = p.id) AS wins,
      COUNT(m.id) FILTER (
        WHERE m.winner_id IS NOT NULL AND m.winner_id != p.id
      ) AS losses
    FROM players p
    LEFT JOIN matches m
      ON p.id = m.player_1_id OR p.id = m.player_2_id
    GROUP BY p.id
    ORDER BY
      wins DESC,
      losses ASC,
      p.total_points DESC;
  `;

  return rows.map((row, index) => ({
    rank: index + 1,
    name: row.display_name,
    username: row.username,
    wins: Number(row.wins),
    losses: Number(row.losses),
  }));
}
