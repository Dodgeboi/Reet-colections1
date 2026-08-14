import { NextResponse } from "next/server";
import { ADMIN_COOKIE, SESSION_MAX_AGE, PENDING_COOKIE, createSessionToken, verifyPendingToken } from "@/lib/adminSession";
import { checkCode } from "@/lib/adminOtp";
import { requestIp, tooManyTries, recordMiss, clearTries } from "@/lib/loginThrottle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Step 2 of owner login: the emailed 6-digit code. Requires a valid pending
// token from step 1 (password or Google) — the code alone is never enough.
export async function POST(req) {
  try {
    const { code } = await req.json();
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Admin login isn't configured on the server yet." }, { status: 500 });
    }

    const ip = requestIp(req);
    if (tooManyTries(`${ip}:code`)) {
      return NextResponse.json({ error: "Too many attempts — please wait 15 minutes and try again." }, { status: 429 });
    }

    const pending = req.cookies.get(PENDING_COOKIE)?.value;
    const email = await verifyPendingToken(secret, pending);
    if (!email) {
      return NextResponse.json({ error: "That code expired — please sign in again." }, { status: 401 });
    }

    const ok = await checkCode(email, code);
    if (!ok) {
      recordMiss(`${ip}:code`);
      return NextResponse.json({ error: "That code isn't right." }, { status: 401 });
    }
    clearTries(`${ip}:code`);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, await createSessionToken(secret), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    res.cookies.set(PENDING_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  } catch {
    return NextResponse.json({ error: "Something went wrong — please try again." }, { status: 500 });
  }
}
