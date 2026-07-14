// === CATEGORY NAV (mega-menu "tree") ======================================
// One row of category tabs. Click a tab -> filters the grid in place.
// Hover a tab -> reveals a hidden tree of sub-links -> internal category pages.
//
// Developers: rename/add sub-links freely. Each sub-link's `slug` routes to
// /collections/[slug] (a real internal page that filters to that category).
// "thisWeek", "newIn", and "clearance" are special auto-collections.
// =========================================================================

export const categories = [
  { name: "This Week's Collection", slug: "this-week", special: "thisWeek", subs: [
    { label: "Just Dropped", slug: "this-week" },
    { label: "Back in Stock", slug: "this-week" },
  ] },
  { name: "New In", slug: "new-in", special: "newIn", subs: [
    { label: "Latest Arrivals", slug: "new-in" },
  ] },
  { name: "Kurtis", slug: "kurtis", subs: [
    { label: "Straight Kurtis", slug: "kurtis" },
    { label: "A-Line Kurtis", slug: "kurtis" },
    { label: "Kurti Sets", slug: "kurtis" },
  ] },
  { name: "Lehengas", slug: "lehengas", subs: [
    { label: "Bridal Lehengas", slug: "lehengas" },
    { label: "Party Lehengas", slug: "lehengas" },
    { label: "Crop-Top Lehengas", slug: "lehengas" },
  ] },
  { name: "Sarees", slug: "sari", subs: [
    { label: "Silk Sarees", slug: "sari" },
    { label: "Cotton Sarees", slug: "sari" },
    { label: "Party Wear Sarees", slug: "sari" },
  ] },
  { name: "Blouses", slug: "blouses", subs: [
    { label: "Embroidered Blouses", slug: "blouses" },
    { label: "Plain Blouses", slug: "blouses" },
  ] },
  { name: "Pants", slug: "pants", subs: [
    { label: "Palazzos", slug: "pants" },
    { label: "Cigarette Pants", slug: "pants" },
    { label: "Shararas", slug: "pants" },
  ] },
  { name: "Jewelry", slug: "jewelry", subs: [
    { label: "Earrings", slug: "jewelry" },
    { label: "Necklace Sets", slug: "jewelry" },
    { label: "Bangles", slug: "jewelry" },
  ] },
  { name: "Shoes", slug: "shoes", subs: [
    { label: "Juttis", slug: "shoes" },
    { label: "Heels", slug: "shoes" },
  ] },
  { name: "Clearance", slug: "clearance", special: "clearance", subs: [
    { label: "Final Sale", slug: "clearance" },
  ] },
];

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
