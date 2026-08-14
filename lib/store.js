import fs from "node:fs/promises";
import path from "node:path";

// One tiny storage layer for everything the site saves (products, orders,
// subscribers, site settings). During development it's plain JSON files in
// /data. Deployed on Vercel the filesystem is read-only, so the same files
// live in Vercel Blob — connecting a Blob store injects BLOB_READ_WRITE_TOKEN
// and saves start persisting, no code changes needed.
const DATA_DIR = path.join(process.cwd(), "data");

const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

// Whether admin saves will actually stick in this environment.
export function writesPersist() {
  return useBlob() || !process.env.VERCEL;
}

// --- Why this file writes *versioned* blobs instead of overwriting one -----
// The first version of this cache tried "overwrite the same blob, cache-bust
// on read, and remember the bytes in an in-process Map." That only helps
// when a later request happens to land back on the same warm serverless
// instance that did the write — and Vercel gives no such guarantee between
// two separate requests a few seconds apart (e.g. two browser refreshes).
// Miss that coin flip and you're back to fetching a fixed URL whose content
// Vercel's Blob backend can still be propagating after an overwrite — which
// is exactly the "takes a few refreshes" symptom.
//
// The fix that doesn't depend on instance luck: never overwrite a blob.
// Every write creates a brand-new, uniquely-named object; readJson asks
// list() — an authenticated call to Blob's control-plane API, not a
// CDN-fronted URL — which version is newest, then fetches that (never-
// before-requested, never-changing) URL. There's nothing to propagate: a
// URL that has only ever held one piece of content can't serve stale bytes.
// list() itself is authoritative immediately after put() resolves, so this
// is correct from any instance, not just the one that wrote it.
const memCache = new Map(); // name -> { body, at } — fast path only, not load-bearing for correctness
const MEM_TTL_MS = 30 * 1000;

function versionedPathname(name, stamp) {
  return `data/${name}.v${stamp}`;
}
// Matches "data/<name>.v<digits>[-<random>]" for this exact name.
function versionedPattern(name) {
  return new RegExp(`^data/${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.v\\d+`);
}

async function latestVersionedBlob(name) {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: `data/${name}.v` });
  const pattern = versionedPattern(name);
  const matches = blobs.filter((b) => pattern.test(b.pathname));
  if (!matches.length) return null;
  return matches.reduce((a, b) => (new Date(b.uploadedAt) > new Date(a.uploadedAt) ? b : a));
}

// One-time migration path: data written by the previous (fixed-pathname,
// overwrite-in-place) version of this store. Real orders/products/customer
// data already live there in production — this must keep reading it until
// it's been copied forward as a versioned blob, or a deploy would silently
// reset the whole site back to its bundled seed files.
async function legacyBlob(name) {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: `data/${name}` });
  return blobs.find((b) => b.pathname === `data/${name}`) || null;
}

export async function readJson(name, fallback) {
  const cached = memCache.get(name);
  if (cached && Date.now() - cached.at < MEM_TTL_MS) {
    return JSON.parse(cached.body);
  }

  if (useBlob()) {
    try {
      const latest = await latestVersionedBlob(name);
      if (latest) {
        const r = await fetch(latest.url, { cache: "no-store" });
        if (r.ok) {
          const body = await r.text();
          memCache.set(name, { body, at: Date.now() });
          return JSON.parse(body);
        }
      } else {
        // Nothing under the new scheme yet — check for pre-migration data
        // and, if found, copy it forward so future reads use the fast path.
        const legacy = await legacyBlob(name);
        if (legacy) {
          const r = await fetch(`${legacy.url}?v=${Date.now()}`, { cache: "no-store" });
          if (r.ok) {
            const body = await r.text();
            writeJson(name, JSON.parse(body)).catch(() => {});
            memCache.set(name, { body, at: Date.now() });
            return JSON.parse(body);
          }
        }
      }
    } catch {}
    // fall through to the bundled seed file on first run
  }
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, name), "utf8"));
  } catch {
    return fallback;
  }
}

export async function writeJson(name, data) {
  const body = JSON.stringify(data, null, 2);
  if (useBlob()) {
    const { put, list, del } = await import("@vercel/blob");
    const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const blob = await put(versionedPathname(name, stamp), body, {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      // Immutable content at this exact URL (it's never reused) — safe, and
      // good for performance, to let it cache hard.
      cacheControlMaxAge: 31536000,
    });
    memCache.set(name, { body, at: Date.now() });
    // Best-effort cleanup of older versions (and the pre-migration blob, if
    // any) — irrelevant to correctness, just housekeeping.
    try {
      const { blobs } = await list({ prefix: `data/${name}` });
      const pattern = versionedPattern(name);
      const stale = blobs
        .filter((b) => b.url !== blob.url)
        .filter((b) => b.pathname === `data/${name}` || pattern.test(b.pathname));
      if (stale.length) await del(stale.map((b) => b.url));
    } catch {}
    return;
  }
  if (!writesPersist()) {
    throw new Error("Storage isn't connected yet — add a Blob store to the Vercel project (see docs/DEPLOYMENT.md).");
  }
  await fs.writeFile(path.join(DATA_DIR, name), body);
  memCache.set(name, { body, at: Date.now() });
}
