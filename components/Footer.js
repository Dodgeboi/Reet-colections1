import Link from "next/link";
import Logo from "./Logo";
import GoldThread from "./GoldThread";
import Newsletter from "./Newsletter";
import { FACEBOOK_PAGE } from "@/lib/lives";

const PAY = ["VISA", "MC", "AMEX", "DISC", "UPI"];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-onyx text-ivory">
      <div className="pointer-events-none absolute inset-0 bg-henna [background-size:24px_24px] opacity-10" />
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Logo variant="light" size={58} />
          <p className="mt-6 max-w-lg font-display text-xl font-light italic leading-relaxed text-ivory/80">
            Each piece is selected with love and care, just for you. We&apos;re honored to be a part of your style journey.
          </p>
          <p className="mt-3 font-deva text-base text-gold-light/80">स्नेह से चुना गया</p>
          <div className="mt-6"><GoldThread width={220} /></div>
          <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" aria-label="Reet Collections on Facebook"
            className="mt-6 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-ivory/75 transition hover:border-gold hover:text-gold-light">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.5-1.5H16V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7v3h2.6v8H13z" /></svg>
          </a>
        </div>

        {/* newsletter */}
        <div className="mx-auto mt-10 max-w-md text-center">
          <p className="font-sans text-[11px] uppercase tracking-label text-gold-light">Join the list</p>
          <h3 className="mb-3 mt-1 font-display text-2xl text-ivory">Get notified every time we go live</h3>
          <Newsletter dark />
        </div>

        {/* link columns */}
        <div className="mt-14 grid grid-cols-2 gap-8 border-t border-ivory/10 pt-10 text-center sm:grid-cols-3 sm:text-left">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-label text-gold-light">Shop</p>
            <ul className="mt-3 space-y-2 font-sans text-sm text-ivory/65">
              <li><Link href="/collections" className="hover:text-gold-light">All Pieces</Link></li>
              <li><Link href="/collections/new-in" className="hover:text-gold-light">New In</Link></li>
              <li><Link href="/collections/this-week" className="hover:text-gold-light">This Week</Link></li>
              <li><Link href="/collections/sale" className="hover:text-gold-light">On Sale</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-sans text-[11px] uppercase tracking-label text-gold-light">Help</p>
            <ul className="mt-3 space-y-2 font-sans text-sm text-ivory/65">
              <li><Link href="/faq" className="hover:text-gold-light">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-gold-light">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-gold-light">Shipping &amp; Returns</Link></li>
              <li><Link href="/account" className="hover:text-gold-light">Account &amp; Wishlist</Link></li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="font-sans text-[11px] uppercase tracking-label text-gold-light">Connect</p>
            <ul className="mt-3 space-y-2 font-sans text-sm text-ivory/65">
              <li><Link href="/live" className="hover:text-gold-light">Live Schedule</Link></li>
              <li><Link href="/about" className="hover:text-gold-light">Our Story</Link></li>
              <li><a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="hover:text-gold-light">Facebook →</a></li>
            </ul>
          </div>
        </div>

        {/* payments + copyright */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-ivory/10 pt-8 sm:flex-row sm:justify-between">
          <p className="font-sans text-xs text-ivory/45">© {new Date().getFullYear()} Reet Collections. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {PAY.map((p) => (
              <span key={p} className="rounded border border-ivory/20 bg-ivory/5 px-2 py-1 font-sans text-[9px] font-semibold tracking-wide text-ivory/55">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
