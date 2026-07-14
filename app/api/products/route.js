import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = path.join(process.cwd(), "data", "products.json");

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
try {
    const body = await req.json();
    if (!Array.isArray(body)) return NextResponse.json({ error: "Expected an array of products." }, { status: 400 });
    fs.writeFileSync(FILE, JSON.stringify(body, null, 2));
    return NextResponse.json({ ok: true, count: body.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
