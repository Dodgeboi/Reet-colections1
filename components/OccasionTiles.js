import Link from "next/link";
import Editable from "./Editable";
import { textOf } from "@/lib/siteText";

// Deep jewel-tone panels — flat color, Devanagari accent, nothing else.
export default function OccasionTiles({ tiles, site }) {
  const t = (k) => textOf(site, k);
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="text-center">
        <p className="font-deva text-lg text-gold-deep"><Editable k="occasion.deva" value={t("occasion.deva")} /></p>
        <h2 className="mt-1 font-display text-3xl font-light text-onyx sm:text-4xl"><Editable k="occasion.title" value={t("occasion.title")} /></h2>
        <p className="mx-auto mt-2 max-w-md font-sans text-sm text-onyx/55"><Editable k="occasion.subtitle" value={t("occasion.subtitle")} /></p>
      </div>
      <div className="mt-9 grid grid-cols-2 gap-1 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href}
            className="group relative block aspect-[4/5] overflow-hidden sm:aspect-[3/4]"
            style={{ background: tile.color }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center text-ivory">
              <p className="font-deva text-2xl text-gold-light">{tile.deva}</p>
              <span className="my-3 h-px w-10 bg-gold-light/50" />
              <h3 className="font-display text-2xl leading-tight">{tile.label}</h3>
              <span className="mt-3 border-b border-transparent font-sans text-[10px] uppercase tracking-[0.16em] text-ivory/70 transition-all duration-300 group-hover:border-gold-light/70 group-hover:text-gold-light"><Editable k="occasion.explore" value={t("occasion.explore")} /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
