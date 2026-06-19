import {
  demoFeedPosts,
  demoGames,
  demoLeaders,
  demoPlayers,
  demoTeams,
  demoTournament
} from "@/lib/demo-data";
import { normalizeSource } from "@/lib/playoff-sources";
import { calculateStandings } from "@/lib/standings";
import { buildSnapshot, hydrateGames } from "@/lib/snapshot";
import type {
  FeedPost,
  FeedPostType,
  GameRecord,
  GameStatus,
  ParticipantSource
} from "@/lib/types";

const store = globalThis as typeof globalThis & {
  __floorbsDemoStore?: {
    games: GameRecord[];
    feedPosts: FeedPost[];
  };
};

if (!store.__floorbsDemoStore) {
  store.__floorbsDemoStore = {
    games: demoGames.map((game) => ({ ...game })),
    feedPosts: demoFeedPosts.map((post) => ({ ...post }))
  };
}

function currentStore() {
  return store.__floorbsDemoStore!;
}

export function getDemoSnapshot() {
  const data = currentStore();

  return buildSnapshot({
    tournament: demoTournament,
    teams: demoTeams,
    players: demoPlayers,
    games: data.games,
    feedPosts: data.feedPosts,
    leaders: demoLeaders
  });
}

export function updateDemoGame(
  gameId: string,
  patch: Partial<
    Pick<
      GameRecord,
      | "home_score"
      | "away_score"
      | "status"
      | "home_team_id"
      | "away_team_id"
      | "home_source_type"
      | "home_source_value"
      | "away_source_type"
      | "away_source_value"
    >
  >
) {
  const data = currentStore();
  const game = data.games.find((item) => item.id === gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  if (typeof patch.home_score === "number") {
    game.home_score = Math.max(0, patch.home_score);
  }
  if (typeof patch.away_score === "number") {
    game.away_score = Math.max(0, patch.away_score);
  }
  if (patch.status) {
    game.status = patch.status as GameStatus;
  }
  applySourcePatch(game, "home", {
    type: patch.home_source_type,
    value: patch.home_source_value
  });
  applySourcePatch(game, "away", {
    type: patch.away_source_type,
    value: patch.away_source_value
  });
  game.updated_at = new Date().toISOString();

  return hydrateGames([game], demoTeams, calculateStandings(demoTeams, data.games))[0];
}

function applySourcePatch(
  game: GameRecord,
  side: "home" | "away",
  source: Partial<ParticipantSource>
) {
  if (!source.type) return;

  const normalized = normalizeSource(source.type, source.value);
  if (side === "home") {
    game.home_source_type = normalized.type;
    game.home_source_value = normalized.value;
    game.home_team_id = normalized.type === "team" ? normalized.value : null;
  } else {
    game.away_source_type = normalized.type;
    game.away_source_value = normalized.value;
    game.away_team_id = normalized.type === "team" ? normalized.value : null;
  }
}

export function createDemoFeedPost(input: {
  title: string;
  body?: string | null;
  type?: FeedPostType;
  gameId?: string | null;
  createdBy?: string | null;
}) {
  const data = currentStore();
  const post: FeedPost = {
    id: crypto.randomUUID(),
    tournament_id: demoTournament.id,
    game_id: input.gameId ?? null,
    type: input.type ?? "announcement",
    title: input.title,
    body: input.body ?? null,
    created_by: input.createdBy ?? "Scorer",
    created_at: new Date().toISOString()
  };

  data.feedPosts.unshift(post);
  return post;
}

export function resetDemoStore() {
  store.__floorbsDemoStore = {
    games: demoGames.map((game) => ({ ...game })),
    feedPosts: demoFeedPosts.map((post) => ({ ...post }))
  };
}
