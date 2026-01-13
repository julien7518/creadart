import { sql } from "./db";

// Type pour les résultats SQL bruts
interface Row {
  [key: string]: any;
}

interface Player {
  id: string;
  username: string;
  display_name: string;
  created_at: Date;
}

interface MatchRound {
  id: string;
  match_id: string;
  round_number: number;
  player_1_score: number;
  player_2_score: number;
  current_player_id: string | null;
  created_at: Date;
}

// Fonction utilitaire pour mapper un résultat SQL vers un Player
function mapRowToPlayer(row: Row): Player {
  return {
    id: row.id as string,
    username: row.username as string,
    display_name: row.display_name as string,
    created_at: row.created_at as Date,
  };
}

interface GameData {
  id: string;
  player1: Player;
  player2: Player;
  scores: Record<string, number>;
  currentPlayer: Player;
  isFinished: boolean;
  winner: Player | null;
  currentRound: number;
}

// Créer une nouvelle partie
export async function createGame(
  player1Username: string,
  player2Username: string,
  initialScore: number = 301
): Promise<GameData> {
  // Récupérer les IDs des joueurs à partir de leurs usernames
  const players = await sql<Row[]>`
    SELECT id, username, display_name
    FROM players 
    WHERE username IN (${player1Username}, ${player2Username})
  `;

  if (players.length !== 2) {
    throw new Error("Les deux joueurs doivent exister dans la base de données");
  }

  // Mapper les résultats SQL vers notre interface Player
  const playersData = players.map(mapRowToPlayer);

  const player1 = playersData.find((p: Player) => p.username === player1Username);
  const player2 = playersData.find((p: Player) => p.username === player2Username);

  if (!player1 || !player2) {
    throw new Error("Impossible de trouver les joueurs spécifiés");
  }

  // Créer le match
  const match = await sql`
    INSERT INTO matches (player_1_id, player_2_id)
    VALUES (${player1.id}, ${player2.id})
    RETURNING *
  `;

  const newMatch = match[0];

  // Vérifier que newMatch et newMatch.id sont définis
  if (!newMatch || !newMatch.id) {
    throw new Error("Impossible de créer le match dans la base de données");
  }

  // Créer le premier round avec les scores initiaux
  await sql`
    INSERT INTO match_rounds (match_id, round_number, player_1_score, player_2_score, current_player_id)
    VALUES (${newMatch.id}, 1, ${initialScore}, ${initialScore}, ${player1.id})
  `;

  return {
    id: newMatch.id,
    player1,
    player2,
    scores: {
      [player1.username]: initialScore,
      [player2.username]: initialScore,
    },
    currentPlayer: player1, // Le premier joueur commence
    isFinished: false,
    winner: null,
    currentRound: 1,
  };
}

// Récupérer une partie par ID
export async function getGameById(matchId: string): Promise<GameData | null> {
  const initialScore = 301; // Score initial standard pour le 301

  // Vérifier si matchId est défini
  if (!matchId) {
    console.error("matchId is undefined");
    return null;
  }

  // Récupérer le match
  const match = await sql<Row[]>`
    SELECT * FROM matches WHERE id = ${matchId}
  `;

  if (match.length === 0) {
    console.error("No match found for matchId:", matchId);
    return null;
  }

  const matchData = match[0];

  // Vérifier que matchData et matchData.id sont définis
  if (!matchData || !matchData.id) {
    console.error("Match data is invalid for matchId:", matchId);
    return null;
  }

  // Récupérer les joueurs
  const players = await sql<Row[]>`
    SELECT id, username, display_name
    FROM players 
    WHERE id IN (${matchData.player_1_id}, ${matchData.player_2_id})
  `;

  if (players.length !== 2) {
    return null;
  }

  // Mapper les résultats SQL vers notre interface Player
  const playersData = players.map(mapRowToPlayer);

  const player1 = playersData.find((p: Player) => p.id === matchData.player_1_id);
  const player2 = playersData.find((p: Player) => p.id === matchData.player_2_id);

  if (!player1 || !player2) {
    console.error("Players not found for matchId:", matchId);
    return null;
  }

  // Récupérer le dernier round
  const rounds = await sql<Row[]>`
    SELECT * FROM match_rounds 
    WHERE match_id = ${matchId} 
    ORDER BY round_number DESC 
    LIMIT 1
  `;

  const lastRound = rounds[0] as MatchRound | undefined;

  // Vérifier que lastRound est défini si rounds n'est pas vide
  if (rounds.length > 0 && !lastRound) {
    console.error("Last round is invalid for matchId:", matchId);
    return null;
  }

  // Déterminer le joueur actuel en utilisant le current_player_id
  let currentPlayer = player1;
  if (lastRound && lastRound.current_player_id) {
    if (lastRound.current_player_id === player2.id) {
      currentPlayer = player2;
    }
  } else {
    // Si pas de current_player_id (anciennes parties), utiliser la logique précédente
    if (lastRound && lastRound.player_1_score < lastRound.player_2_score) {
      currentPlayer = player2;
    }
  }

  // Vérifier si la partie est terminée
  const isFinished = matchData.finished_at !== null;
  let winner: Player | null = null;

  if (isFinished && matchData.winner_id) {
    winner = playersData.find((p: Player) => p.id === matchData.winner_id) || null;

    // Vérifier que le gagnant est défini
    if (!winner) {
      console.error("Winner not found for matchId:", matchId);
      return null;
    }
  }

  // Vérifier que lastRound a les scores nécessaires si défini
  if (
    lastRound &&
    (lastRound.player_1_score === undefined ||
      lastRound.player_2_score === undefined)
  ) {
    console.error(
      "Last round is missing required scores for matchId:",
      matchId
    );
    return null;
  }

  return {
    id: matchData.id,
    player1,
    player2,
    scores: {
      [player1.username]: lastRound ? lastRound.player_1_score : initialScore,
      [player2.username]: lastRound ? lastRound.player_2_score : initialScore,
    },
    currentPlayer,
    isFinished,
    winner,
    currentRound: lastRound ? lastRound.round_number : 1,
  };
}

// Mettre à jour une partie avec un nouveau tour
export async function updateGameWithTurn(
  matchId: string,
  totalScore: number
): Promise<GameData> {
  const game = await getGameById(matchId);

  if (!game || game.isFinished) {
    throw new Error("Game not found or already finished");
  }

  const currentPlayer = game.currentPlayer;
  const currentScore = game.scores[currentPlayer.username];
  const newScore = currentScore - totalScore;

  // Vérifier les règles du 301
  if (newScore < 0) {
    throw new Error("Cannot go below 0 points");
  }

  // Empêcher de laisser 1 point (impossible de finir sur un double)
  if (newScore === 1) {
    throw new Error("Cannot leave 1 point (must finish on a double)");
  }

  // Vérifier si la partie est terminée (score exact à 0)
  let isFinished = false;
  let winner: Player | null = null;
  let winnerId: string | null = null;
  let finishedAt: Date | null = null;

  if (newScore === 0) {
    isFinished = true;
    winner = currentPlayer;
    winnerId = currentPlayer.id;
    finishedAt = new Date();
  }

  // Déterminer le prochain joueur
  const nextPlayer =
    currentPlayer.id === game.player1.id ? game.player2 : game.player1;

  // Calculer les nouveaux scores pour chaque joueur
  const newPlayer1Score =
    currentPlayer.id === game.player1.id
      ? newScore
      : game.scores[game.player1.username];
  const newPlayer2Score =
    currentPlayer.id === game.player2.id
      ? newScore
      : game.scores[game.player2.username];

  // Créer un nouveau round
  const nextRoundNumber = game.currentRound + 1;

  await sql`
    INSERT INTO match_rounds (match_id, round_number, player_1_score, player_2_score, current_player_id)
    VALUES (${matchId}, ${nextRoundNumber}, ${newPlayer1Score}, ${newPlayer2Score}, ${nextPlayer.id})
  `;

  // Mettre à jour le match si la partie est terminée
  if (isFinished) {
    await sql`
      UPDATE matches
      SET winner_id = ${winnerId}, finished_at = ${finishedAt}
      WHERE id = ${matchId}
    `;
  }

  return {
    ...game,
    scores: {
      [game.player1.username]: newPlayer1Score,
      [game.player2.username]: newPlayer2Score,
    },
    currentPlayer: nextPlayer,
    isFinished,
    winner,
    currentRound: nextRoundNumber,
  };
}

// Vérifier si une partie est terminée
export function isGameFinished(game: GameData | null): boolean {
  return game?.isFinished || false;
}

// Récupérer les parties en cours
export async function getOngoingGames(): Promise<GameData[]> {
  const ongoingMatches = await sql<Row[]>`
    SELECT id, player_1_id, player_2_id 
    FROM matches 
    WHERE winner_id IS NULL AND finished_at IS NULL
    ORDER BY created_at DESC
  `;

  const games: GameData[] = [];

  for (const match of ongoingMatches) {
    const game = await getGameById(match.id);
    if (game && !game.isFinished) {
      games.push(game);
    }
  }

  return games;
}

// Supprimer une partie
export async function deleteGame(matchId: string): Promise<void> {
  // Vérifier si matchId est défini
  if (!matchId) {
    throw new Error("matchId is undefined");
  }

  // Supprimer les rounds associés
  await sql`
    DELETE FROM match_rounds 
    WHERE match_id = ${matchId}
  `;

  // Supprimer le match
  await sql`
    DELETE FROM matches 
    WHERE id = ${matchId}
  `;
}
