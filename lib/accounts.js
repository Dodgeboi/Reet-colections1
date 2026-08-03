import { readJson, writeJson } from "@/lib/store";

// Everyone who has ever signed in gets one row in accounts.json, keyed by
// email. Sign-in is JWT-only (no database adapter), so this is what lets the
// dashboard answer "how many people have made an account?".

const FILE = "accounts.json";

export async function listAccounts() {
  const list = await readJson(FILE, []);
  return Array.isArray(list) ? list : [];
}

// Called on every successful sign-in. Best-effort: a storage hiccup must
// never stop someone from signing in.
export async function recordAccount({ email, name, image, provider }) {
  const clean = String(email || "").trim().toLowerCase();
  if (!clean) return;
  try {
    const list = await listAccounts();
    const now = new Date().toISOString();
    const existing = list.find((a) => a.email === clean);
    if (existing) {
      existing.lastSignInAt = now;
      existing.signIns = (Number(existing.signIns) || 1) + 1;
      if (name && !existing.name) existing.name = String(name).slice(0, 120);
      if (image && !existing.image) existing.image = String(image).slice(0, 500);
      if (provider) existing.provider = provider;
    } else {
      list.unshift({
        email: clean,
        name: String(name || "").slice(0, 120),
        image: String(image || "").slice(0, 500),
        provider: provider || "",
        at: now,
        lastSignInAt: now,
        signIns: 1,
      });
    }
    await writeJson(FILE, list);
  } catch {
    // storage not connected yet — the sign-in itself still succeeds
  }
}

// Headline numbers for the owner dashboard.
export function summarize(list) {
  const day = 24 * 60 * 60 * 1000;
  const since = (ms) => Date.now() - ms;
  const at = (a) => new Date(a.at || 0).getTime();
  return {
    count: list.length,
    newThisWeek: list.filter((a) => at(a) >= since(7 * day)).length,
    newThisMonth: list.filter((a) => at(a) >= since(30 * day)).length,
  };
}
