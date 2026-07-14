import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { readJson, writeJson } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readJson("subscribers.json", []));
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }
    const list = await readJson("subscribers.json", []);
    if (!list.find((s) => s.email.toLowerCase() === email.toLowerCase())) {
      list.unshift({ email, at: new Date().toISOString() });
      await writeJson("subscribers.json", list);
    }
    return NextResponse.json({ ok: true, count: list.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
