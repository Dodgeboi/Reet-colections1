import { readJson } from "@/lib/store";

// Editable site imagery — the owner replaces these by clicking photos on the
// site itself (in-place edit mode). Slots are single images; the maps hold
// per-live-replay thumbnails and per-category tile overrides.
export const SITE_DEFAULTS = {
  hero: "/images/hero-anarkali.jpg",
  heritage: "/images/heritage-mustard.jpg",
  about: "/images/hero-anarkali.jpg",
  liveThumbs: {},
  categoryTiles: {},
  text: {},
};

export async function getSiteSettings() {
  const saved = await readJson("site.json", {});
  const s = saved && typeof saved === "object" ? saved : {};
  return {
    ...SITE_DEFAULTS,
    ...s,
    liveThumbs: { ...(s.liveThumbs || {}) },
    categoryTiles: { ...(s.categoryTiles || {}) },
    text: { ...(s.text || {}) },
  };
}
