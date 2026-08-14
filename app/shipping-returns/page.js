import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import Editable from "@/components/Editable";
import { textOf } from "@/lib/siteText";
import { getSiteSettings } from "@/lib/siteSettings";

export const metadata = {
  title: "Shipping & Returns",
  description: "How Reet Collections ships your order, and what to do if something isn't right.",
};

export const dynamic = "force-dynamic";

export default async function ShippingReturnsPage() {
  const site = await getSiteSettings();
  const t = (k) => textOf(site, k);
  return (
    <LegalPage
      eyebrow={<Editable k="legal.shipping.eyebrow" value={t("legal.shipping.eyebrow")} />}
      title={<Editable k="legal.shipping.title" value={t("legal.shipping.title")} />}
      updated={t("legal.shipping.updated")} updatedKey="legal.shipping.updated">
      <LegalSection title={<Editable k="legal.shipping.section.shipping" value={t("legal.shipping.section.shipping")} />}>
        <p><Editable k="legal.shipping.rate" value={t("legal.shipping.rate")} /></p>
        <p><Editable k="legal.shipping.packing" value={t("legal.shipping.packing")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.shipping.section.returns" value={t("legal.shipping.section.returns")} />}>
        <p><Editable k="legal.shipping.returns" value={t("legal.shipping.returns")} /></p>
        <p><Editable k="legal.shipping.condition" value={t("legal.shipping.condition")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.shipping.section.damaged" value={t("legal.shipping.section.damaged")} />}>
        <p><Editable k="legal.shipping.damaged" value={t("legal.shipping.damaged")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.shipping.section.questions" value={t("legal.shipping.section.questions")} />}>
        <p><Editable k="legal.shipping.questions.pre" value={t("legal.shipping.questions.pre")} /> <a href="https://m.me/Reetcollections068" target="_blank" rel="noopener noreferrer" className="text-rose underline hover:text-rose-deep"><Editable k="legal.shipping.questions.fb" value={t("legal.shipping.questions.fb")} /></a> <Editable k="legal.shipping.questions.mid" value={t("legal.shipping.questions.mid")} /> <Link href="/inquiry" className="text-rose underline hover:text-rose-deep"><Editable k="legal.shipping.questions.link" value={t("legal.shipping.questions.link")} /></Link> <Editable k="legal.shipping.questions.post" value={t("legal.shipping.questions.post")} /></p>
      </LegalSection>
    </LegalPage>
  );
}
