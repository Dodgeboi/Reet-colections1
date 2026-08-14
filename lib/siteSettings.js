import { readJson } from "@/lib/store";

// Editable site imagery — the owner replaces these by clicking photos on the
// site itself (in-place edit mode). Slots are single images; the maps hold
// per-live-replay thumbnails and per-category tile overrides.
export const SITE_DEFAULTS = {
  hero: "/images/products/pink-ombre-suit-angle.png",
  heritage: "/images/products/brown-floral-anarkali-angle.png",
  about: "/images/products/mint-green-embroidered-suit-front.png",
  liveThumbs: {
    "live-2026-06-16": "/images/products/mint-green-embroidered-suit-angle.png",
    "live-2026-06-13": "/images/products/brown-floral-anarkali-angle.png",
    "live-2026-06-10": "/images/products/purple-embroidered-suit-angle.png",
  },
  categoryTiles: {
    suits: "/images/products/pink-ombre-suit-front.png",
    anarkalis: "/images/products/brown-floral-anarkali-front.png",
    "new-in": "/images/products/purple-embroidered-suit-front.png",
  },
  text: {},
};

export async function getSiteSettings() {
  const saved = await readJson("site.json", {});
  const s = saved && typeof saved === "object" ? saved : {};
  return {
    ...SITE_DEFAULTS,
    ...s,
    liveThumbs: { ...SITE_DEFAULTS.liveThumbs, ...(s.liveThumbs || {}) },
    categoryTiles: { ...SITE_DEFAULTS.categoryTiles, ...(s.categoryTiles || {}) },
    text: { ...(s.text || {}) },
  };
}
