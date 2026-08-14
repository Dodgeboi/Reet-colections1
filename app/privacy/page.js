import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import Editable from "@/components/Editable";
import { textOf } from "@/lib/siteText";
import { getSiteSettings } from "@/lib/siteSettings";

export const metadata = {
  title: "Privacy Policy",
  description: "What information Reet Collections collects and how it's used.",
};

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const site = await getSiteSettings();
  const t = (k) => textOf(site, k);
  return (
    <LegalPage
      eyebrow={<Editable k="legal.privacy.eyebrow" value={t("legal.privacy.eyebrow")} />}
      title={<Editable k="legal.privacy.title" value={t("legal.privacy.title")} />}
      updated={t("legal.privacy.updated")} updatedKey="legal.privacy.updated">
      <LegalSection title={<Editable k="legal.privacy.section.collect" value={t("legal.privacy.section.collect")} />}>
        <p style={{ whiteSpace: "pre-line" }}><Editable k="legal.privacy.whatWeCollect" value={t("legal.privacy.whatWeCollect")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.privacy.section.use" value={t("legal.privacy.section.use")} />}>
        <p><Editable k="legal.privacy.howWeUse" value={t("legal.privacy.howWeUse")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.privacy.section.payments" value={t("legal.privacy.section.payments")} />}>
        <p><Editable k="legal.privacy.payments" value={t("legal.privacy.payments")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.privacy.section.device" value={t("legal.privacy.section.device")} />}>
        <p><Editable k="legal.privacy.onYourDevice" value={t("legal.privacy.onYourDevice")} /></p>
      </LegalSection>
      <LegalSection title={<Editable k="legal.privacy.section.choices" value={t("legal.privacy.section.choices")} />}>
        <p><Editable k="legal.privacy.yourChoices.pre" value={t("legal.privacy.yourChoices.pre")} /> <Link href="/inquiry" className="text-rose underline hover:text-rose-deep"><Editable k="legal.privacy.yourChoices.link" value={t("legal.privacy.yourChoices.link")} /></Link> <Editable k="legal.privacy.yourChoices.post" value={t("legal.privacy.yourChoices.post")} /></p>
      </LegalSection>
    </LegalPage>
  );
}
