import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PENDING_COOKIE, PENDING_MAX_AGE, createPendingToken, createSessionToken, ADMIN_COOKIE, SESSION_MAX_AGE } from "@/lib/adminSession";
import { isAdminEmail } from "@/lib/adminEmails";
import { adminTwoFactorEnabled, issueCode } from "@/lib/adminOtp";
import { requestIp, tooManyTries } from "@/lib/loginThrottle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// First factor for owners who sign in with Google instead of a password:
// the visitor must already hold a real NextAuth session (server-verified,
// not client-supplied) whose email is an owner. That earns a 2FA code, same
// as the password path — Google alone never grants the admin cookie.
export async function POST(req) {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Admin login isn't configured on the server yet." }, { status: 500 });
    }

    const ip = requestIp(req);
    if (tooManyTries(`${ip}:google`)) {
      return NextResponse.json({ error: "Too many attempts — please wait 15 minutes and try again." }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    const email = String(session?.user?.email || "").trim().toLowerCase();
    if (!isAdminEmail(email)) {
      return NextResponse.json({ error: "That Google account isn't an owner account." }, { status: 403 });
    }

    if (!adminTwoFactorEnabled()) {
      const res = NextResponse.json({ ok: true });
      res.cookies.set(ADMIN_COOKIE, await createSessionToken(secret), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
      return res;
    }

    await issueCode(email);
    const res = NextResponse.json({ ok: true, stage: "code", email });
    res.cookies.set(PENDING_COOKIE, await createPendingToken(secret, email), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: PENDING_MAX_AGE,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Something went wrong — please try again." }, { status: 500 });
  }
}
