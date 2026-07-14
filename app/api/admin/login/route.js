import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(req) {
  try {
    const { password } = await req.json();
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || !process.env.ADMIN_TOKEN) return NextResponse.json({ error: "Admin login is not configured on the server." }, { status: 500 });
    if (password !== expected) return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("reet_admin", process.env.ADMIN_TOKEN, {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("reet_admin", "", { path: "/", maxAge: 0 });
  return res;
}
