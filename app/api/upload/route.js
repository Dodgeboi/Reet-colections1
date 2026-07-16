import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { saveUpload, extFromMime } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

// Owner uploads a photo; returns its URL for use anywhere on the site.
export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }
    if (!String(file.type).startsWith("image/")) {
      return NextResponse.json({ error: "Please upload an image (JPG, PNG, or WebP)." }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: "That photo is over 8 MB — please use a smaller one." }, { status: 400 });
    }
    const name = `upload-${Date.now()}-${Math.floor(Math.random() * 1e4)}.${extFromMime(file.type)}`;
    const url = await saveUpload(buffer, name, file.type || "image/jpeg");
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Upload failed." }, { status: 500 });
  }
}
