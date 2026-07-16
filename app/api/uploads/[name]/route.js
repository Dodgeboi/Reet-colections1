import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };

// Serves locally-uploaded photos (production photos live on Vercel Blob and
// never hit this route).
export async function GET(_req, { params }) {
  const name = String(params.name || "");
  if (!/^[\w.-]+$/.test(name)) return new NextResponse("Not found", { status: 404 });
  try {
    const file = await readFile(path.join(UPLOAD_DIR, name));
    const ext = name.split(".").pop().toLowerCase();
    return new NextResponse(file, {
      headers: {
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
