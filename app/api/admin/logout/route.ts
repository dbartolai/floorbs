import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/scorer-session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
