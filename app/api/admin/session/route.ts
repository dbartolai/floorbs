import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/scorer-session";

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);

  return NextResponse.json({
    session: session
      ? {
          displayName: session.displayName,
          role: session.role
        }
      : null
  });
}
