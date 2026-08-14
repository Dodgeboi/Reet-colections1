"use client";

import { useEffect, useRef, useState } from "react";
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
  const images = [product.image, ...(Array.isArray(product.images) ? product.images : [])]
    .filter((src, index, list) => src && list.indexOf(src) === index)
    .slice(0, 3);
  const [activeImage, setActiveImage] = useState(0);
  const cycleRef = useRef(null);

  const stopCycle = () => {
    if (cycleRef.current) window.clearInterval(cycleRef.current);
    cycleRef.current = null;
    setActiveImage(0);
  };

  const startCycle = () => {
    if (images.length < 2 || document.body.classList.contains("photo-edit-mode")) return;
    if (cycleRef.current) window.clearInterval(cycleRef.current);
    setActiveImage(1);
    cycleRef.current = window.setInterval(() => {
      setActiveImage((index) => (index + 1) % images.length);
    }, 900);
  };

  useEffect(() => () => {
    if (cycleRef.current) window.clearInterval(cycleRef.current);
  }, []);

  const quickAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product, product.sizes?.[0] || "", 1);
  };
  const toggleWish = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (wishlist?.toggle(product.id) === false) window.location.href = "/account";
  };

  return (
    <Link
      href={`/product/${product.id}`}
      prefetch={false}
      className="group relative block"
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    >
      <div className={`relative overflow-hidden bg-white ${isSold ? "opacity-70" : ""}`}>
        <div
          className="product-image-shell relative aspect-[2/3] overflow-hidden bg-[#F3EDE4]"
          data-edit={`product:${product.id}`}
        >
          {images.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={index === 0 ? product.name : `${product.name} view ${index + 1}`}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className={`object-cover object-top transition-[opacity,transform] duration-500 ease-out ${
                activeImage === index ? "scale-100 opacity-100" : "scale-[1.015] opacity-0"
              } ${isSold ? "grayscale-[0.35]" : ""}`}
            />
          ))}

          <div className="absolute left-0 top-3 z-10 flex flex-col items-start gap-1">
            {product.status !== "available" && (
              <span className={`px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.14em] ${meta.className}`}>{meta.label}</span>
            )}
            {sale ? (
              <span className="bg-rose-deep px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-white">{discountPct(product)}% <Editable k="product.off" value={off} /></span>
            ) : product.newIn ? (
              <span className="bg-onyx px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-ivory"><Editable k="productCard.new" value={newLabel} /></span>
            ) : null}
          </div>

          <button
            onClick={toggleWish}
            aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
            className={`absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center transition-colors ${wished ? "bg-onyx text-ivory" : "bg-white/90 text-onyx/60 hover:text-onyx"}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7-4.3-9.3-8.5C1 8 3 4.7 6.3 4.7c2 0 3.2 1.1 3.7 2 .5-.9 1.7-2 3.7-2 3.3 0 5.3 3.3 3.6 6.8C19 15.7 12 20 12 20Z" /></svg>
          </button>

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 transition-all duration-300 group-hover:bottom-14" aria-hidden="true">
              {images.map((src, index) => (
                <span key={src} className={`h-1 rounded-full shadow-sm transition-all duration-300 ${activeImage === index ? "w-5 bg-white" : "w-1.5 bg-white/60"}`} />
              ))}
            </div>
          )}

          {!isSold && (
            <button
              onClick={quickAdd}
              className="absolute inset-x-0 bottom-0 z-20 translate-y-full bg-onyx py-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-ivory transition-transform duration-300 hover:bg-gold-deep hover:text-onyx group-hover:translate-y-0"
            >
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
