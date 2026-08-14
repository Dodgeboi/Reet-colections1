import Link from "next/link";
import Image from "next/image";
import Editable from "./Editable";
import { textOf } from "@/lib/siteText";

// A tight editorial mosaic — hairline gutters, photography does the talking.
export default function CategoryTiles({ tiles, site }) {
  const t = (k) => textOf(site, k);
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8 text-center">
        <p className="eyebrow"><Editable k="category.eyebrow" value={t("category.eyebrow")} /></p>
        <h2 className="mt-2 font-display text-3xl font-light text-onyx sm:text-4xl"><Editable k="category.title" value={t("category.title")} /></h2>
      </div>
      <div className="grid grid-cols-2 gap-1 lg:grid-cols-3">
        {tiles.map((tile, idx) => (
          <Link key={tile.slug} href={`/collections/${tile.slug}`}
            className={`group relative overflow-hidden ${idx === 0 ? "col-span-2 lg:col-span-1" : ""}`}>
            <div className="relative aspect-[4/5] sm:aspect-[3/4]">
              <Image src={tile.image} alt={tile.name} fill sizes="(max-width:640px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                data-edit={`category:${tile.slug}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/70 via-onyx/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-xl text-ivory sm:text-2xl">{tile.name}</h3>
                <span className="mt-1 inline-block border-b border-gold-light/0 font-sans text-[10px] uppercase tracking-[0.16em] text-gold-light transition-all duration-300 group-hover:border-gold-light/70"><Editable k="category.shopNow" value={t("category.shopNow")} /></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
