import PageBanner from "@/components/PageBanner";

// Shared shell for the plain-English policy pages.
export default function LegalPage({ eyebrow, title, updated, children }) {
  return (
    <>
      <PageBanner eyebrow={eyebrow} title={title} />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:px-8">
        <p className="font-sans text-xs uppercase tracking-label text-onyx/40">Last updated {updated}</p>
        <div className="legal mt-8 space-y-8">{children}</div>
      </div>
    </>
  );
}

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-onyx">{title}</h2>
      <div className="mt-3 space-y-3 font-sans text-[15px] leading-relaxed text-onyx/70">{children}</div>
    </section>
  );
}
