import Link from "next/link";
import Image from "next/image";
export default function CategoryTiles({ tiles }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-7 text-center">
        <p className="eyebrow">Find your style</p>
        <h2 className="mt-2 font-display text-3xl font-light text-onyx sm:text-4xl">Shop by Category</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {tiles.map((t, idx) => (
          <Link key={t.slug} href={`/collections/${t.slug}`}
            className={`group relative overflow-hidden rounded-2xl ${idx === 0 ? "col-span-2 lg:col-span-1" : ""}`}>
            <div className="relative aspect-[4/5] sm:aspect-[3/4]">
              <Image src={t.image} alt={t.name} fill sizes="(max-width:640px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/70 via-onyx/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                <h3 className="font-display text-xl text-ivory sm:text-2xl">{t.name}</h3>
                <span className="mt-1 inline-block font-sans text-[11px] uppercase tracking-label text-gold-light opacity-0 transition-opacity duration-300 group-hover:opacity-100">Shop now →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
