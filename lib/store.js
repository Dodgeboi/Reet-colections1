import fs from "node:fs/promises";
import path from "node:path";

// One tiny storage layer for everything the site saves (products, orders,
// subscribers). During development it's plain JSON files in /data. Deployed on
// Vercel the filesystem is read-only, so the same files live in Vercel Blob —
// connecting a Blob store to the project injects BLOB_READ_WRITE_TOKEN and
// saves start persisting, no code changes needed.
const DATA_DIR = path.join(process.cwd(), "data");

const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

// Whether admin saves will actually stick in this environment.
export function writesPersist() {
  return useBlob() || !process.env.VERCEL;
}

async function blobUrlFor(name) {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: `data/${name}` });
  return blobs.find((b) => b.pathname === `data/${name}`)?.url || null;
}

export async function readJson(name, fallback) {
  if (useBlob()) {
    try {
      const url = await blobUrlFor(name);
      if (url) {
        const r = await fetch(url, { cache: "no-store" });
        if (r.ok) return await r.json();
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
    await put(`data/${name}`, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 0,
    });
    return;
  }
  if (!writesPersist()) {
    throw new Error("Storage isn't connected yet — add a Blob store to the Vercel project (see docs/DEPLOYMENT.md).");
  }
  await fs.writeFile(path.join(DATA_DIR, name), body);
}
