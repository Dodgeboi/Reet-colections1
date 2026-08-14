"use client";
import Image from "next/image";
import Link from "next/link";
import { statusMeta, onSale, effectivePrice, discountPct } from "@/lib/products";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import Editable from "./Editable";
import { useSiteText } from "./SiteTextProvider";

export default function ProductCard({ product }) {
  const off = useSiteText("product.off");
  const newLabel = useSiteText("productCard.new");
  const addToBag = useSiteText("productCard.addToBag");
  const meta = statusMeta[product.status] || statusMeta.available;
  const isSold = product.status === "sold";
  const sale = onSale(product);
  const { addToCart } = useCart();
  const wishlist = useWishlist();
  const wished = wishlist?.has(product.id);

  const quickAdd = (e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, product.sizes?.[0] || "", 1); };
  const toggleWish = (e) => { e.preventDefault(); e.stopPropagation(); if (wishlist?.toggle(product.id) === false) window.location.href = "/account"; };

  return (
    <Link href={`/product/${product.id}`} prefetch={false} className="group relative block">
      <div className={`relative overflow-hidden bg-white ${isSold ? "opacity-70" : ""}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EDE4]">
          <Image src={product.image} alt={product.name} fill sizes="(max-width:768px) 50vw, 25vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${isSold ? "grayscale-[0.35]" : ""}`}
            data-edit={`product:${product.id}`} />
          <div className="absolute left-0 top-3 flex flex-col items-start gap-1">
            {product.status !== "available" && (
              <span className={`px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.14em] ${meta.className}`}>{meta.label}</span>
            )}
            {sale ? (
              <span className="bg-rose-deep px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-white">{discountPct(product)}% <Editable k="product.off" value={off} /></span>
            ) : product.newIn ? (
              <span className="bg-onyx px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-ivory"><Editable k="productCard.new" value={newLabel} /></span>
            ) : null}
          </div>
          <button onClick={toggleWish} aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
            className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center transition-colors ${wished ? "bg-onyx text-ivory" : "bg-white/90 text-onyx/60 hover:text-onyx"}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7-4.3-9.3-8.5C1 8 3 4.7 6.3 4.7c2 0 3.2 1.1 3.7 2 .5-.9 1.7-2 3.7-2 3.3 0 5.3 3.3 3.6 6.8C19 15.7 12 20 12 20Z" /></svg>
          </button>
          {!isSold && (
            <button onClick={quickAdd}
              className="absolute inset-x-0 bottom-0 translate-y-full bg-onyx py-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ivory transition-transform duration-300 hover:bg-gold-deep hover:text-onyx group-hover:translate-y-0">
              <Editable k="productCard.addToBag" value={addToBag} />
            </button>
          )}
        </div>
        <div className="px-0.5 pb-1 pt-3">
          {product.color && <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-onyx/45">{product.color}</p>}
          <h3 className="mt-0.5 line-clamp-1 font-display text-[17px] leading-snug text-onyx">{product.name}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            {sale ? (
              <>
                <span className="font-sans text-sm font-medium text-rose-deep">${effectivePrice(product)}</span>
                <span className="font-sans text-xs text-onyx/40 line-through">${product.price}</span>
              </>
            ) : (
              <span className="font-sans text-sm font-medium text-onyx">${product.price}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
