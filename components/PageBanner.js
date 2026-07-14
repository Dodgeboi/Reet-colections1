import GoldThread from "./GoldThread";
export default function PageBanner({ eyebrow, title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-onyx pb-16 pt-36 text-center text-ivory">
      <div className="pointer-events-none absolute inset-0 bg-henna [background-size:22px_22px] opacity-15" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl px-6">
        {eyebrow && <p className="font-sans text-[11px] uppercase tracking-label text-gold-light">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-5xl font-light sm:text-6xl">{title}</h1>
        <div className="mt-5 flex justify-center"><GoldThread width={200} /></div>
        {subtitle && <p className="mx-auto mt-5 max-w-xl font-sans text-ivory/70">{subtitle}</p>}
      </div>
    </section>
  );
}
