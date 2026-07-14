"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { useAccount } from "./AccountProvider";
import SearchOverlay from "./SearchOverlay";

const NAV = [
  { href: "/collections", label: "Shop" },
  { href: "/live", label: "Live" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "Help" },
];
const SLOGAN = "Selected with love & care, just for you";

const Icon = ({ d, fill = "none" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const SearchI = () => <Icon d={<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>} />;
const HeartI = () => <Icon d={<path d="M12 20s-7-4.3-9.3-8.5C1 8 3 4.7 6.3 4.7c2 0 3.2 1.1 3.7 2 .5-.9 1.7-2 3.7-2 3.3 0 5.3 3.3 3.6 6.8C19 15.7 12 20 12 20Z" />} />;
const BagI = () => <Icon d={<><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>} />;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  const wishlist = useWishlist();
  const { account } = useAccount() || {};
  const wishCount = wishlist?.count || 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const Badge = ({ n }) => n > 0 ? (
    <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose px-1 font-sans text-[10px] font-medium text-ivory">{n}</span>
  ) : null;

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${scrolled ? "border-gold/25 bg-ivory/95 py-2 shadow-soft backdrop-blur-md" : "border-transparent bg-ivory/85 py-3 backdrop-blur-sm"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label="Reet Collections home">
            <span className={`relative inline-block shrink-0 transition-all duration-500 ${scrolled ? "h-11 w-11 sm:h-14 sm:w-14" : "h-12 w-12 sm:h-16 sm:w-16"}`}>
              <Image src="/images/logo-gold.png" alt="Reet Collections logo" fill sizes="64px" className="object-contain transition-transform duration-500 group-hover:scale-105" priority />
            </span>
            <span className="font-display text-xl font-medium leading-none tracking-wide text-onyx sm:text-2xl">Reet Collections</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="nav-underline text-[13px] text-onyx/80 hover:text-onyx">{item.label}</Link>
            ))}
            <div className="flex items-center gap-5 border-l border-onyx/15 pl-6">
              <button onClick={() => setSearchOpen(true)} aria-label="Search" className="text-onyx/80 transition-colors hover:text-rose"><SearchI /></button>
              <Link href="/account" className="whitespace-nowrap font-sans text-[12px] text-onyx/75 transition-colors hover:text-rose">{account ? `Hi, ${account.name.split(" ")[0]}` : "Sign in"}</Link>
              <Link href="/account" aria-label="Wishlist" className="relative text-onyx/80 transition-colors hover:text-rose"><HeartI /><Badge n={wishCount} /></Link>
              <button onClick={() => setCartOpen(true)} aria-label="Open cart" className="relative text-onyx/80 transition-colors hover:text-rose"><BagI /><Badge n={count} /></button>
            </div>
            <a href="https://www.facebook.com/Reetcollections068/" target="_blank" rel="noopener noreferrer" className="btn-rose !px-5 !py-2 text-[12px]">Watch live</a>
          </nav>

          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="text-onyx/80"><SearchI /></button>
            <button onClick={() => setCartOpen(true)} aria-label="Open cart" className="relative text-onyx/80"><BagI /><Badge n={count} /></button>
            <button onClick={() => setOpen((v) => !v)} className="flex flex-col gap-1.5 p-1" aria-label="Toggle menu" aria-expanded={open}>
              <span className={`h-0.5 w-6 bg-onyx transition-all ${open ? "translate-y-[8px] rotate-45" : ""}`} />
              <span className={`h-0.5 w-6 bg-onyx transition-all ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-6 bg-onyx transition-all ${open ? "-translate-y-[8px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        <div className={`overflow-hidden bg-ivory/98 backdrop-blur-md transition-all duration-500 md:hidden ${open ? "max-h-[420px] border-t border-gold/20" : "max-h-0"}`}>
          <nav className="flex flex-col gap-1 px-6 py-5">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="border-b border-onyx/8 py-3 font-display text-2xl text-onyx hover:text-rose">{item.label}</Link>
            ))}
            <Link href="/account" onClick={() => setOpen(false)} className="border-b border-onyx/8 py-3 font-display text-2xl text-onyx hover:text-rose">{account ? `Hi, ${account.name.split(" ")[0]}` : "Sign in"}{wishCount > 0 ? ` · Wishlist (${wishCount})` : ""}</Link>
            <a href="https://www.facebook.com/Reetcollections068/" target="_blank" rel="noopener noreferrer" className="btn-rose mt-4 w-full">Watch live</a>
          </nav>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
