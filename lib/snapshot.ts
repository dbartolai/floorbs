import { calculateStandings } from "@/lib/standings";
import type {
  FeedPost,
  Game,
  GameRecord,
  LeaderRow,
  Player,
  Team,
  Tournament,
  TournamentSnapshot
} from "@/lib/types";

export function hydrateGames(games: GameRecord[], teams: Team[]): Game[] {
  const byId = new Map(teams.map((team) => [team.id, team]));

  return games
    .map((game) => {
      const home = byId.get(game.home_team_id);
      const away = byId.get(game.away_team_id);
      if (!home || !away) return null;

      return {
        ...game,
        home_team: home,
        away_team: away
      };
    })
    .filter((game): game is Game => Boolean(game));
}

export function buildSnapshot(input: {
  tournament: Tournament;
  teams: Team[];
  players: Player[];
  games: GameRecord[];
  feedPosts: FeedPost[];
  leaders: LeaderRow[];
}): TournamentSnapshot {
  const games = hydrateGames(input.games, input.teams).sort(
    (a, b) =>
      new Date(a.scheduled_start).getTime() -
      new Date(b.scheduled_start).getTime()
  );
  const feedPosts = [...input.feedPosts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return {
    tournament: input.tournament,
    teams: input.teams,
    players: input.players,
    games,
    feedPosts,
    standings: calculateStandings(input.teams, games),
    liveGames: games.filter((game) => game.status === "live"),
    upcomingGames: games.filter((game) => game.status === "scheduled").slice(0, 6),
    finalGames: games
      .filter((game) => game.status === "final")
      .sort(
        (a, b) =>
          new Date(b.scheduled_start).getTime() -
          new Date(a.scheduled_start).getTime()
      ),
    leaders: input.leaders
  };
}
