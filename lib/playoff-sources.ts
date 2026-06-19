import type {
  GameRecord,
  ParticipantSource,
  ParticipantSourceType,
  StandingsRow
} from "@/lib/types";

const SOURCE_TYPES: ParticipantSourceType[] = ["tbd", "team", "seed", "winner", "loser"];

export function normalizeSource(type: unknown, value: unknown): ParticipantSource {
  const sourceType = SOURCE_TYPES.includes(type as ParticipantSourceType)
    ? (type as ParticipantSourceType)
    : "tbd";

  if (sourceType === "tbd") {
    return { type: "tbd", value: null };
  }

  return {
    type: sourceType,
    value: typeof value === "string" && value.length > 0 ? value : null
  };
}

export function getGameParticipantSource(
  game: GameRecord,
  side: "home" | "away"
): ParticipantSource {
  const teamId = side === "home" ? game.home_team_id : game.away_team_id;
  const type = side === "home" ? game.home_source_type : game.away_source_type;
  const value = side === "home" ? game.home_source_value : game.away_source_value;

  if (!type && teamId) {
    return { type: "team", value: teamId };
  }

  return normalizeSource(type, value ?? teamId);
}

export function sourceOptionValue(source: ParticipantSource) {
  return `${source.type}:${source.value ?? ""}`;
}

export function parseSourceOptionValue(value: string): ParticipantSource {
  const [type, ...rest] = value.split(":");
  return normalizeSource(type, rest.join(":") || null);
}

export function seedCodeForPool(pool: string | null, rank: number) {
  const suffix = pool?.replace(/^Group\s+/i, "").trim();
  return suffix ? `${suffix}${rank}` : `T${rank}`;
}

export function parseSeedCode(value: string | null) {
  const match = value?.match(/^([A-Z])([1-9][0-9]*)$/i);
  if (!match) return null;

  return {
    pool: `Group ${match[1].toUpperCase()}`,
    rank: Number(match[2]),
    code: `${match[1].toUpperCase()}${match[2]}`
  };
}

export function teamForSeed(
  standings: Record<string, StandingsRow[]>,
  seedCode: string | null
) {
  const seed = parseSeedCode(seedCode);
  if (!seed) return null;

  return standings[seed.pool]?.[seed.rank - 1]?.team ?? null;
}

export function formatGameReference(game: Pick<GameRecord, "scheduled_start" | "title">) {
  const time = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(game.scheduled_start));

  return `${time} ${game.title}`;
}
