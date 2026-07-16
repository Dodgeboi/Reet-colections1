import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

// Uploaded photos: Vercel Blob in production; a local folder in development,
// served through /api/uploads/[name] (files added after a build aren't served
// from /public by `next start`, so a route handles them instead).
export const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "uploads");

export async function saveUpload(buffer, name, contentType) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`images/uploads/${name}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType,
    });
    return blob.url;
  }
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, name), buffer);
  } catch (e) {
    if (e?.code === "EROFS" || process.env.VERCEL) {
      throw new Error("Photo uploads need storage connected — in Vercel open Storage → Create a Blob store, then redeploy (docs/DEPLOYMENT.md, Step 3).");
    }
    throw e;
  }
  return `/api/uploads/${name}`;
}

export function extFromMime(mime) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}
