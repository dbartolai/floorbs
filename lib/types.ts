export type GameStatus = "scheduled" | "live" | "final";
export type GamePhase = "pool" | "playoff";
export type ParticipantSourceType = "tbd" | "team" | "seed" | "winner" | "loser";

export type ParticipantSource = {
  type: ParticipantSourceType;
  value: string | null;
};

export type FeedPostType =
  | "score_update"
  | "final_score"
  | "standings_update"
  | "announcement"
  | "smack";

export type Tournament = {
  id: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  created_at?: string;
};

export type Team = {
  id: string;
  tournament_id: string;
  name: string;
  short_name: string;
  city: string | null;
  logo_url: string | null;
  pool: string | null;
  created_at?: string;
};

export type Player = {
  id: string;
  tournament_id: string;
  team_id: string;
  name: string;
  jersey_number: number | null;
  created_at?: string;
};

export type GameRecord = {
  id: string;
  tournament_id: string;
  home_team_id: string | null;
  away_team_id: string | null;
  court: string;
  scheduled_start: string;
  phase: GamePhase;
  title: string;
  home_source_type: ParticipantSourceType;
  home_source_value: string | null;
  away_source_type: ParticipantSourceType;
  away_source_value: string | null;
  status: GameStatus;
  home_score: number;
  away_score: number;
  created_at?: string;
  updated_at?: string;
};

export type GameParticipant = {
  label: string;
  detail: string | null;
  shortLabel: string;
  team: Team | null;
  source: ParticipantSource;
};

export type Game = GameRecord & {
  home_team: Team | null;
  away_team: Team | null;
  home_participant: GameParticipant;
  away_participant: GameParticipant;
};

export type FeedPost = {
  id: string;
  tournament_id: string;
  game_id: string | null;
  type: FeedPostType;
  title: string;
  body: string | null;
  created_by: string | null;
  created_at: string;
};

export type StandingsRow = {
  team: Team;
  gamesPlayed: number;
  wins: number;
  losses: number;
  ties: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifferential: number;
  points: number;
};

export type LeaderRow = {
  rank: number;
  name: string;
  team: string;
  goals: number;
  assists: number;
  points: number;
};

export type TournamentSnapshot = {
  tournament: Tournament;
  teams: Team[];
  players: Player[];
  games: Game[];
  feedPosts: FeedPost[];
  standings: Record<string, StandingsRow[]>;
  liveGames: Game[];
  upcomingGames: Game[];
  finalGames: Game[];
  leaders: LeaderRow[];
};
