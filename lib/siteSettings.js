import { readJson } from "@/lib/store";

// Editable site imagery — the owner swaps these from Admin → Photos.
export const SITE_DEFAULTS = {
  hero: "/images/hero-anarkali.jpg",
  heritage: "/images/heritage-mustard.jpg",
  about: "/images/hero-anarkali.jpg",
};

export async function getSiteSettings() {
  const saved = await readJson("site.json", {});
  return { ...SITE_DEFAULTS, ...(saved && typeof saved === "object" ? saved : {}) };
}
