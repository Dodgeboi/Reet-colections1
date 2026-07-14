import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const FILE = path.join(process.cwd(), "data", "products.json");
// Body: [{ id, qty }] — decrements stock; marks sold when it hits zero.
export async function POST(req) {
  try {
    const items = await req.json();
    if (!Array.isArray(items)) return NextResponse.json({ error: "expected array" }, { status: 400 });
    const catalog = JSON.parse(fs.readFileSync(FILE, "utf8"));
    const need = Object.fromEntries(items.map((i) => [i.id, Number(i.qty) || 1]));
    for (const p of catalog) {
      if (need[p.id] != null) {
        p.qty = Math.max(0, (Number(p.qty) || 0) - need[p.id]);
        if (p.qty <= 0) { p.qty = 0; p.status = "sold"; }
      }
    }
    fs.writeFileSync(FILE, JSON.stringify(catalog, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
