import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminSession";
import { ipAllowed } from "@/lib/adminAccess";
import { requestIp } from "@/lib/loginThrottle";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Optional defense-in-depth layer (ADMIN_IP_ALLOWLIST) — off by default.
  if (!ipAllowed(requestIp(req))) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (pathname === "/admin/login") return NextResponse.next();

  // The ADMIN_COOKIE is the only session that grants /admin access, and it's
  // only ever issued after 2FA (see app/api/admin/login/*). A Google sign-in
  // that's an owner email still has to complete the emailed-code step first —
  // there is no direct Google bypass here.
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (await verifySessionToken(process.env.ADMIN_SESSION_SECRET, token)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*"] };
