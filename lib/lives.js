// === LIVES DATA ===========================================================
// Developers: to add a new live, drop a new object at the TOP of this array.
// The site shows the 3 newest at the top of the Home + Live pages and lists
// the rest under "This month". Replace each `facebookUrl` with the DIRECT
// link to that specific live video when you have it (it defaults to the page).
// =========================================================================

export const FACEBOOK_PAGE = "https://www.facebook.com/Reetcollections068/";

export const lives = [
  { id: "live-2026-06-16", date: "2026-06-16", title: "Monsoon Festive Drop",       thumbnail: "/images/products/mint-green-embroidered-suit-angle.png", facebookUrl: FACEBOOK_PAGE },
  { id: "live-2026-06-13", date: "2026-06-13", title: "Weekend Anarkali Special",    thumbnail: "/images/products/brown-floral-anarkali-angle.png",       facebookUrl: FACEBOOK_PAGE },
  { id: "live-2026-06-10", date: "2026-06-10", title: "New Suit Arrivals",           thumbnail: "/images/products/purple-embroidered-suit-angle.png",     facebookUrl: FACEBOOK_PAGE },
  { id: "live-2026-06-06", date: "2026-06-06", title: "Ombre Suit Showcase",         thumbnail: "/images/products/pink-ombre-suit-angle.png",             facebookUrl: FACEBOOK_PAGE },
  { id: "live-2026-06-03", date: "2026-06-03", title: "Embroidered Edit",            thumbnail: "/images/products/mint-green-embroidered-suit-front.png", facebookUrl: FACEBOOK_PAGE },
  { id: "live-2026-06-01", date: "2026-06-01", title: "Four-Look Collection",        thumbnail: "/images/products/brown-floral-anarkali-front.png",       facebookUrl: FACEBOOK_PAGE },
];

// "This Week" / "Last Week" / "Earlier" — computed from the date so labels
// never go stale as time passes.
export function weekLabel(iso) {
  const days = Math.floor((Date.now() - new Date(iso + "T00:00:00")) / 86400000);
  if (days <= 7) return "This Week";
  if (days <= 14) return "Last Week";
  if (days <= 31) return "Earlier This Month";
  return "From the Archive";
}

export const sortedLives = [...lives].sort((a, b) => new Date(b.date) - new Date(a.date));
export const newestThree = sortedLives.slice(0, 3);
export const restOfLives = sortedLives.slice(3);

export function formatLiveDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
