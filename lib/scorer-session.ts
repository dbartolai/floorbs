import crypto from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

export const SCORER_COOKIE = "floorbs_scorer";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export type ScorerSession = {
  scorerCodeId: string;
  tournamentId: string;
  displayName: string;
  role: string;
  exp: number;
};

function getSessionSecret() {
  return (
    process.env.SCORER_SESSION_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "floorbs-dev-session-secret-change-me"
  );
}

function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function sign(payload: string) {
  return base64Url(
    crypto.createHmac("sha256", getSessionSecret()).update(payload).digest()
  );
}

export function hashScorerCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export function createSessionValue(
  input: Omit<ScorerSession, "exp">,
  ttlSeconds = SESSION_TTL_SECONDS
) {
  const payload = base64Url(
    JSON.stringify({
      ...input,
      exp: Math.floor(Date.now() / 1000) + ttlSeconds
    })
  );

  return `${payload}.${sign(payload)}`;
}

export function verifySessionValue(value: string | undefined) {
  if (!value) return null;

  const [payload, signature] = value.split(".");
  if (!payload || !signature || sign(payload) !== signature) return null;

  try {
    const session = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
        "utf8"
      )
    ) as ScorerSession;

    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: NextRequest) {
  return verifySessionValue(request.cookies.get(SCORER_COOKIE)?.value);
}

export function setSessionCookie(response: NextResponse, value: string) {
  response.cookies.set(SCORER_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SCORER_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}
