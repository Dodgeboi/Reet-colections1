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
import { onSale } from "@/lib/products";
import { newestThree } from "@/lib/lives";
import LiveCard from "@/components/LiveCard";

export const dynamic = "force-dynamic";

export default function Home() {
  const products = getCatalog();
  const firstImageFor = (slug) => products.find((p) => p.category === slug)?.image || "/images/products/reet-01.jpg";
  const countFor = (slug) => products.filter((p) => p.category === slug).length;
  const TILE_DEFS = [
    ["Kurtis", "kurtis"], ["Lehengas", "lehengas"], ["Pants & Co-ords", "pants"],
    ["Sari", "sari"], ["Blouses", "blouses"], ["New In", "new-in"],
  ];
  const tiles = TILE_DEFS
    .map(([name, slug]) => ({ name, slug, image: slug === "new-in" ? (products.find((p) => p.newIn)?.image || firstImageFor("kurtis")) : firstImageFor(slug), count: slug === "new-in" ? products.filter((p) => p.newIn).length : countFor(slug) }))
    .filter((t) => t.count > 0);
  const occasions = [
    { label: "Bridal & Wedding", deva: "विवाह", href: "/collections/lehengas", gradient: "linear-gradient(150deg,#7a1020,#a8243a 58%,#5d0f1c)" },
    { label: "Festive & Diwali", deva: "उत्सव", href: "/collections/sari", gradient: "linear-gradient(150deg,#946a16,#C9A24B 55%,#6f4f12)" },
    { label: "Everyday Elegance", deva: "रोज़", href: "/collections/kurtis", gradient: "linear-gradient(150deg,#8f4150,#C9737F 60%,#6e3340)" },
    { label: "Party & Sangeet", deva: "संगीत", href: "/collections/this-week", gradient: "linear-gradient(150deg,#46214c,#6e2a63 60%,#341636)" },
  ];
  const newIn = products.filter((p) => p.newIn).slice(0, 8);
  const thisWeek = products.filter((p) => p.thisWeek).slice(0, 4);
  const under50 = products.filter((p) => p.price > 0 && p.price <= 60).slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const saleItems = products.filter((p) => onSale(p)).slice(0, 4);
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryTiles tiles={tiles} />

      <OccasionTiles tiles={occasions} />

      <ProductRow eyebrow="Just arrived" title="New In" viewAllHref="/collections/new-in" products={newIn.slice(0, 4)} />

      <Heritage image="/images/heritage-mustard.jpg" />

      <ProductRow eyebrow="Limited-time prices" title="On Sale Now" viewAllHref="/collections/sale" products={saleItems} tone="blush" />

      <Marquee items={["New Arrivals", "Banarasi Sarees", "Bridal Lehengas", "Diwali Edit", "Wedding Guest", "Kurtis", "Sangeet Nights", "Live Tonight"]} variant="onyx" />

      <ProductRow eyebrow="Featured this week" title="This Week's Collection" viewAllHref="/collections/this-week" products={thisWeek} tone="blush" />

      <ProductRow eyebrow="Wallet-friendly" title="Under $60" viewAllHref="/collections" products={under50.length ? under50 : featured} />

      {/* Recent lives — social proof */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 text-center">
          <p className="eyebrow">Catch up</p>
          <h2 className="mt-2 font-display text-3xl font-light text-onyx sm:text-4xl">Our Newest Lives</h2>
          <div className="mt-4 flex justify-center"><GoldThread width={160} /></div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {newestThree.map((live) => <LiveCard key={live.id} live={live} />)}
        </div>
      </section>

      {/* Closing live CTA — light, so the footer is the single dark anchor */}
      <section className="bg-blush/30 py-14 text-center sm:py-20">
        <div className="mx-auto max-w-2xl px-5">
          <p className="eyebrow">Live every evening · 8 PM</p>
          <h2 className="mt-2 font-display text-3xl font-light text-onyx sm:text-4xl">Be the first to shop the newest drops</h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-onyx/60">Join us live on Facebook each evening — claim your piece in the comments and we&apos;ll set it aside just for you.</p>
          <a href="https://www.facebook.com/Reetcollections068/" target="_blank" rel="noopener noreferrer" className="btn-rose mt-6 inline-block">Watch the live →</a>
        </div>
      </section>
    </>
  );
}
