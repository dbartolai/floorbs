import { DEMO_TOURNAMENT_ID } from "@/lib/demo-data";
import { createDemoFeedPost, getDemoSnapshot, updateDemoGame } from "@/lib/demo-store";
import { normalizeSource } from "@/lib/playoff-sources";
import { getAdminSupabaseClient, hasSupabaseAdminEnv } from "@/lib/supabase";
import { hashScorerCode } from "@/lib/scorer-session";
import type { FeedPostType, GameRecord, GameStatus, ParticipantSource } from "@/lib/types";

export async function verifyScorerCode(code: string) {
  const cleanCode = code.trim();
  const supabase = getAdminSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("scorer_codes")
      .select("id,tournament_id,display_name,role,active")
      .eq("code_hash", hashScorerCode(cleanCode))
      .eq("active", true)
      .maybeSingle<{
        id: string;
        tournament_id: string;
        display_name: string;
        role: string;
        active: boolean;
      }>();

    if (error) throw error;
    if (!data) return null;

    return {
      scorerCodeId: data.id,
      tournamentId: data.tournament_id,
      displayName: data.display_name,
      role: data.role
    };
  }

  const fallbackCode = process.env.DEMO_SCORER_CODE ?? "123456";
  if (cleanCode !== fallbackCode) return null;

  return {
    scorerCodeId: "demo-scorer-code",
    tournamentId: DEMO_TOURNAMENT_ID,
    displayName: "Demo scorer",
    role: "scorer"
  };
}

export async function updateGameForScorer(input: {
  tournamentId: string;
  gameId: string;
  homeScore?: number;
  awayScore?: number;
  status?: GameStatus;
  homeSource?: ParticipantSource;
  awaySource?: ParticipantSource;
}) {
  const patch: Partial<
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
  > = {};

  if (typeof input.homeScore === "number") patch.home_score = Math.max(0, input.homeScore);
  if (typeof input.awayScore === "number") patch.away_score = Math.max(0, input.awayScore);
  if (input.status) patch.status = input.status;
  if (input.homeSource) {
    const source = normalizeSource(input.homeSource.type, input.homeSource.value);
    patch.home_source_type = source.type;
    patch.home_source_value = source.value;
    patch.home_team_id = source.type === "team" ? source.value : null;
  }
  if (input.awaySource) {
    const source = normalizeSource(input.awaySource.type, input.awaySource.value);
    patch.away_source_type = source.type;
    patch.away_source_value = source.value;
    patch.away_team_id = source.type === "team" ? source.value : null;
  }

  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return updateDemoGame(input.gameId, patch);
  }

  const { data, error } = await supabase
    .from("games")
    .update(patch)
    .eq("id", input.gameId)
    .eq("tournament_id", input.tournamentId)
    .select("*")
    .single<GameRecord>();

  if (error) throw error;
  return data;
}

export async function createFeedPostForScorer(input: {
  tournamentId: string;
  title: string;
  body?: string | null;
  type: FeedPostType;
  gameId?: string | null;
  createdBy: string;
}) {
  const supabase = getAdminSupabaseClient();

  if (!supabase) {
    return createDemoFeedPost({
      title: input.title,
      body: input.body,
      type: input.type,
      gameId: input.gameId,
      createdBy: input.createdBy
    });
  }

  const { data, error } = await supabase
    .from("feed_posts")
    .insert({
      tournament_id: input.tournamentId,
      game_id: input.gameId ?? null,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      created_by: input.createdBy
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export function usingDemoAdminStore() {
  return !hasSupabaseAdminEnv();
}

export async function getAdminSnapshot() {
  return getDemoSnapshot();
}
