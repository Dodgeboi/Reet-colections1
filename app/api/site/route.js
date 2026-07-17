import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { readJson, writeJson } from "@/lib/store";
import { getSiteSettings } from "@/lib/siteSettings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STRING_KEYS = ["hero", "heritage", "about"];
const MAP_KEYS = ["liveThumbs", "categoryTiles"];
const validImage = (v) => typeof v === "string" && (v.startsWith("/images/") || v.startsWith("/api/uploads/") || v.startsWith("https://"));
const validId = (v) => /^[\w-]{1,80}$/.test(v);

export async function GET() {
  return NextResponse.json(await getSiteSettings());
}

// Owner updates image slots and/or per-item image maps.
export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const saved = await readJson("site.json", {});
    for (const k of STRING_KEYS) {
      if (body[k] !== undefined) {
        if (!validImage(body[k])) return NextResponse.json({ error: `Invalid image for "${k}".` }, { status: 400 });
        saved[k] = body[k];
      }
    }
    if (body.text !== undefined) {
      if (!body.text || typeof body.text !== "object") return NextResponse.json({ error: "Invalid text payload." }, { status: 400 });
      for (const [key, value] of Object.entries(body.text)) {
        if (!/^[\w.:-]{1,80}$/.test(key) || typeof value !== "string" || value.length > 1200) {
          return NextResponse.json({ error: `Invalid text for "${key}".` }, { status: 400 });
        }
      }
      saved.text = { ...(saved.text || {}), ...body.text };
    }
    for (const k of MAP_KEYS) {
      if (body[k] !== undefined) {
        if (!body[k] || typeof body[k] !== "object") return NextResponse.json({ error: `Invalid value for "${k}".` }, { status: 400 });
        for (const [id, url] of Object.entries(body[k])) {
          if (!validId(id) || !validImage(url)) return NextResponse.json({ error: `Invalid image for "${k}.${id}".` }, { status: 400 });
        }
        saved[k] = { ...(saved[k] || {}), ...body[k] };
      }
    }
    await writeJson("site.json", saved);
    return NextResponse.json({ ok: true, settings: await getSiteSettings() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
