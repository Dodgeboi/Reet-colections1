import fs from "node:fs/promises";
import path from "node:path";

// One storage layer for products, orders, subscribers, and site settings.
// Development uses JSON files in /data; Vercel uses Blob when connected.
const DATA_DIR = path.join(process.cwd(), "data");

const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

// Preview deployments get their own namespace so branch testing cannot read
// or overwrite production catalog, order, or site-edit data.
function blobPath(name) {
  const explicit = String(process.env.DATA_NAMESPACE || "").trim();
  if (explicit) return `data/${explicit.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 80)}/${name}`;
  if (process.env.VERCEL_ENV === "preview") {
    const branch = String(process.env.VERCEL_GIT_COMMIT_REF || "preview")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .slice(0, 80);
    return `data/previews/${branch}/${name}`;
  }
  return `data/${name}`;
}

export function writesPersist() {
  return useBlob() || !process.env.VERCEL;
}

// Blob objects are versioned instead of overwritten. Each save receives a
// unique immutable URL, preventing a later request from seeing stale CDN data.
const memCache = new Map();
const MEM_TTL_MS = 30 * 1000;

function versionedPathname(name, stamp) {
  return `${blobPath(name)}.v${stamp}`;
}

function versionedPattern(name) {
  const prefix = `${blobPath(name)}.v`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${prefix}\\d+`);
}

async function latestVersionedBlob(name) {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: `${blobPath(name)}.v` });
  const pattern = versionedPattern(name);
  const matches = blobs.filter((blob) => pattern.test(blob.pathname));
  if (!matches.length) return null;
  return matches.reduce((latest, blob) => (new Date(blob.uploadedAt) > new Date(latest.uploadedAt) ? blob : latest));
}

// Migration path for data written by the previous fixed-path Blob scheme.
async function legacyBlob(name) {
  const pathname = blobPath(name);
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: pathname });
  return blobs.find((blob) => blob.pathname === pathname) || null;
}

export async function readJson(name, fallback) {
  const cacheKey = useBlob() ? blobPath(name) : name;
  const cached = memCache.get(cacheKey);
  if (cached && Date.now() - cached.at < MEM_TTL_MS) {
    return JSON.parse(cached.body);
  }

  if (useBlob()) {
    try {
      const latest = await latestVersionedBlob(name);
      if (latest) {
        const response = await fetch(latest.url, { cache: "no-store" });
        if (response.ok) {
          const body = await response.text();
          memCache.set(cacheKey, { body, at: Date.now() });
          return JSON.parse(body);
        }
      } else {
        const legacy = await legacyBlob(name);
        if (legacy) {
          const response = await fetch(`${legacy.url}?v=${Date.now()}`, { cache: "no-store" });
          if (response.ok) {
            const body = await response.text();
            writeJson(name, JSON.parse(body)).catch(() => {});
            memCache.set(cacheKey, { body, at: Date.now() });
            return JSON.parse(body);
          }
        }
      }
    } catch {}
  }

  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, name), "utf8"));
  } catch {
    return fallback;
  }
}

export async function writeJson(name, data) {
  const body = JSON.stringify(data, null, 2);
  const cacheKey = useBlob() ? blobPath(name) : name;

  if (useBlob()) {
    const { put, list, del } = await import("@vercel/blob");
    const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const blob = await put(versionedPathname(name, stamp), body, {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 31536000,
    });
    memCache.set(cacheKey, { body, at: Date.now() });

    // Best-effort cleanup of older versions and the pre-migration object.
    try {
      const pathname = blobPath(name);
      const { blobs } = await list({ prefix: pathname });
      const pattern = versionedPattern(name);
      const stale = blobs
        .filter((candidate) => candidate.url !== blob.url)
        .filter((candidate) => candidate.pathname === pathname || pattern.test(candidate.pathname));
      if (stale.length) await del(stale.map((candidate) => candidate.url));
    } catch {}
    return;
  }

  if (!writesPersist()) {
    throw new Error("Storage isn't connected yet — add a Blob store to the Vercel project (see docs/DEPLOYMENT.md).");
  }
  await fs.writeFile(path.join(DATA_DIR, name), body);
  memCache.set(cacheKey, { body, at: Date.now() });
}
