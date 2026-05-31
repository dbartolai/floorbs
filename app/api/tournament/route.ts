import { NextResponse } from "next/server";
import { getTournamentSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getTournamentSnapshot();

  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
