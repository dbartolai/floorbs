import type {
  FeedPost,
  GameRecord,
  LeaderRow,
  Player,
  Team,
  Tournament
} from "@/lib/types";

export const DEMO_TOURNAMENT_ID = "00000000-0000-4000-8000-000000000001";

function demoId(value: number) {
  return `00000000-0000-4000-8000-${String(value).padStart(12, "0")}`;
}

function chicagoTimeToIso(date: string, time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return `${date}T${String(hour + 5).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}:00.000Z`;
}

export const demoTournament: Tournament = {
  id: DEMO_TOURNAMENT_ID,
  name: "US Nationals Adult Championship",
  location: "Blackhawks Ice Center",
  start_date: "2026-06-19",
  end_date: "2026-06-21",
  created_at: "2026-06-18T12:00:00.000Z"
};

const teamSeeds = [
  ["Austin FBC", "AUS", "Group A"],
  ["Chi Mad Dogs", "CMD", "Group A"],
  ["Mountain West", "MW", "Group A"],
  ["Tomah", "TOM", "Group A"],
  ["Chi Hound Dogs", "CHD", "Group A"],
  ["Chi Dogs", "CD", "Group B"],
  ["N2FA", "N2FA", "Group B"],
  ["Minnesota FBC", "MIN", "Group B"],
  ["Triangle FBC", "TRI", "Group B"],
  ["USA MU19", "U19", "Group C"],
  ["Richmond FBC", "RIC", "Group C"],
  ["Stars", "STR", "Group C"],
  ["R. River Dogs", "RRD", "Group C"]
] as const;

export const demoTeams: Team[] = teamSeeds.map(([name, shortName, pool], index) => ({
  id: demoId(101 + index),
  tournament_id: DEMO_TOURNAMENT_ID,
  name,
  short_name: shortName,
  city: null,
  logo_url: null,
  pool
}));

const teamIds = new Map(demoTeams.map((team) => [team.name, team.id]));

function teamId(name: string) {
  const id = teamIds.get(name);
  if (!id) throw new Error(`Unknown demo team: ${name}`);
  return id;
}

function poolGame(
  index: number,
  date: string,
  time: string,
  home: string,
  away: string
): GameRecord {
  const homeTeamId = teamId(home);
  const awayTeamId = teamId(away);

  return {
    id: demoId(301 + index),
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: homeTeamId,
    away_team_id: awayTeamId,
    court: "Rink",
    scheduled_start: chicagoTimeToIso(date, time),
    phase: "pool",
    title: "Pool Play",
    home_source_type: "team",
    home_source_value: homeTeamId,
    away_source_type: "team",
    away_source_value: awayTeamId,
    status: "scheduled",
    home_score: 0,
    away_score: 0
  };
}

function playoffGame(index: number, date: string, time: string, title: string): GameRecord {
  return {
    id: demoId(323 + index),
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: null,
    away_team_id: null,
    court: "Rink",
    scheduled_start: chicagoTimeToIso(date, time),
    phase: "playoff",
    title,
    home_source_type: "tbd",
    home_source_value: null,
    away_source_type: "tbd",
    away_source_value: null,
    status: "scheduled",
    home_score: 0,
    away_score: 0
  };
}

const poolGames: GameRecord[] = [
  poolGame(0, "2026-06-19", "07:00", "Austin FBC", "Chi Mad Dogs"),
  poolGame(1, "2026-06-19", "07:40", "Mountain West", "Tomah"),
  poolGame(2, "2026-06-19", "08:20", "Minnesota FBC", "Chi Dogs"),
  poolGame(3, "2026-06-19", "09:00", "Tomah", "Chi Hound Dogs"),
  poolGame(4, "2026-06-19", "09:40", "Triangle FBC", "N2FA"),
  poolGame(5, "2026-06-19", "10:20", "USA MU19", "Richmond FBC"),
  poolGame(6, "2026-06-19", "11:00", "Stars", "R. River Dogs"),
  poolGame(7, "2026-06-19", "11:40", "Tomah", "Chi Mad Dogs"),
  poolGame(8, "2026-06-19", "12:20", "Chi Hound Dogs", "Mountain West"),
  poolGame(9, "2026-06-19", "13:00", "N2FA", "Minnesota FBC"),
  poolGame(10, "2026-06-19", "13:40", "Chi Hound Dogs", "Austin FBC"),
  poolGame(11, "2026-06-19", "14:20", "Chi Dogs", "Triangle FBC"),
  poolGame(12, "2026-06-19", "15:00", "R. River Dogs", "USA MU19"),
  poolGame(13, "2026-06-19", "15:40", "Richmond FBC", "Stars"),
  poolGame(14, "2026-06-19", "16:20", "Chi Mad Dogs", "Chi Hound Dogs"),
  poolGame(15, "2026-06-19", "17:00", "Mountain West", "Austin FBC"),
  poolGame(16, "2026-06-20", "07:20", "Chi Dogs", "N2FA"),
  poolGame(17, "2026-06-20", "08:00", "Minnesota FBC", "Triangle FBC"),
  poolGame(18, "2026-06-20", "08:40", "Richmond FBC", "R. River Dogs"),
  poolGame(19, "2026-06-20", "09:20", "USA MU19", "Stars"),
  poolGame(20, "2026-06-20", "10:00", "Austin FBC", "Tomah"),
  poolGame(21, "2026-06-20", "10:40", "Chi Mad Dogs", "Mountain West")
];

const playoffGames: GameRecord[] = [
  playoffGame(0, "2026-06-20", "11:20", "Playoff Game"),
  playoffGame(1, "2026-06-20", "12:00", "Playoff Game"),
  playoffGame(2, "2026-06-20", "12:40", "Playoff Game"),
  playoffGame(3, "2026-06-20", "13:20", "Playoff Game"),
  playoffGame(4, "2026-06-20", "14:00", "Playoff Game"),
  playoffGame(5, "2026-06-20", "14:40", "Playoff Game"),
  playoffGame(6, "2026-06-20", "15:20", "Playoff Game"),
  playoffGame(7, "2026-06-20", "16:00", "Playoff Game"),
  playoffGame(8, "2026-06-20", "16:40", "Playoff Game"),
  playoffGame(9, "2026-06-21", "07:20", "Playoff Game"),
  playoffGame(10, "2026-06-21", "08:00", "Playoff Game"),
  playoffGame(11, "2026-06-21", "08:40", "Playoff Game"),
  playoffGame(12, "2026-06-21", "09:20", "Playoff Game"),
  playoffGame(13, "2026-06-21", "10:00", "Semi Final"),
  playoffGame(14, "2026-06-21", "10:40", "Semi Final"),
  playoffGame(15, "2026-06-21", "11:20", "Bronze Medal Game"),
  playoffGame(16, "2026-06-21", "12:00", "Gold Medal Game")
];

export const demoGames: GameRecord[] = [...poolGames, ...playoffGames];
export const demoPlayers: Player[] = [];
export const demoLeaders: LeaderRow[] = [];

export const demoFeedPosts: FeedPost[] = [
  {
    id: demoId(401),
    tournament_id: DEMO_TOURNAMENT_ID,
    game_id: null,
    type: "announcement",
    title: "US Nationals schedule is live",
    body: "Pool play is loaded for Friday and Saturday morning. Playoff slots will update as seeds are assigned.",
    created_by: "Tournament desk",
    created_at: "2026-06-18T18:00:00.000Z"
  },
  {
    id: demoId(402),
    tournament_id: DEMO_TOURNAMENT_ID,
    game_id: null,
    type: "announcement",
    title: "Playoff matchups are editable",
    body: "Scorers can assign teams, group seeds, or winners from earlier playoff games from the admin page.",
    created_by: "Tournament desk",
    created_at: "2026-06-18T18:05:00.000Z"
  }
];
