import { demoLeaders } from "@/lib/demo-data";
import { getDemoSnapshot } from "@/lib/demo-store";
import { buildSnapshot } from "@/lib/snapshot";
import { getPublicSupabaseClient } from "@/lib/supabase";
import type { FeedPost, GameRecord, Player, Team, Tournament } from "@/lib/types";

async function fetchSupabaseSnapshot() {
  const supabase = getPublicSupabaseClient();
  if (!supabase) return null;

  const { data: namedTournament, error: tournamentError } = await supabase
    .from("tournaments")
    .select("*")
    .eq("name", "Floorbs Cup")
    .maybeSingle<Tournament>();

  if (tournamentError) {
    throw tournamentError;
  }

  let tournament = namedTournament;
  if (!tournament) {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .order("start_date", { ascending: false })
      .limit(1)
      .maybeSingle<Tournament>();

    if (error) throw error;
    tournament = data;
  }

  if (!tournament) return null;

  const [teamsResult, playersResult, gamesResult, feedResult] = await Promise.all([
    supabase
      .from("teams")
      .select("*")
      .eq("tournament_id", tournament.id)
      .order("pool", { ascending: true })
      .order("name", { ascending: true })
      .returns<Team[]>(),
    supabase
      .from("players")
      .select("*")
      .eq("tournament_id", tournament.id)
      .order("team_id", { ascending: true })
      .order("jersey_number", { ascending: true })
      .returns<Player[]>(),
    supabase
      .from("games")
      .select("*")
      .eq("tournament_id", tournament.id)
      .order("scheduled_start", { ascending: true })
      .returns<GameRecord[]>(),
    supabase
      .from("feed_posts")
      .select("*")
      .eq("tournament_id", tournament.id)
      .order("created_at", { ascending: false })
      .limit(30)
      .returns<FeedPost[]>()
  ]);

  if (teamsResult.error) throw teamsResult.error;
  if (playersResult.error) throw playersResult.error;
  if (gamesResult.error) throw gamesResult.error;
  if (feedResult.error) throw feedResult.error;

  return buildSnapshot({
    tournament,
    teams: teamsResult.data ?? [],
    players: playersResult.data ?? [],
    games: gamesResult.data ?? [],
    feedPosts: feedResult.data ?? [],
    leaders: demoLeaders
  });
}

export async function getTournamentSnapshot() {
  try {
    return (await fetchSupabaseSnapshot()) ?? getDemoSnapshot();
  } catch (error) {
    console.warn("Falling back to demo data:", error);
    return getDemoSnapshot();
  }
}
