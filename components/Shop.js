"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { filterCategory, effectivePrice } from "@/lib/products";
import { categories, categoryBySlug } from "@/lib/categories";

const SORTS = [["featured", "Featured"], ["newest", "Newest"], ["price-asc", "Price: Low to High"], ["price-desc", "Price: High to Low"]];
const PRICE_BUCKETS = [
  ["under-75", "Under $75", (p) => p < 75],
  ["75-125", "$75 – $125", (p) => p >= 75 && p <= 125],
  ["125-200", "$125 – $200", (p) => p > 125 && p <= 200],
  ["200-plus", "$200 & above", (p) => p > 200],
];
export default function Shop({ initialSlug = "all", products = [] }) {
  const [slug, setSlug] = useState(initialSlug);
  const [colors, setColors] = useState(() => new Set());
  const [buckets, setBuckets] = useState(() => new Set());
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");
  const [drawer, setDrawer] = useState(false);

  const colorOptions = useMemo(() => Array.from(new Set(products.map((p) => p.color).filter(Boolean))).sort(), [products]);
  const categoryOptions = useMemo(() => [
    { name: "All Products", slug: "all" },
    ...categories
      .filter((category) => filterCategory(products, category.slug).length > 0)
      .map((category) => ({ name: category.name, slug: category.slug })),
  ], [products]);

  const items = useMemo(() => {
    let list = filterCategory(products, slug);
    if (colors.size) list = list.filter((p) => colors.has(p.color));
    if (buckets.size) list = list.filter((p) => { const pr = effectivePrice(p); return [...buckets].some((b) => PRICE_BUCKETS.find((x) => x[0] === b)?.[2](pr)); });
    if (inStock) list = list.filter((p) => p.status !== "sold");
    if (sort === "newest") list = [...list].sort((a, b) => (b.newIn ? 1 : 0) - (a.newIn ? 1 : 0));
    else if (sort === "price-asc") list = [...list].sort((a, b) => effectivePrice(a) - effectivePrice(b));
    else if (sort === "price-desc") list = [...list].sort((a, b) => effectivePrice(b) - effectivePrice(a));
    return list;
  }, [products, slug, colors, buckets, inStock, sort]);

  const toggleSet = (set, setter, val) => { const n = new Set(set); n.has(val) ? n.delete(val) : n.add(val); setter(n); };
  const clearAll = () => { setColors(new Set()); setBuckets(new Set()); setInStock(false); setSlug("all"); };
  const activeCount = colors.size + buckets.size + (inStock ? 1 : 0) + (slug !== "all" ? 1 : 0);
  const title = slug === "all" ? "All Products" : (categoryBySlug[slug]?.name || slug);

  const Group = ({ label, children }) => (
    <div className="border-b border-onyx/8 py-5">
      <p className="mb-3 font-sans text-[11px] uppercase tracking-label text-onyx/55">{label}</p>
      {children}
    </div>
  );

  const filters = (
    <div>
      <Group label="Category">
        <ul className="space-y-1">
          {categoryOptions.map((c) => (
            <li key={c.slug}>
              <button onClick={() => { setSlug(c.slug); }} className={`w-full text-left font-sans text-sm transition ${slug === c.slug ? "font-medium text-rose-deep" : "text-onyx/65 hover:text-onyx"}`}>{c.name}</button>
            </li>
          ))}
        </ul>
      </Group>
      <Group label="Price">
        <ul className="space-y-2">
          {PRICE_BUCKETS.map(([id, lbl]) => (
            <li key={id}>
              <label className="flex cursor-pointer items-center gap-2.5 font-sans text-sm text-onyx/70">
                <input type="checkbox" checked={buckets.has(id)} onChange={() => toggleSet(buckets, setBuckets, id)} className="h-4 w-4 accent-[#1A130D]" />
                {lbl}
              </label>
            </li>
          ))}
        </ul>
      </Group>
      <Group label="Color">
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((c) => (
            <button key={c} onClick={() => toggleSet(colors, setColors, c)}
              className={`border px-3 py-1 font-sans text-xs transition ${colors.has(c) ? "border-onyx bg-onyx text-ivory" : "border-onyx/20 text-onyx/65 hover:border-onyx"}`}>{c}</button>
          ))}
        </div>
      </Group>
      <Group label="Availability">
        <label className="flex cursor-pointer items-center gap-2.5 font-sans text-sm text-onyx/70">
          <input type="checkbox" checked={inStock} onChange={() => setInStock((v) => !v)} className="h-4 w-4 accent-[#1A130D]" />
          In stock only
        </label>
      </Group>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <div className="lg:grid lg:grid-cols-[230px_1fr] lg:gap-10">
        {/* desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl text-onyx">Filters</h3>
              {activeCount > 0 && <button onClick={clearAll} className="font-sans text-xs text-onyx/50 underline hover:text-onyx">Clear all</button>}
            </div>
            <div className="mt-2">{filters}</div>
          </div>
        </aside>

        {/* main */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <h2 className="font-display text-3xl font-light text-onyx">{title}</h2>
              <span className="font-sans text-sm text-onyx/50">{items.length} {items.length === 1 ? "product" : "products"}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setDrawer(true)} className="flex items-center gap-2 border border-onyx/25 px-4 py-2 font-sans text-sm text-onyx/70 lg:hidden">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M6 12h12M10 18h4" /></svg>
                Filters{activeCount > 0 ? ` (${activeCount})` : ""}
              </button>
              <label className="flex items-center gap-2 font-sans text-sm text-onyx/60">
                <span className="hidden sm:inline">Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-onyx/20 bg-white px-3 py-1.5 text-onyx focus:border-onyx focus:outline-none">
                  {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
            </div>
          </div>

          {/* active chips */}
          {activeCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {slug !== "all" && <Chip onClear={() => setSlug("all")}>{categoryBySlug[slug]?.name || slug}</Chip>}
              {[...buckets].map((b) => <Chip key={b} onClear={() => toggleSet(buckets, setBuckets, b)}>{PRICE_BUCKETS.find((x) => x[0] === b)?.[1]}</Chip>)}
              {[...colors].map((c) => <Chip key={c} onClear={() => toggleSet(colors, setColors, c)}>{c}</Chip>)}
              {inStock && <Chip onClear={() => setInStock(false)}>In stock</Chip>}
              <button onClick={clearAll} className="font-sans text-xs text-onyx/45 hover:text-rose">Clear all</button>
            </div>
          )}

          {/* grid */}
          {items.length ? (
            <div className="mt-6 grid grid-cols-2 gap-x-2 gap-y-7 sm:gap-x-3 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="mt-6 border border-dashed border-onyx/20 bg-white/60 py-24 text-center">
              <p className="font-display text-2xl text-onyx/50">No products match those filters.</p>
              <button onClick={clearAll} className="btn-rose mt-4 !py-2 text-xs">Clear filters</button>
            </div>
          )}
        </div>
      </div>

      {/* mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" onClick={() => setDrawer(false)}>
          <div className="absolute inset-0 bg-onyx/40 backdrop-blur-sm" />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-ivory p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl text-onyx">Filters</h3>
              <button onClick={() => setDrawer(false)} className="text-2xl leading-none text-onyx/40">×</button>
            </div>
            <div className="mt-2">{filters}</div>
            <div className="sticky bottom-0 mt-4 flex gap-2 bg-ivory pt-3">
              <button onClick={clearAll} className="btn-outline flex-1 !py-2.5 text-xs">Clear all</button>
              <button onClick={() => setDrawer(false)} className="btn-gold flex-1 !py-2.5 text-xs">Show {items.length} results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ children, onClear }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-onyx/15 bg-white px-3 py-1 font-sans text-xs text-onyx/70">
      {children}
      <button onClick={onClear} aria-label="Remove filter" className="text-onyx/40 hover:text-rose">×</button>
    </span>
  );
}
