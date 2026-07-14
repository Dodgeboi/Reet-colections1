// === LIVES DATA ===========================================================
// Developers: to add a new live, drop a new object at the TOP of this array.
// The site shows the 3 newest at the top of the Home + Live pages and lists
// the rest under "This month". Replace each `facebookUrl` with the DIRECT
// link to that specific live video when you have it (it defaults to the page).
// =========================================================================

export const FACEBOOK_PAGE = "https://www.facebook.com/Reetcollections068/";

export const lives = [
  { id: "live-2026-06-16", date: "2026-06-16", week: "This Week", title: "Monsoon Festive Drop",     thumbnail: "/images/anarkali-blue.png",   facebookUrl: FACEBOOK_PAGE },
  { id: "live-2026-06-13", date: "2026-06-13", week: "This Week", title: "Weekend Lehenga Special",   thumbnail: "/images/fusion-mustard.png",  facebookUrl: FACEBOOK_PAGE },
  { id: "live-2026-06-10", date: "2026-06-10", week: "This Week", title: "New Kurti Arrivals",        thumbnail: "/images/anarkali-blue.png",   facebookUrl: FACEBOOK_PAGE },
  { id: "live-2026-06-06", date: "2026-06-06", week: "Last Week", title: "Saree Showcase",            thumbnail: "/images/fusion-mustard.png",  facebookUrl: FACEBOOK_PAGE },
  { id: "live-2026-06-03", date: "2026-06-03", week: "Last Week", title: "Jewelry & Accessories Night", thumbnail: "/images/anarkali-blue.png", facebookUrl: FACEBOOK_PAGE },
  { id: "live-2026-06-01", date: "2026-06-01", week: "Earlier This Month", title: "Summer Clearance Live", thumbnail: "/images/fusion-mustard.png", facebookUrl: FACEBOOK_PAGE },
];

export const sortedLives = [...lives].sort((a, b) => new Date(b.date) - new Date(a.date));
export const newestThree = sortedLives.slice(0, 3);
export const restOfLives = sortedLives.slice(3);

export function formatLiveDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
