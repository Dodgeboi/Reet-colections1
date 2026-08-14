import { readJson, writeJson } from "@/lib/store";

const SITE_IMAGE_RELEASE = "reet-four-outfits-v2";

// Editable imagery is limited to the four supplied outfits. Existing owner
// copy remains intact when the old production image settings are reset.
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
  const site = saved && typeof saved === "object" ? saved : {};

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const release = await readJson("site-image-release.json", {});
    if (release?.id !== SITE_IMAGE_RELEASE) {
      const reset = { ...SITE_DEFAULTS, text: { ...(site.text || {}) } };
      await writeJson("site.json", reset);
      await writeJson("site-image-release.json", { id: SITE_IMAGE_RELEASE });
      return reset;
    }
  }

  return {
    ...SITE_DEFAULTS,
    ...site,
    liveThumbs: { ...SITE_DEFAULTS.liveThumbs, ...(site.liveThumbs || {}) },
    categoryTiles: { ...SITE_DEFAULTS.categoryTiles, ...(site.categoryTiles || {}) },
    text: { ...(site.text || {}) },
  };
}
