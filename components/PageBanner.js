import GoldThread from "./GoldThread";

export default function PageBanner({ eyebrow, title, subtitle }) {
  return (
    <section className="bg-onyx pb-14 pt-40 text-center text-ivory">
      <div className="mx-auto max-w-3xl px-6">
        {eyebrow && <p className="font-sans text-[11px] uppercase tracking-label text-gold-light">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-5xl font-light sm:text-6xl">{title}</h1>
        <div className="mt-5 flex justify-center"><GoldThread width={180} /></div>
        {subtitle && <p className="mx-auto mt-5 max-w-xl font-sans text-[15px] leading-relaxed text-ivory/65">{subtitle}</p>}
      </div>
    </section>
  );
}
