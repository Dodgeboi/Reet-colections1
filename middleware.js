import { NextResponse } from "next/server";
export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const token = req.cookies.get("reet_admin")?.value;
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
