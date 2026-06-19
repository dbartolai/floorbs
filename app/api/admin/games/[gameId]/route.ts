import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateGameForScorer } from "@/lib/admin-data";
import { getSessionFromRequest } from "@/lib/scorer-session";

const updateGameSchema = z.object({
  homeScore: z.number().int().min(0).optional(),
  awayScore: z.number().int().min(0).optional(),
  status: z.enum(["scheduled", "live", "final"]).optional(),
  homeSource: z
    .object({
      type: z.enum(["tbd", "team", "seed", "winner", "loser"]),
      value: z.string().nullable().optional()
    })
    .optional(),
  awaySource: z
    .object({
      type: z.enum(["tbd", "team", "seed", "winner", "loser"]),
      value: z.string().nullable().optional()
    })
    .optional()
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateGameSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }

  const { gameId } = await context.params;
  const game = await updateGameForScorer({
    tournamentId: session.tournamentId,
    gameId,
    ...parsed.data,
    homeSource: parsed.data.homeSource
      ? {
          type: parsed.data.homeSource.type,
          value: parsed.data.homeSource.value ?? null
        }
      : undefined,
    awaySource: parsed.data.awaySource
      ? {
          type: parsed.data.awaySource.type,
          value: parsed.data.awaySource.value ?? null
        }
      : undefined
  });

  return NextResponse.json({ game });
}
