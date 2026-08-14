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
import { textOf } from "@/lib/siteText";
import Editable from "@/components/Editable";
import { newestThree } from "@/lib/lives";
import LiveCard from "@/components/LiveCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, site] = await Promise.all([getCatalog(), getSiteSettings()]);
  const firstImageFor = (slug) => products.find((product) => product.category === slug)?.image || "/images/products/pink-ombre-suit-front.png";
  const countFor = (slug) => products.filter((product) => product.category === slug).length;
  const tileDefs = [["Suit Sets", "suits"], ["Anarkalis", "anarkalis"], ["The New Edit", "new-in"]];
  const tiles = tileDefs
    .map(([name, slug]) => ({
      name,
      slug,
      image: site.categoryTiles[slug] || (slug === "new-in" ? products.find((product) => product.newIn)?.image : firstImageFor(slug)),
      count: slug === "new-in" ? products.filter((product) => product.newIn).length : countFor(slug),
    }))
    .filter((tile) => tile.count > 0);
  const occasions = [
    { label: "Wedding Ready", deva: "विवाह", href: "/collections/anarkalis", color: "#5D0F1C" },
    { label: "Festive Evenings", deva: "उत्सव", href: "/collections/suits", color: "#7A5A14" },
    { label: "Daytime Grace", deva: "रोज़", href: "/collections/suits", color: "#7E3B48" },
    { label: "Live Exclusives", deva: "संगीत", href: "/collections/this-week", color: "#3D1C42" },
  ];

  return (
    <>
      <Hero image={site.hero} title={textOf(site, "hero.title")} subtitle={textOf(site, "hero.subtitle")} />
      <TrustBar text={site.text} />

      <ProductRow
        eyebrow={<Editable k="home.complete.eyebrow" value={textOf(site, "home.complete.eyebrow")} />}
        title={<Editable k="home.complete.title" value={textOf(site, "home.complete.title")} />}
        viewAllHref="/collections"
        products={products.slice(0, 4)}
      />

      <CategoryTiles tiles={tiles} site={site} />
      <OccasionTiles tiles={occasions} site={site} />
      <Heritage image={site.heritage} text={site.text} />

      <Marquee items={["Pink Ombre", "Royal Purple", "Floral Anarkali", "Mint Green", "Three-Piece Sets", "Live Tonight"]} variant="onyx" />

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 text-center">
          <p className="eyebrow"><Editable k="home.lives.eyebrow" value={textOf(site, "home.lives.eyebrow")} /></p>
          <h2 className="mt-2 font-display text-3xl font-light text-onyx sm:text-4xl"><Editable k="home.lives.title" value={textOf(site, "home.lives.title")} /></h2>
          <div className="mt-4 flex justify-center"><GoldThread width={160} /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {newestThree.map((live) => <LiveCard key={live.id} live={{ ...live, thumbnail: site.liveThumbs[live.id] || live.thumbnail }} site={site} />)}
        </div>
      </section>

      <section className="border-t border-onyx/10 bg-white py-14 text-center sm:py-18">
        <div className="mx-auto max-w-2xl px-5">
          <p className="eyebrow"><Editable k="home.cta.eyebrow" value={textOf(site, "home.cta.eyebrow")} /></p>
          <h2 className="mt-2 font-display text-3xl font-light text-onyx sm:text-4xl"><Editable k="home.cta.title" value={textOf(site, "home.cta.title")} /></h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-onyx/60"><Editable k="home.cta.body" value={textOf(site, "home.cta.body")} /></p>
          <a href="https://www.facebook.com/Reetcollections068/" target="_blank" rel="noopener noreferrer" className="btn-rose mt-7 inline-block"><Editable k="home.cta.watchLive" value={textOf(site, "home.cta.watchLive")} /></a>
        </div>
      </section>
    </>
  );
}
