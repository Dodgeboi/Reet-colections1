"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSiteText } from "./SiteTextProvider";
import Editable from "./Editable";
export default function SearchOverlay({ open, onClose }) {
  const placeholder = useSiteText("search.placeholder");
  const emptyHint = useSiteText("search.emptyHint");
  const [q, setQ] = useState("");
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (open && products.length === 0) fetch("/api/products").then((r) => r.json()).then((d) => setProducts(Array.isArray(d) ? d : [])).catch(() => {});
  }, [open, products.length]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const ql = q.trim().toLowerCase();
  const results = ql ? products.filter((p) => [p.name, p.category, p.color, p.code].filter(Boolean).some((f) => String(f).toLowerCase().includes(ql))).slice(0, 8) : [];
  return (
    <div className="fixed inset-0 z-[60] bg-onyx/40 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto mt-20 max-w-2xl px-4 sm:mt-24" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden bg-white shadow-card">
          <div className="flex items-center gap-3 border-b border-onyx/10 px-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-onyx/40"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="w-full bg-transparent py-4 font-sans text-base text-onyx focus:outline-none" />
            <button onClick={onClose} aria-label="Close" className="text-2xl leading-none text-onyx/40 hover:text-onyx">×</button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {!ql && <p className="p-6 text-center font-sans text-sm text-onyx/40"><Editable k="search.emptyHint" value={emptyHint} /></p>}
            {ql && results.length === 0 && <p className="p-6 text-center font-sans text-sm text-onyx/50">No matches for “{q}”.</p>}
            {results.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} onClick={onClose} className="flex items-center gap-3 border-b border-onyx/5 px-4 py-3 last:border-0 hover:bg-blush/30">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-ivory"><Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" /></div>
                <div className="min-w-0 flex-1"><p className="truncate font-display text-base text-onyx">{p.name}</p><p className="font-sans text-xs capitalize text-onyx/50">{p.category}</p></div>
                <span className="font-display text-onyx">${p.price}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
