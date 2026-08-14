import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { ADMIN_COOKIE, SESSION_MAX_AGE, PENDING_COOKIE, PENDING_MAX_AGE, createSessionToken, createPendingToken } from "@/lib/adminSession";
import { adminEmails, isAdminEmail } from "@/lib/adminEmails";
import { adminTwoFactorEnabled, issueCode } from "@/lib/adminOtp";
import { requestIp, tooManyTries, recordMiss, clearTries } from "@/lib/loginThrottle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sessionCookie(res, secret) {
  return createSessionToken(secret).then((token) => {
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  });
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const expectedHash = (process.env.ADMIN_PASSWORD_HASH || "").trim().toLowerCase();
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!adminEmails().length || !expectedHash || !secret) {
      return NextResponse.json({ error: "Admin login isn't configured on the server yet." }, { status: 500 });
    }

    const ip = requestIp(req);
    if (tooManyTries(`${ip}:password`)) {
      return NextResponse.json({ error: "Too many attempts — please wait 15 minutes and try again." }, { status: 429 });
    }

    const hash = crypto.createHash("sha256").update(String(password || ""), "utf8").digest("hex");
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const emailOk = isAdminEmail(normalizedEmail);
    const passOk = hash.length === expectedHash.length &&
      crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
    if (!emailOk || !passOk) {
      recordMiss(`${ip}:password`);
      return NextResponse.json({ error: "That email or password isn't right." }, { status: 401 });
    }
    clearTries(`${ip}:password`);

    // Password alone is the first factor. If email delivery is configured,
    // a second factor (emailed code) is required before a session is issued.
    if (adminTwoFactorEnabled()) {
      await issueCode(normalizedEmail);
      const res = NextResponse.json({ ok: true, stage: "code" });
      res.cookies.set(PENDING_COOKIE, await createPendingToken(secret, normalizedEmail), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: PENDING_MAX_AGE,
      });
      return res;
    }

    return sessionCookie(NextResponse.json({ ok: true }), secret);
  } catch {
    return NextResponse.json({ error: "Something went wrong — please try again." }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(PENDING_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
