import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { writesPersist } from "@/lib/store";
import { googleEnabled } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Small health check for the dashboard: is storage connected, is Google
// sign-in configured, is the AI import available?
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    writable: writesPersist(),
    google: googleEnabled(),
    aiImport: !!process.env.ANTHROPIC_API_KEY,
  });
}
