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

// Pathnames are fixed (no random suffix), so the URL for a given file never
// changes — memoize it per server instance to skip list() on every read.
const urlCache = new Map();

async function blobUrlFor(name) {
  if (urlCache.has(name)) return urlCache.get(name);
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: `data/${name}` });
  const url = blobs.find((b) => b.pathname === `data/${name}`)?.url || null;
  if (url) urlCache.set(name, url);
  return url;
}

export async function readJson(name, fallback) {
  if (useBlob()) {
    try {
      const url = await blobUrlFor(name);
      if (url) {
        // The Blob CDN can keep serving an overwritten file's OLD content for
        // up to a minute. A unique query string per read makes every request
        // a cache miss, so edits show up immediately.
        const bust = `${url}?v=${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const r = await fetch(bust, { cache: "no-store" });
        if (r.ok) return await r.json();
        if (r.status === 404) urlCache.delete(name);
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
    const { put } = await import("@vercel/blob");
    const blob = await put(`data/${name}`, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 0,
    });
    urlCache.set(name, blob.url);
    return;
  }
  if (!writesPersist()) {
    throw new Error("Storage isn't connected yet — add a Blob store to the Vercel project (see docs/DEPLOYMENT.md).");
  }
  await fs.writeFile(path.join(DATA_DIR, name), body);
}
