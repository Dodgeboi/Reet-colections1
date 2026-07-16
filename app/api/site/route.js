import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { readJson, writeJson } from "@/lib/store";
import { SITE_DEFAULTS, getSiteSettings } from "@/lib/siteSettings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEYS = Object.keys(SITE_DEFAULTS);
const validImage = (v) => typeof v === "string" && (v.startsWith("/images/") || v.startsWith("/api/uploads/") || v.startsWith("https://"));

export async function GET() {
  return NextResponse.json(await getSiteSettings());
}

// Owner updates one or more image slots: { hero?: url, heritage?: url, about?: url }
export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const saved = await readJson("site.json", {});
    for (const k of KEYS) {
      if (body[k] !== undefined) {
        if (!validImage(body[k])) return NextResponse.json({ error: `Invalid image for "${k}".` }, { status: 400 });
        saved[k] = body[k];
      }
    }
    await writeJson("site.json", saved);
    return NextResponse.json({ ok: true, settings: { ...SITE_DEFAULTS, ...saved } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
