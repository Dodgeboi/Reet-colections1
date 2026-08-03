import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { listAccounts, summarize } from "@/lib/accounts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

// Owner-only: how many people have created an account, plus the list itself.
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }
  const accounts = await listAccounts();
  const people = accounts.map((a) => ({
    email: a.email,
    name: a.name || "",
    provider: a.provider || "",
    at: a.at || null,
    lastSignInAt: a.lastSignInAt || null,
  }));
  return NextResponse.json({ ...summarize(accounts), accounts: people }, { headers: NO_STORE });
}
