"use client";
import Image from "next/image";
import Link from "next/link";
import { statusMeta, onSale, effectivePrice, discountPct, rating, reviewCount } from "@/lib/products";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
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
      <div className={`relative overflow-hidden rounded-[14px] bg-white shadow-card ring-1 ring-onyx/5 transition-all duration-500 group-hover:ring-gold/50 ${isSold ? "opacity-70" : ""}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image src={product.image} alt={product.name} fill sizes="(max-width:768px) 50vw, 25vw"
            className={`object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-105 ${isSold ? "grayscale-[0.35]" : ""}`} />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            <span className={`rounded-full border px-3 py-1 text-center font-sans text-[10px] uppercase tracking-label backdrop-blur-sm ${meta.className}`}>{meta.label}</span>
            {sale ? <span className="rounded-full bg-rose px-2.5 py-1 text-center font-sans text-[10px] font-medium uppercase tracking-wide text-white">{discountPct(product)}% off</span>
              : product.newIn ? <span className="rounded-full bg-gold px-2.5 py-1 text-center font-sans text-[9px] uppercase tracking-wide text-onyx">New</span> : null}
          </div>
          <button onClick={toggleWish} aria-label="Save to wishlist"
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition ${wished ? "bg-rose text-white" : "bg-white/85 text-onyx/60 hover:text-rose"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7-4.3-9.3-8.5C1 8 3 4.7 6.3 4.7c2 0 3.2 1.1 3.7 2 .5-.9 1.7-2 3.7-2 3.3 0 5.3 3.3 3.6 6.8C19 15.7 12 20 12 20Z" /></svg>
          </button>
          {!isSold && (
            <button onClick={quickAdd} className="absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-onyx/90 py-2.5 font-sans text-[11px] uppercase tracking-wide text-ivory opacity-0 backdrop-blur transition-all duration-300 hover:bg-rose group-hover:translate-y-0 group-hover:opacity-100">
              Add to cart
            </button>
          )}
        </div>
        <div className="p-4">
          <p className="font-sans text-[10px] uppercase tracking-label text-rose">{product.color}</p>
          <h3 className="mt-1.5 line-clamp-1 font-display text-lg leading-snug text-onyx">{product.name}</h3>
          <div className="mt-1.5"><StarRating value={rating(product)} count={reviewCount(product)} size={11} /></div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-sans text-sm text-onyx/55">{product.code || "Reet Collections"}</span>
            {sale ? (
              <span className="flex items-baseline gap-1.5">
                <span className="font-display text-xl font-medium text-rose-deep">${effectivePrice(product)}</span>
                <span className="font-sans text-xs text-onyx/40 line-through">${product.price}</span>
              </span>
            ) : (
              <span className="font-display text-xl font-medium text-onyx">${product.price}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
