import Link from "next/link";
import MotifDivider, { LotusMark } from "./Motif";

export default function OccasionTiles({ tiles }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="text-center">
        <p className="font-deva text-lg text-gold-deep">अवसर</p>
        <h2 className="mt-1 font-display text-3xl font-light text-onyx sm:text-4xl">Shop by Occasion</h2>
        <p className="mx-auto mt-2 max-w-md font-sans text-sm text-onyx/55">From the mandap to the everyday — pieces chosen for every celebration.</p>
        <div className="mt-5 flex justify-center"><MotifDivider width={80} /></div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-card ring-1 ring-onyx/10 sm:aspect-[3/4]" style={{ background: t.gradient }}>
            <div className="pointer-events-none absolute inset-0 bg-henna [background-size:22px_22px] opacity-[0.12]" />
            <div className="pointer-events-none absolute -right-7 -top-7 text-white/15 transition-transform duration-700 group-hover:rotate-45"><LotusMark size={150} className="text-current" /></div>
            <div className="pointer-events-none absolute -bottom-8 -left-8 text-white/10"><LotusMark size={120} className="text-current" /></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center text-ivory">
              <p className="font-deva text-2xl text-gold-light">{t.deva}</p>
              <span className="my-3 h-px w-10 bg-gold-light/60" />
              <h3 className="font-display text-2xl leading-tight">{t.label}</h3>
              <span className="mt-3 font-sans text-[10px] uppercase tracking-label text-ivory/75 transition-colors group-hover:text-gold-light">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
