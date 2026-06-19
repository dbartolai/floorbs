import { calculateStandings } from "@/lib/standings";
import {
  formatGameReference,
  getGameParticipantSource,
  teamForSeed
} from "@/lib/playoff-sources";
import type {
  FeedPost,
  GameParticipant,
  Game,
  GameRecord,
  LeaderRow,
  ParticipantSource,
  Player,
  StandingsRow,
  Team,
  Tournament,
  TournamentSnapshot
} from "@/lib/types";

function tbdParticipant(
  source: ParticipantSource = { type: "tbd", value: null }
): GameParticipant {
  return {
    label: "TBD",
    detail: null,
    shortLabel: "TBD",
    team: null,
    source
  };
}

function teamParticipant(team: Team, source: GameParticipant["source"]): GameParticipant {
  return {
    label: team.name,
    detail: null,
    shortLabel: team.short_name,
    team,
    source
  };
}

function resolveWinnerLoser(
  sourceGame: Game,
  mode: "winner" | "loser"
): GameParticipant | null {
  if (sourceGame.status !== "final") return null;
  if (sourceGame.home_score === sourceGame.away_score) return null;

  const homeWon = sourceGame.home_score > sourceGame.away_score;
  if (mode === "winner") {
    return homeWon ? sourceGame.home_participant : sourceGame.away_participant;
  }

  return homeWon ? sourceGame.away_participant : sourceGame.home_participant;
}

function resolveParticipant(input: {
  game: GameRecord;
  side: "home" | "away";
  teamsById: Map<string, Team>;
  standings: Record<string, StandingsRow[]>;
  gamesById: Map<string, Game>;
}): GameParticipant {
  const source = getGameParticipantSource(input.game, input.side);

  if (source.type === "tbd") {
    return tbdParticipant(source);
  }

  if (source.type === "team") {
    const team = source.value ? input.teamsById.get(source.value) : null;
    return team ? teamParticipant(team, source) : tbdParticipant(source);
  }

  if (source.type === "seed") {
    const team = teamForSeed(input.standings, source.value);
    return {
      label: source.value ?? "Seed",
      detail: team ? team.name : "Projected from standings",
      shortLabel: source.value ?? "Seed",
      team,
      source
    };
  }

  const sourceGame = source.value ? input.gamesById.get(source.value) : null;
  const prefix = source.type === "winner" ? "Winner" : "Loser";
  const label = sourceGame ? `${prefix} of ${formatGameReference(sourceGame)}` : prefix;
  const resolved = sourceGame ? resolveWinnerLoser(sourceGame, source.type) : null;

  return {
    label,
    detail: resolved ? resolved.detail ?? resolved.label : null,
    shortLabel: source.type === "winner" ? "W" : "L",
    team: resolved?.team ?? null,
    source
  };
}

export function hydrateGames(
  games: GameRecord[],
  teams: Team[],
  standings: Record<string, StandingsRow[]>
): Game[] {
  const byId = new Map(teams.map((team) => [team.id, team]));
  const hydratedById = new Map<string, Game>();

  return [...games]
    .sort(
      (a, b) =>
        new Date(a.scheduled_start).getTime() -
        new Date(b.scheduled_start).getTime()
    )
    .map((game) => {
      const homeParticipant = resolveParticipant({
        game,
        side: "home",
        teamsById: byId,
        standings,
        gamesById: hydratedById
      });
      const awayParticipant = resolveParticipant({
        game,
        side: "away",
        teamsById: byId,
        standings,
        gamesById: hydratedById
      });
      const hydrated: Game = {
        ...game,
        phase: game.phase ?? "pool",
        title: game.title ?? "Pool Play",
        home_team: homeParticipant.team,
        away_team: awayParticipant.team,
        home_participant: homeParticipant,
        away_participant: awayParticipant
      };

      hydratedById.set(game.id, hydrated);
      return hydrated;
    });
}

export function buildSnapshot(input: {
  tournament: Tournament;
  teams: Team[];
  players: Player[];
  games: GameRecord[];
  feedPosts: FeedPost[];
  leaders: LeaderRow[];
}): TournamentSnapshot {
  const standings = calculateStandings(input.teams, input.games);
  const games = hydrateGames(input.games, input.teams, standings);
  const feedPosts = [...input.feedPosts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return {
    tournament: input.tournament,
    teams: input.teams,
    players: input.players,
    games,
    feedPosts,
    standings,
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
