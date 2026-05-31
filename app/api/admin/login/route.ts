import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyScorerCode } from "@/lib/admin-data";
import { createSessionValue, setSessionCookie } from "@/lib/scorer-session";

const loginSchema = z.object({
  code: z.string().regex(/^\d{6}$/)
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const verified = await verifyScorerCode(parsed.data.code);
  if (!verified) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  const response = NextResponse.json({
    session: {
      displayName: verified.displayName,
      role: verified.role
    }
  });

  setSessionCookie(response, createSessionValue(verified));
  return response;
}
