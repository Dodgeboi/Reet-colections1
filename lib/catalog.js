// Server-side fresh read of the catalog. Because this reads the file on each
// request (pages are dynamic), anything the admin saves shows up in the shop
// immediately — admin and shop share one source of truth.
import fs from "node:fs";
import path from "node:path";
const FILE = path.join(process.cwd(), "data", "products.json");
export function getCatalog() {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; }
}
