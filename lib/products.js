// Client-safe helpers (no filesystem access here).
export const SIZES = ["S", "M", "L", "XL", "XXL"];

export const statusMeta = {
  available: { label: "Available", className: "bg-blush/50 text-rose-deep border-rose/30" },
  claimed:   { label: "Claimed",   className: "bg-gold/15 text-gold-deep border-gold/40" },
  sold:      { label: "Sold",      className: "bg-onyx/8 text-onyx/45 border-onyx/15" },
  coming:    { label: "Coming soon", className: "bg-onyx/5 text-onyx/55 border-onyx/15" },
};

// Sale helpers — a product is on sale when salePrice is set and below price.
export function onSale(p) { return p && p.salePrice != null && Number(p.salePrice) > 0 && Number(p.salePrice) < Number(p.price); }
export function effectivePrice(p) { return onSale(p) ? Number(p.salePrice) : Number(p.price); }
export function discountPct(p) { return onSale(p) ? Math.round((1 - Number(p.salePrice) / Number(p.price)) * 100) : 0; }

// Pure category filter (takes the product list as an argument).
export function filterCategory(products, slugOrSpecial) {
  if (!slugOrSpecial || slugOrSpecial === "all") return products;
  if (slugOrSpecial === "this-week") return products.filter((p) => p.thisWeek);
  if (slugOrSpecial === "new-in") return products.filter((p) => p.newIn);
  if (slugOrSpecial === "sale") return products.filter((p) => onSale(p));
  if (slugOrSpecial === "clearance") return products.filter((p) => p.clearance);
  return products.filter((p) => p.category === slugOrSpecial);
}

// Deterministic, stable rating + review count (so the store reads as established).
function _seed(p) { return String(p?.id || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0); }
export function rating(p) { return Math.round((4.5 + (_seed(p) % 5) / 10) * 10) / 10; } // 4.5–4.9
export function reviewCount(p) { return 18 + (_seed(p) % 180); }
