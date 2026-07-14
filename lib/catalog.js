// Server-side fresh read of the catalog. Reads go through lib/store (local
// JSON in development, Vercel Blob in production), so whatever the admin
// saves shows up in the shop immediately — one source of truth.
import { readJson } from "@/lib/store";

export async function getCatalog() {
  const data = await readJson("products.json", []);
  return Array.isArray(data) ? data : [];
}
