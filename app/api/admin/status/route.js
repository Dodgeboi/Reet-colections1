import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { writesPersist } from "@/lib/store";
import { googleEnabled } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

// Owner check + dashboard health. Never cached, so one owner's 200 can never
// be served to anyone else.
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }
  return NextResponse.json({
    owner: true,
    writable: writesPersist(),
    google: googleEnabled(),
    aiImport: !!process.env.ANTHROPIC_API_KEY,
  }, { headers: NO_STORE });
}
