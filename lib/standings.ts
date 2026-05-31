import type { Game, StandingsRow, Team } from "@/lib/types";

function emptyRow(team: Team): StandingsRow {
  return {
    team,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifferential: 0,
    points: 0
  };
}

export function calculateStandings(teams: Team[], games: Game[]) {
  const rows = new Map<string, StandingsRow>();

  for (const team of teams) {
    rows.set(team.id, emptyRow(team));
  }

  for (const game of games) {
    if (game.status !== "final") continue;

    const home = rows.get(game.home_team_id);
    const away = rows.get(game.away_team_id);
    if (!home || !away) continue;

    home.gamesPlayed += 1;
    away.gamesPlayed += 1;
    home.goalsFor += game.home_score;
    home.goalsAgainst += game.away_score;
    away.goalsFor += game.away_score;
    away.goalsAgainst += game.home_score;

    if (game.home_score > game.away_score) {
      home.wins += 1;
      home.points += 3;
      away.losses += 1;
    } else if (game.away_score > game.home_score) {
      away.wins += 1;
      away.points += 3;
      home.losses += 1;
    } else {
      home.ties += 1;
      away.ties += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  for (const row of rows.values()) {
    row.goalDifferential = row.goalsFor - row.goalsAgainst;
  }

  const grouped: Record<string, StandingsRow[]> = {};
  for (const row of rows.values()) {
    const pool = row.team.pool ?? "Tournament";
    grouped[pool] ??= [];
    grouped[pool].push(row);
  }

  for (const pool of Object.keys(grouped)) {
    grouped[pool].sort((a, b) => {
      return (
        b.points - a.points ||
        b.goalDifferential - a.goalDifferential ||
        b.goalsFor - a.goalsFor ||
        a.team.name.localeCompare(b.team.name)
      );
    });
  }

  return grouped;
}
