import PageBanner from "@/components/PageBanner";
import Editable from "@/components/Editable";
import { textOf } from "@/lib/siteText";
import { getSiteSettings } from "@/lib/siteSettings";

const FAQ_KEYS = ["faq.1", "faq.2", "faq.3", "faq.4", "faq.5", "faq.6", "faq.7"];

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const site = await getSiteSettings();
  const t = (k) => textOf(site, k);
  return (
    <>
      <PageBanner
        eyebrow={<Editable k="faq.eyebrow" value={t("faq.eyebrow")} />}
        title={<Editable k="faq.title" value={t("faq.title")} />}
        subtitle={<Editable k="faq.subtitle" value={t("faq.subtitle")} />} />
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <div className="space-y-4">
          {FAQ_KEYS.map((base) => (
            <details key={base} className="group border border-onyx/10 bg-white p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between font-display text-xl text-onyx">
                <Editable k={`${base}.q`} value={t(`${base}.q`)} />
                <span className="text-gold-deep transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-onyx/70"><Editable k={`${base}.a`} value={t(`${base}.a`)} /></p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
