import Link from "next/link";
import Logo from "./Logo";
import GoldThread from "./GoldThread";
import Newsletter from "./Newsletter";
import Editable from "./Editable";
import { textOf } from "@/lib/siteText";
import { FACEBOOK_PAGE } from "@/lib/lives";

export default function Footer({ site }) {
  const t = (k) => textOf(site, k);
  return (
    <footer className="bg-onyx text-ivory">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Logo variant="light" size={58} />
          <p className="mt-6 max-w-lg font-display text-xl font-light italic leading-relaxed text-ivory/80">
            <Editable k="footer.tagline" value={t("footer.tagline")} />
          </p>
          <p className="mt-3 font-deva text-base text-gold-light/80"><Editable k="footer.tagline.deva" value={t("footer.tagline.deva")} /></p>
          <div className="mt-6"><GoldThread width={220} /></div>
          <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" aria-label="Reet Collections on Facebook"
            className="mt-6 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-ivory/75 transition hover:border-gold hover:text-gold-light">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.5-1.5H16V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7v3h2.6v8H13z" /></svg>
          </a>
        </div>

        {/* newsletter */}
        <div className="mx-auto mt-10 max-w-md text-center">
          <p className="font-sans text-[11px] uppercase tracking-label text-gold-light"><Editable k="footer.newsletter.eyebrow" value={t("footer.newsletter.eyebrow")} /></p>
          <h3 className="mb-3 mt-1 font-display text-2xl text-ivory"><Editable k="footer.newsletter.title" value={t("footer.newsletter.title")} /></h3>
          <Newsletter dark />
        </div>

        {/* link columns */}
        <div className="mt-14 grid grid-cols-2 gap-8 border-t border-ivory/10 pt-10 text-center sm:grid-cols-3 sm:text-left">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-label text-gold-light"><Editable k="footer.col.shop" value={t("footer.col.shop")} /></p>
            <ul className="mt-3 space-y-2 font-sans text-sm text-ivory/65">
              <li><Link href="/collections" className="hover:text-gold-light"><Editable k="footer.link.allProducts" value={t("footer.link.allProducts")} /></Link></li>
              <li><Link href="/collections/new-in" className="hover:text-gold-light"><Editable k="footer.link.newIn" value={t("footer.link.newIn")} /></Link></li>
              <li><Link href="/collections/this-week" className="hover:text-gold-light"><Editable k="footer.link.thisWeek" value={t("footer.link.thisWeek")} /></Link></li>
              <li><Link href="/collections/sale" className="hover:text-gold-light"><Editable k="footer.link.onSale" value={t("footer.link.onSale")} /></Link></li>
            </ul>
          </div>
          <div>
            <p className="font-sans text-[11px] uppercase tracking-label text-gold-light"><Editable k="footer.col.help" value={t("footer.col.help")} /></p>
            <ul className="mt-3 space-y-2 font-sans text-sm text-ivory/65">
              <li><Link href="/faq" className="hover:text-gold-light"><Editable k="footer.link.faq" value={t("footer.link.faq")} /></Link></li>
              <li><Link href="/inquiry" className="hover:text-gold-light"><Editable k="footer.link.inquiries" value={t("footer.link.inquiries")} /></Link></li>
              <li><Link href="/shipping-returns" className="hover:text-gold-light"><Editable k="footer.link.shipping" value={t("footer.link.shipping")} /></Link></li>
              <li><Link href="/account" className="hover:text-gold-light"><Editable k="footer.link.account" value={t("footer.link.account")} /></Link></li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="font-sans text-[11px] uppercase tracking-label text-gold-light"><Editable k="footer.col.connect" value={t("footer.col.connect")} /></p>
            <ul className="mt-3 space-y-2 font-sans text-sm text-ivory/65">
              <li><Link href="/live" className="hover:text-gold-light"><Editable k="footer.link.liveSchedule" value={t("footer.link.liveSchedule")} /></Link></li>
              <li><Link href="/about" className="hover:text-gold-light"><Editable k="footer.link.ourStory" value={t("footer.link.ourStory")} /></Link></li>
              <li><a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="hover:text-gold-light"><Editable k="footer.link.facebook" value={t("footer.link.facebook")} /></a></li>
            </ul>
          </div>
        </div>

        {/* legal + copyright */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-ivory/10 pt-8 sm:flex-row sm:justify-between">
          <p className="font-sans text-xs text-ivory/45">© {new Date().getFullYear()} <Editable k="footer.copyright" value={t("footer.copyright")} /></p>
          <div className="flex items-center gap-5 font-sans text-xs text-ivory/45">
            <Link href="/privacy" className="hover:text-gold-light"><Editable k="footer.link.privacy" value={t("footer.link.privacy")} /></Link>
            <Link href="/terms" className="hover:text-gold-light"><Editable k="footer.link.terms" value={t("footer.link.terms")} /></Link>
            <Link href="/shipping-returns" className="hover:text-gold-light"><Editable k="footer.link.shipping2" value={t("footer.link.shipping2")} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
