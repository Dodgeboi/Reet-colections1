import Link from "next/link";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import CategoryTiles from "@/components/CategoryTiles";
import OccasionTiles from "@/components/OccasionTiles";
import Heritage from "@/components/Heritage";
import ProductRow from "@/components/ProductRow";
import Marquee from "@/components/Marquee";
import GoldThread from "@/components/GoldThread";
import { getCatalog } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/siteSettings";
import { onSale } from "@/lib/products";
import { newestThree } from "@/lib/lives";
import LiveCard from "@/components/LiveCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, site] = await Promise.all([getCatalog(), getSiteSettings()]);
  const firstImageFor = (slug) => products.find((p) => p.category === slug)?.image || "/images/products/reet-01.jpg";
  const countFor = (slug) => products.filter((p) => p.category === slug).length;
  const TILE_DEFS = [
    ["Kurtis", "kurtis"], ["Lehengas", "lehengas"], ["Pants & Co-ords", "pants"],
    ["Sarees", "sari"], ["Blouses", "blouses"], ["New In", "new-in"],
  ];
  const tiles = TILE_DEFS
    .map(([name, slug]) => ({ name, slug, image: slug === "new-in" ? (products.find((p) => p.newIn)?.image || firstImageFor("kurtis")) : firstImageFor(slug), count: slug === "new-in" ? products.filter((p) => p.newIn).length : countFor(slug) }))
    .filter((t) => t.count > 0);
  const occasions = [
    { label: "Bridal & Wedding", deva: "विवाह", href: "/collections/lehengas", color: "#5D0F1C" },
    { label: "Festive & Diwali", deva: "उत्सव", href: "/collections/sari", color: "#7A5A14" },
    { label: "Everyday Elegance", deva: "रोज़", href: "/collections/kurtis", color: "#7E3B48" },
    { label: "Party & Sangeet", deva: "संगीत", href: "/collections/this-week", color: "#3D1C42" },
  ];
  const newIn = products.filter((p) => p.newIn).slice(0, 8);
  const thisWeek = products.filter((p) => p.thisWeek).slice(0, 4);
  const under50 = products.filter((p) => p.price > 0 && p.price <= 60).slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const saleItems = products.filter((p) => onSale(p)).slice(0, 4);
  return (
    <>
      <Hero image={site.hero} />
      <TrustBar />
      <CategoryTiles tiles={tiles} />

      <OccasionTiles tiles={occasions} />

      <ProductRow eyebrow="Just arrived" title="New In" viewAllHref="/collections/new-in" products={newIn.slice(0, 4)} />

      <Heritage image={site.heritage} />

      <ProductRow eyebrow="Limited-time prices" title="On Sale Now" viewAllHref="/collections/sale" products={saleItems} tone="blush" />

      <Marquee items={["New Arrivals", "Banarasi Sarees", "Bridal Lehengas", "Diwali Edit", "Wedding Guest", "Kurtis", "Sangeet Nights", "Live Tonight"]} variant="onyx" />

      <ProductRow eyebrow="Featured this week" title="This Week's Collection" viewAllHref="/collections/this-week" products={thisWeek} tone="blush" />

      <ProductRow eyebrow="Wallet-friendly" title="Under $60" viewAllHref="/collections" products={under50.length ? under50 : featured} />

      {/* Recent lives — social proof */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 text-center">
          <p className="eyebrow">Catch up</p>
          <h2 className="mt-2 font-display text-3xl font-light text-onyx sm:text-4xl">Our Newest Lives</h2>
          <div className="mt-4 flex justify-center"><GoldThread width={160} /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {newestThree.map((live) => <LiveCard key={live.id} live={live} />)}
        </div>
      </section>

      {/* Closing live CTA — light, so the footer is the single dark anchor */}
      <section className="border-t border-onyx/10 bg-white py-14 text-center sm:py-18">
        <div className="mx-auto max-w-2xl px-5">
          <p className="eyebrow">Live every evening · 8 PM</p>
          <h2 className="mt-2 font-display text-3xl font-light text-onyx sm:text-4xl">Be the first to shop the newest drops</h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-onyx/60">Join us live on Facebook each evening — claim your piece in the comments and we&apos;ll set it aside just for you.</p>
          <a href="https://www.facebook.com/Reetcollections068/" target="_blank" rel="noopener noreferrer" className="btn-rose mt-7 inline-block">Watch the live</a>
        </div>
      </section>
    </>
  );
}
