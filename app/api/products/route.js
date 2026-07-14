import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { readJson, writeJson } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await readJson("products.json", []);
  return NextResponse.json(Array.isArray(data) ? data : []);
}

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!Array.isArray(body)) return NextResponse.json({ error: "Expected an array of products." }, { status: 400 });
    await writeJson("products.json", body);
    return NextResponse.json({ ok: true, count: body.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
