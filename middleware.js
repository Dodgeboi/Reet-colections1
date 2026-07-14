import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminSession";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  // Owner password session
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (await verifySessionToken(process.env.ADMIN_SESSION_SECRET, token)) return NextResponse.next();

  // Or signed in with Google as the owner
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (adminEmail && process.env.NEXTAUTH_SECRET) {
    try {
      const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if ((jwt?.email || "").toLowerCase() === adminEmail) return NextResponse.next();
    } catch {}
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*"] };
