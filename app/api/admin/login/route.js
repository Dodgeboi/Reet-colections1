import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { ADMIN_COOKIE, SESSION_MAX_AGE, createSessionToken } from "@/lib/adminSession";
import { adminEmails, isAdminEmail } from "@/lib/adminEmails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort throttle: after 5 wrong tries, an IP waits 15 minutes.
const attempts = new Map();
const MAX_TRIES = 5;
const WINDOW_MS = 15 * 60 * 1000;

function tooManyTries(ip) {
  const a = attempts.get(ip);
  if (!a) return false;
  if (Date.now() - a.first > WINDOW_MS) { attempts.delete(ip); return false; }
  return a.count >= MAX_TRIES;
}
function recordMiss(ip) {
  const a = attempts.get(ip);
  if (!a || Date.now() - a.first > WINDOW_MS) attempts.set(ip, { first: Date.now(), count: 1 });
  else a.count += 1;
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const expectedHash = (process.env.ADMIN_PASSWORD_HASH || "").trim().toLowerCase();
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!adminEmails().length || !expectedHash || !secret) {
      return NextResponse.json({ error: "Admin login isn't configured on the server yet." }, { status: 500 });
    }

    const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
    if (tooManyTries(ip)) {
      return NextResponse.json({ error: "Too many attempts — please wait 15 minutes and try again." }, { status: 429 });
    }

    const hash = crypto.createHash("sha256").update(String(password || ""), "utf8").digest("hex");
    const emailOk = isAdminEmail(email);
    const passOk = hash.length === expectedHash.length &&
      crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
    if (!emailOk || !passOk) {
      recordMiss(ip);
      return NextResponse.json({ error: "That email or password isn't right." }, { status: 401 });
    }

    attempts.delete(ip);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, await createSessionToken(secret), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Something went wrong — please try again." }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
