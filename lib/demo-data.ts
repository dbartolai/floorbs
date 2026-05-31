import type {
  FeedPost,
  GameRecord,
  LeaderRow,
  Player,
  Team,
  Tournament
} from "@/lib/types";

export const DEMO_TOURNAMENT_ID = "00000000-0000-4000-8000-000000000001";

export const demoTournament: Tournament = {
  id: DEMO_TOURNAMENT_ID,
  name: "Floorbs Cup",
  location: "Minneapolis, MN",
  start_date: "2026-06-13",
  end_date: "2026-06-14",
  created_at: "2026-05-31T12:00:00.000Z"
};

export const demoTeams: Team[] = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    tournament_id: DEMO_TOURNAMENT_ID,
    name: "Metro Blades",
    short_name: "MB",
    city: "Minneapolis",
    logo_url: null,
    pool: "Pool A"
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    tournament_id: DEMO_TOURNAMENT_ID,
    name: "North Shore",
    short_name: "NS",
    city: "Duluth",
    logo_url: null,
    pool: "Pool A"
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    tournament_id: DEMO_TOURNAMENT_ID,
    name: "River City",
    short_name: "RC",
    city: "St. Paul",
    logo_url: null,
    pool: "Pool A"
  },
  {
    id: "00000000-0000-4000-8000-000000000104",
    tournament_id: DEMO_TOURNAMENT_ID,
    name: "Capital Crew",
    short_name: "CC",
    city: "Madison",
    logo_url: null,
    pool: "Pool A"
  },
  {
    id: "00000000-0000-4000-8000-000000000105",
    tournament_id: DEMO_TOURNAMENT_ID,
    name: "Prairie Heat",
    short_name: "PH",
    city: "Omaha",
    logo_url: null,
    pool: "Pool B"
  },
  {
    id: "00000000-0000-4000-8000-000000000106",
    tournament_id: DEMO_TOURNAMENT_ID,
    name: "Harbor United",
    short_name: "HU",
    city: "Milwaukee",
    logo_url: null,
    pool: "Pool B"
  },
  {
    id: "00000000-0000-4000-8000-000000000107",
    tournament_id: DEMO_TOURNAMENT_ID,
    name: "Summit FC",
    short_name: "SFC",
    city: "Denver",
    logo_url: null,
    pool: "Pool B"
  },
  {
    id: "00000000-0000-4000-8000-000000000108",
    tournament_id: DEMO_TOURNAMENT_ID,
    name: "Valley Rush",
    short_name: "VR",
    city: "Des Moines",
    logo_url: null,
    pool: "Pool B"
  }
];

export const demoPlayers: Player[] = demoTeams.flatMap((team, teamIndex) => {
  const base = teamIndex * 3;
  return [
    {
      id: `00000000-0000-4000-8000-${String(200 + base).padStart(12, "0")}`,
      tournament_id: DEMO_TOURNAMENT_ID,
      team_id: team.id,
      name: `${team.short_name} Captain`,
      jersey_number: 7
    },
    {
      id: `00000000-0000-4000-8000-${String(201 + base).padStart(12, "0")}`,
      tournament_id: DEMO_TOURNAMENT_ID,
      team_id: team.id,
      name: `${team.short_name} Playmaker`,
      jersey_number: 11
    },
    {
      id: `00000000-0000-4000-8000-${String(202 + base).padStart(12, "0")}`,
      tournament_id: DEMO_TOURNAMENT_ID,
      team_id: team.id,
      name: `${team.short_name} Finisher`,
      jersey_number: 19
    }
  ];
});

export const demoGames: GameRecord[] = [
  {
    id: "00000000-0000-4000-8000-000000000301",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[0].id,
    away_team_id: demoTeams[1].id,
    court: "Court 1",
    scheduled_start: "2026-06-13T14:00:00.000Z",
    status: "final",
    home_score: 4,
    away_score: 2
  },
  {
    id: "00000000-0000-4000-8000-000000000302",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[2].id,
    away_team_id: demoTeams[3].id,
    court: "Court 2",
    scheduled_start: "2026-06-13T14:00:00.000Z",
    status: "final",
    home_score: 3,
    away_score: 3
  },
  {
    id: "00000000-0000-4000-8000-000000000303",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[4].id,
    away_team_id: demoTeams[5].id,
    court: "Court 1",
    scheduled_start: "2026-06-13T15:00:00.000Z",
    status: "final",
    home_score: 5,
    away_score: 1
  },
  {
    id: "00000000-0000-4000-8000-000000000304",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[6].id,
    away_team_id: demoTeams[7].id,
    court: "Court 2",
    scheduled_start: "2026-06-13T15:00:00.000Z",
    status: "final",
    home_score: 2,
    away_score: 4
  },
  {
    id: "00000000-0000-4000-8000-000000000305",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[0].id,
    away_team_id: demoTeams[2].id,
    court: "Court 1",
    scheduled_start: "2026-06-13T16:00:00.000Z",
    status: "final",
    home_score: 6,
    away_score: 4
  },
  {
    id: "00000000-0000-4000-8000-000000000306",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[1].id,
    away_team_id: demoTeams[3].id,
    court: "Court 2",
    scheduled_start: "2026-06-13T16:00:00.000Z",
    status: "final",
    home_score: 3,
    away_score: 1
  },
  {
    id: "00000000-0000-4000-8000-000000000307",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[4].id,
    away_team_id: demoTeams[6].id,
    court: "Court 1",
    scheduled_start: "2026-06-13T17:00:00.000Z",
    status: "live",
    home_score: 2,
    away_score: 2
  },
  {
    id: "00000000-0000-4000-8000-000000000308",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[5].id,
    away_team_id: demoTeams[7].id,
    court: "Court 2",
    scheduled_start: "2026-06-13T17:00:00.000Z",
    status: "live",
    home_score: 1,
    away_score: 3
  },
  {
    id: "00000000-0000-4000-8000-000000000309",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[0].id,
    away_team_id: demoTeams[3].id,
    court: "Court 1",
    scheduled_start: "2026-06-13T18:00:00.000Z",
    status: "scheduled",
    home_score: 0,
    away_score: 0
  },
  {
    id: "00000000-0000-4000-8000-000000000310",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[1].id,
    away_team_id: demoTeams[2].id,
    court: "Court 2",
    scheduled_start: "2026-06-13T18:00:00.000Z",
    status: "scheduled",
    home_score: 0,
    away_score: 0
  },
  {
    id: "00000000-0000-4000-8000-000000000311",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[4].id,
    away_team_id: demoTeams[7].id,
    court: "Court 1",
    scheduled_start: "2026-06-13T19:00:00.000Z",
    status: "scheduled",
    home_score: 0,
    away_score: 0
  },
  {
    id: "00000000-0000-4000-8000-000000000312",
    tournament_id: DEMO_TOURNAMENT_ID,
    home_team_id: demoTeams[5].id,
    away_team_id: demoTeams[6].id,
    court: "Court 2",
    scheduled_start: "2026-06-13T19:00:00.000Z",
    status: "scheduled",
    home_score: 0,
    away_score: 0
  }
];

export const demoFeedPosts: FeedPost[] = [
  {
    id: "00000000-0000-4000-8000-000000000401",
    tournament_id: DEMO_TOURNAMENT_ID,
    game_id: demoGames[7].id,
    type: "score_update",
    title: "Valley Rush opens a two-goal lead",
    body: "Harbor United has time, but Valley Rush is controlling the neutral zone.",
    created_by: "Demo desk",
    created_at: "2026-06-13T17:18:00.000Z"
  },
  {
    id: "00000000-0000-4000-8000-000000000402",
    tournament_id: DEMO_TOURNAMENT_ID,
    game_id: demoGames[5].id,
    type: "final_score",
    title: "Final: North Shore 3, Capital Crew 1",
    body: "North Shore gets back on track with a clean defensive finish.",
    created_by: "Demo desk",
    created_at: "2026-06-13T16:42:00.000Z"
  },
  {
    id: "00000000-0000-4000-8000-000000000403",
    tournament_id: DEMO_TOURNAMENT_ID,
    game_id: null,
    type: "announcement",
    title: "Next block starts at 1:00 PM",
    body: "Warmups are open on both courts. Captains should check in five minutes before start time.",
    created_by: "Tournament desk",
    created_at: "2026-06-13T16:30:00.000Z"
  },
  {
    id: "00000000-0000-4000-8000-000000000404",
    tournament_id: DEMO_TOURNAMENT_ID,
    game_id: null,
    type: "smack",
    title: "Court 1 is loud",
    body: "Bring the noise for the next block.",
    created_by: "Tournament desk",
    created_at: "2026-06-13T15:35:00.000Z"
  }
];

export const demoLeaders: LeaderRow[] = [
  {
    rank: 1,
    name: "Avery Stone",
    team: "Metro Blades",
    goals: 5,
    assists: 2,
    points: 7
  },
  {
    rank: 2,
    name: "Kai Morgan",
    team: "Valley Rush",
    goals: 4,
    assists: 2,
    points: 6
  },
  {
    rank: 3,
    name: "Jordan Vale",
    team: "Prairie Heat",
    goals: 3,
    assists: 3,
    points: 6
  },
  {
    rank: 4,
    name: "Reese Parker",
    team: "North Shore",
    goals: 3,
    assists: 1,
    points: 4
  }
];
