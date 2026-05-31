import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createFeedPostForScorer } from "@/lib/admin-data";
import { getSessionFromRequest } from "@/lib/scorer-session";

const feedSchema = z.object({
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().max(500).optional().nullable(),
  gameId: z.string().uuid().optional().nullable(),
  type: z.enum([
    "score_update",
    "final_score",
    "standings_update",
    "announcement",
    "smack"
  ])
});

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = feedSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid post" }, { status: 400 });
  }

  const post = await createFeedPostForScorer({
    tournamentId: session.tournamentId,
    title: parsed.data.title,
    body: parsed.data.body,
    type: parsed.data.type,
    gameId: parsed.data.gameId,
    createdBy: session.displayName
  });

  return NextResponse.json({ post });
}
