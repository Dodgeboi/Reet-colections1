import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import Editable from "@/components/Editable";
import { textOf } from "@/lib/siteText";
import { getSiteSettings } from "@/lib/siteSettings";

export const metadata = {
  title: "Terms of Service",
  description: "The simple terms for shopping with Reet Collections.",
};

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const site = await getSiteSettings();
  const t = (k) => textOf(site, k);
  return (
    <LegalPage
      eyebrow={<Editable k="legal.terms.eyebrow" value={t("legal.terms.eyebrow")} />}
      title={<Editable k="legal.terms.title" value={t("legal.terms.title")} />}
      updated={t("legal.terms.updated")} updatedKey="legal.terms.updated">
      <LegalSection title={<Editable k="legal.terms.section.orders" value={t("legal.terms.section.orders")} />}>
        <p><Editable k="legal.terms.orders" value={t("legal.terms.orders")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.terms.section.pricing" value={t("legal.terms.section.pricing")} />}>
        <p><Editable k="legal.terms.pricing" value={t("legal.terms.pricing")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.terms.section.photos" value={t("legal.terms.section.photos")} />}>
        <p><Editable k="legal.terms.photos" value={t("legal.terms.photos")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.terms.section.returns" value={t("legal.terms.section.returns")} />}>
        <p><Editable k="legal.terms.returns.pre" value={t("legal.terms.returns.pre")} /> <Link href="/shipping-returns" className="text-rose underline hover:text-rose-deep"><Editable k="legal.terms.returns.link" value={t("legal.terms.returns.link")} /></Link> <Editable k="legal.terms.returns.post" value={t("legal.terms.returns.post")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.terms.section.account" value={t("legal.terms.section.account")} />}>
        <p><Editable k="legal.terms.account" value={t("legal.terms.account")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.terms.section.contact" value={t("legal.terms.section.contact")} />}>
        <p><Editable k="legal.terms.contact.pre" value={t("legal.terms.contact.pre")} /> <Link href="/inquiry" className="text-rose underline hover:text-rose-deep"><Editable k="legal.terms.contact.link" value={t("legal.terms.contact.link")} /></Link>.</p>
      </LegalSection>
    </LegalPage>
  );
}
