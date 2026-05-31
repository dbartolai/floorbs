import {
  demoFeedPosts,
  demoGames,
  demoLeaders,
  demoPlayers,
  demoTeams,
  demoTournament
} from "@/lib/demo-data";
import { buildSnapshot, hydrateGames } from "@/lib/snapshot";
import type { FeedPost, FeedPostType, GameRecord, GameStatus } from "@/lib/types";

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
  patch: Partial<Pick<GameRecord, "home_score" | "away_score" | "status">>
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
  game.updated_at = new Date().toISOString();

  return hydrateGames([game], demoTeams)[0];
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
