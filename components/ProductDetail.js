"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { onSale, effectivePrice, discountPct } from "@/lib/products";
import ProductCard from "./ProductCard";
import GoldThread from "./GoldThread";
import SizeGuide from "./SizeGuide";

export default function ProductDetail({ product, related = [] }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [size, setSize] = useState(product.sizes?.length === 1 ? product.sizes[0] : "");
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const sold = product.status === "sold";
  const wishlist = useWishlist();
  const wished = wishlist?.has(product.id);
  useEffect(() => { wishlist?.addViewed(product.id); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const ensureSize = () => {
    if (product.sizes?.length > 1 && !size) { setErr("Please select a size."); return false; }
    setErr(""); return true;
  };
  const add = () => { if (ensureSize()) addToCart(product, size || product.sizes?.[0] || "", qty); };
  const buyNow = () => { if (ensureSize()) { addToCart(product, size || product.sizes?.[0] || "", qty); router.push("/checkout"); } };

  // Only facts we actually know about this piece — nothing invented.
  const facts = [
    ["Fabric", product.fabric],
    ["Color", product.color],
    ["Design code", product.code],
    ["Category", (product.category || "").replace(/^\w/, (c) => c.toUpperCase())],
  ].filter(([, v]) => v);

  return (
    <div className="pt-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <nav className="mb-6 font-sans text-xs text-onyx/45">
          <Link href="/collections" className="hover:text-onyx">Shop</Link> / <Link href={`/collections/${product.category}`} className="capitalize hover:text-onyx">{product.category}</Link> / <span className="text-onyx/70">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* image */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EDE4]">
              <Image src={product.image} alt={product.name} fill sizes="(max-width:1024px) 90vw, 45vw" className="object-cover" priority />
              {product.newIn && (
                <span className="absolute left-0 top-4 bg-onyx px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-ivory">New arrival</span>
              )}
            </div>
          </div>

          {/* info */}
          <div>
            <p className="font-sans text-[11px] uppercase tracking-label text-rose">{product.color}</p>
            <h1 className="mt-2 font-display text-4xl font-light leading-tight text-onyx sm:text-5xl">{product.name}</h1>
            {onSale(product) ? (
              <p className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-3xl text-rose-deep">${effectivePrice(product)}</span>
                <span className="font-display text-xl text-onyx/40 line-through">${product.price}</span>
                <span className="bg-rose-deep px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-white">{discountPct(product)}% off</span>
              </p>
            ) : (
              <p className="mt-3 font-display text-3xl text-onyx">${product.price}</p>
            )}
            <div className="my-5"><GoldThread width={160} /></div>
            <p className="font-sans text-[15px] leading-relaxed text-onyx/75">{product.note || product.description || "A handpicked piece, selected with love and care."}</p>

            {product.code && <p className="mt-4 font-sans text-xs text-onyx/45">Design code: {product.code}</p>}

            {!sold && product.qty > 0 && product.qty <= 3 && (
              <p className="mt-5 font-sans text-[13px] font-medium uppercase tracking-[0.1em] text-rose-deep">Only {product.qty} left</p>
            )}

            {/* sizes — only when the piece comes in more than one */}
            {(product.sizes || []).length > 0 ? (
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <p className="font-sans text-[11px] uppercase tracking-label text-onyx/60">Select size</p>
                  <SizeGuide />
                </div>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {(product.sizes || []).map((s) => (
                    <button key={s} onClick={() => { setSize(s); setErr(""); }}
                      className={`min-w-[48px] border px-4 py-2.5 font-sans text-sm transition-all ${size === s ? "border-onyx bg-onyx text-ivory" : "border-onyx/25 text-onyx/70 hover:border-onyx"}`}>{s}</button>
                  ))}
                </div>
                {err && <p className="mt-2 font-sans text-xs text-rose-deep">{err}</p>}
              </div>
            ) : (
              <p className="mt-7 font-sans text-sm text-onyx/55">One-size piece — message us on the live or the contact page for fit help.</p>
            )}

            {/* qty + actions */}
            <div className="mt-7 flex items-center gap-4">
              <div className="flex items-center border border-onyx/25">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-onyx/60 hover:text-onyx">−</button>
                <span className="min-w-[28px] text-center font-sans">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2.5 text-onyx/60 hover:text-onyx">+</button>
              </div>
              <button onClick={add} disabled={sold} className="btn-outline flex-1 disabled:opacity-40">{sold ? "Sold out" : "Add to cart"}</button>
            </div>
            <button onClick={buyNow} disabled={sold} className="btn-gold mt-3 w-full disabled:opacity-40">Buy it now</button>
            <button onClick={() => { if (wishlist?.toggle(product.id) === false) window.location.href = "/account"; }} className={`mt-3 flex w-full items-center justify-center gap-2 border py-3 font-sans text-[12px] uppercase tracking-[0.14em] transition ${wished ? "border-onyx bg-onyx text-ivory" : "border-onyx/25 text-onyx/70 hover:border-onyx"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7"><path d="M12 20s-7-4.3-9.3-8.5C1 8 3 4.7 6.3 4.7c2 0 3.2 1.1 3.7 2 .5-.9 1.7-2 3.7-2 3.3 0 5.3 3.3 3.6 6.8C19 15.7 12 20 12 20Z" /></svg>
              {wished ? "Saved to wishlist" : "Save to wishlist"}
            </button>

            <p className="mt-4 text-center font-sans text-xs text-onyx/45">Free shipping over $150 · Selected with love & care</p>

            {/* details — rendered only when there's something real to show */}
            {facts.length > 0 && (
              <div className="mt-8 border border-onyx/10 bg-white p-5">
                <p className="font-sans text-[11px] uppercase tracking-label text-gold-deep">The details</p>
                <dl className="mt-3 grid grid-cols-2 gap-y-3">
                  {facts.map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-sans text-[11px] uppercase tracking-wide text-onyx/45">{k}</dt>
                      <dd className="font-sans text-sm text-onyx/80">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <section className="mt-20 pb-8">
            <div className="mb-8 text-center">
              <p className="eyebrow">You may also love</p>
              <h2 className="mt-2 font-display text-3xl font-light text-onyx">More from this collection</h2>
            </div>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
