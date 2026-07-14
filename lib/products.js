// Client-safe helpers (no filesystem access here).
export const SIZES = ["S", "M", "L", "XL", "XXL"];

// Shipping — shared by the cart (client) and the orders API (server).
export const FREE_SHIP = 150;
export const SHIP_FLAT = 9;

export const statusMeta = {
  available: { label: "Available", className: "bg-white/90 text-onyx/70" },
  claimed:   { label: "Claimed",   className: "bg-gold-light/90 text-onyx" },
  sold:      { label: "Sold out",  className: "bg-onyx/80 text-ivory" },
  coming:    { label: "Coming soon", className: "bg-white/90 text-onyx/70" },
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
