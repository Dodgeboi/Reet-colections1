import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import fs from "node:fs";
import path from "node:path";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const FILE = path.join(process.cwd(), "data", "subscribers.json");
const read = () => { try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; } };
export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(read());
}
export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "invalid email" }, { status: 400 });
    const list = read();
    if (!list.find((s) => s.email.toLowerCase() === email.toLowerCase())) list.unshift({ email, at: new Date().toISOString() });
    fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
    return NextResponse.json({ ok: true, count: list.length });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
