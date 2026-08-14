"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { useAccount } from "./AccountProvider";
import SearchOverlay from "./SearchOverlay";
import Editable from "./Editable";
import { textOf } from "@/lib/siteText";

const NAV = [
  { href: "/collections", key: "nav.shop" },
  { href: "/live", key: "nav.live" },
  { href: "/about", key: "nav.about" },
  { href: "/faq", key: "nav.help" },
  { href: "/inquiry", key: "nav.inquiries" },
];

const Icon = ({ d, fill = "none" }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const SearchI = () => <Icon d={<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>} />;
const HeartI = () => <Icon d={<path d="M12 20s-7-4.3-9.3-8.5C1 8 3 4.7 6.3 4.7c2 0 3.2 1.1 3.7 2 .5-.9 1.7-2 3.7-2 3.3 0 5.3 3.3 3.6 6.8C19 15.7 12 20 12 20Z" />} />;
const BagI = () => <Icon d={<><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>} />;

export default function Header({ site }) {
  const t = (k) => textOf(site, k);
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
    <span className="absolute -right-2 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center bg-onyx px-1 font-sans text-[9px] font-medium text-ivory">{n}</span>
  ) : null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* announcement bar */}
        <Link href="/live" className="block bg-onyx py-1.5 text-center font-sans text-[10.5px] uppercase tracking-[0.16em] text-ivory/85 transition-colors hover:text-gold-light">
          <Editable k="nav.announcement" value={t("nav.announcement")} />
        </Link>

        <div className={`border-b transition-all duration-300 ${scrolled ? "border-onyx/10 bg-ivory/95 shadow-soft backdrop-blur-md" : "border-onyx/5 bg-ivory"}`}>
          <div className="mx-auto grid min-h-[76px] w-full max-w-[1600px] grid-cols-[1fr_auto] items-center gap-6 px-5 sm:px-8 xl:grid-cols-[minmax(250px,1fr)_auto_minmax(390px,1fr)] xl:px-10 2xl:px-14">
            <Link href="/" className="group flex w-fit items-center gap-3" aria-label="Reet Collections home">
              <span className="relative inline-block h-11 w-11 shrink-0 sm:h-12 sm:w-12">
                <Image src="/images/logo-gold.png" alt="" fill sizes="48px" className="object-contain transition-transform duration-500 group-hover:rotate-6" priority />
              </span>
              <span className="whitespace-nowrap font-display text-xl font-medium leading-none tracking-wide text-onyx sm:text-[22px]">Reet Collections</span>
            </Link>

            <nav className="hidden items-center justify-center gap-8 xl:flex 2xl:gap-10">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="nav-underline text-[12px] text-onyx/75 hover:text-onyx"><Editable k={item.key} value={t(item.key)} /></Link>
              ))}
            </nav>

            <div className="hidden items-center justify-self-end xl:flex">
              <div className="flex items-center gap-5 border-l border-onyx/12 pl-6 2xl:gap-6 2xl:pl-8">
                {account?.isOwner && <Link href="/admin" className="whitespace-nowrap font-sans text-[12px] font-medium text-gold-deep transition-colors hover:text-onyx">Admin</Link>}
                <button onClick={() => setSearchOpen(true)} aria-label="Search" className="text-onyx/70 transition-colors hover:text-onyx"><SearchI /></button>
                <Link href="/account" className="max-w-[112px] truncate whitespace-nowrap font-sans text-[12px] text-onyx/70 transition-colors hover:text-onyx">{account ? `Hi, ${account.name.split(" ")[0]}` : <Editable k="nav.signIn" value={t("nav.signIn")} />}</Link>
                <Link href="/account" aria-label="Wishlist" className="relative text-onyx/70 transition-colors hover:text-onyx"><HeartI /><Badge n={wishCount} /></Link>
                <button onClick={() => setCartOpen(true)} aria-label="Open cart" className="relative text-onyx/70 transition-colors hover:text-onyx"><BagI /><Badge n={count} /></button>
                <a href="https://www.facebook.com/Reetcollections068/" target="_blank" rel="noopener noreferrer" className="btn-rose ml-1 !px-6 !py-2.5 !text-[10px]"><Editable k="nav.watchLive" value={t("nav.watchLive")} /></a>
              </div>
            </div>

            <div className="flex items-center gap-4 xl:hidden">
              <button onClick={() => setSearchOpen(true)} aria-label="Search" className="text-onyx/75"><SearchI /></button>
              <button onClick={() => setCartOpen(true)} aria-label="Open cart" className="relative text-onyx/75"><BagI /><Badge n={count} /></button>
              <button onClick={() => setOpen((v) => !v)} className="flex flex-col gap-1.5 p-1" aria-label="Toggle menu" aria-expanded={open}>
                <span className={`h-px w-6 bg-onyx transition-all ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
                <span className={`h-px w-6 bg-onyx transition-all ${open ? "opacity-0" : ""}`} />
                <span className={`h-px w-6 bg-onyx transition-all ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
              </button>
            </div>
          </div>

          <div className={`overflow-hidden bg-ivory transition-all duration-500 xl:hidden ${open ? "max-h-[560px] border-t border-onyx/10" : "max-h-0"}`}>
            <nav className="flex flex-col gap-1 px-6 py-5">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="border-b border-onyx/8 py-3 font-display text-2xl text-onyx hover:text-rose-deep"><Editable k={item.key} value={t(item.key)} /></Link>
              ))}
              <Link href="/account" onClick={() => setOpen(false)} className="border-b border-onyx/8 py-3 font-display text-2xl text-onyx hover:text-rose-deep">{account ? `Hi, ${account.name.split(" ")[0]}` : <Editable k="nav.signIn" value={t("nav.signIn")} />}{wishCount > 0 ? ` · Wishlist (${wishCount})` : ""}</Link>
              {account?.isOwner && <Link href="/admin" onClick={() => setOpen(false)} className="border-b border-onyx/8 py-3 font-display text-2xl text-gold-deep hover:text-onyx">Owner Dashboard</Link>}
              <a href="https://www.facebook.com/Reetcollections068/" target="_blank" rel="noopener noreferrer" className="btn-rose mt-4 w-full"><Editable k="nav.watchLive" value={t("nav.watchLive")} /></a>
            </nav>
          </div>
        </div>
      </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
