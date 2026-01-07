import { sql } from "./db";

export interface MatchWithPlayers {
  id: string;
  created_at: Date;
  finished_at: Date | null;
  player_1_id: string;
  player_2_id: string;
  winner_id: string | null;
  player_1_name: string;
  player_2_name: string;
  winner_name: string | null;
  player_1_username: string;
  player_2_username: string;
  winner_username: string | null;
}

export async function getAllMatches(): Promise<MatchWithPlayers[]> {
  const result = await sql`
    SELECT 
      m.id,
      m.created_at,
      m.finished_at,
      m.player_1_id,
      m.player_2_id,
      m.winner_id,
      p1.display_name as player_1_display_name,
      p2.display_name as player_2_display_name,
      w.display_name as winner_display_name,
      p1.username as player_1_username,
      p2.username as player_2_username,
      w.username as winner_username
    FROM matches m
    JOIN players p1 ON m.player_1_id = p1.id
    JOIN players p2 ON m.player_2_id = p2.id
    LEFT JOIN players w ON m.winner_id = w.id
    ORDER BY m.created_at DESC
  `;

  return result.map((row) => ({
    id: row.id,
    created_at: row.created_at,
    finished_at: row.finished_at,
    player_1_id: row.player_1_id,
    player_2_id: row.player_2_id,
    winner_id: row.winner_id,
    player_1_name: row.player_1_display_name,
    player_2_name: row.player_2_display_name,
    winner_name: row.winner_display_name,
    player_1_username: row.player_1_username,
    player_2_username: row.player_2_username,
    winner_username: row.winner_username,
  }));
}

export async function getMatchById(
  id: string
): Promise<MatchWithPlayers | null> {
  const result = await sql`
    SELECT 
      m.id,
      m.created_at,
      m.finished_at,
      m.player_1_id,
      m.player_2_id,
      m.winner_id,
      p1.display_name as player_1_display_name,
      p2.display_name as player_2_display_name,
      w.display_name as winner_display_name,
      p1.username as player_1_username,
      p2.username as player_2_username,
      w.username as winner_username
    FROM matches m
    JOIN players p1 ON m.player_1_id = p1.id
    JOIN players p2 ON m.player_2_id = p2.id
    LEFT JOIN players w ON m.winner_id = w.id
    WHERE m.id = ${id}
  `;

  if (result.length === 0) {
    return null;
  }

  return {
    id: result[0].id,
    created_at: result[0].created_at,
    finished_at: result[0].finished_at,
    player_1_id: result[0].player_1_id,
    player_2_id: result[0].player_2_id,
    winner_id: result[0].winner_id,
    player_1_name: result[0].player_1_display_name,
    player_2_name: result[0].player_2_display_name,
    winner_name: result[0].winner_display_name,
    player_1_username: result[0].player_1_username,
    player_2_username: result[0].player_2_username,
    winner_username: result[0].winner_username,
  };
}

export async function getMatchRounds(matchId: string) {
  return await sql`
    SELECT 
      id,
      match_id,
      round_number,
      player_1_score,
      player_2_score,
      created_at
    FROM match_rounds
    WHERE match_id = ${matchId}
    ORDER BY round_number ASC
  `;
}
