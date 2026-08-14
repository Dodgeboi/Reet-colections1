import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import LiveCard from "@/components/LiveCard";
import GoldThread from "@/components/GoldThread";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { newestThree, restOfLives, formatLiveDate, weekLabel, FACEBOOK_PAGE } from "@/lib/lives";
import { getSiteSettings } from "@/lib/siteSettings";
import { textOf } from "@/lib/siteText";
import Editable from "@/components/Editable";

export const dynamic = "force-dynamic";

const STEP_KEYS = ["live.step.1", "live.step.2", "live.step.3"];

export default async function LivePage() {
  const site = await getSiteSettings();
  const t = (k) => textOf(site, k);
  const withThumb = (live) => ({ ...live, thumbnail: site.liveThumbs[live.id] || live.thumbnail });
  return (
    <>
      <PageBanner eyebrow="Live"
        title={<Editable k="banner.live.title" value={textOf(site, "banner.live.title")} />}
        subtitle={<Editable k="banner.live.subtitle" value={textOf(site, "banner.live.subtitle")} />} />

      {/* 3 NEWEST LIVES AT TOP */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <Reveal className="mb-8 text-center">
          <p className="eyebrow"><Editable k="live.recent.eyebrow" value={t("live.recent.eyebrow")} /></p>
          <h2 className="mt-2 font-display text-4xl font-light text-onyx"><Editable k="live.recent.title" value={t("live.recent.title")} /></h2>
        </Reveal>
        <RevealGroup className="grid gap-6 md:grid-cols-3" stagger={0.1}>
          {newestThree.map((live) => <RevealItem key={live.id}><LiveCard live={withThumb(live)} site={site} /></RevealItem>)}
        </RevealGroup>
      </section>

      {/* HOW LIVE SHOPPING WORKS */}
      <section className="bg-onyx py-20 text-ivory">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal className="mb-12 text-center">
            <p className="font-sans text-[11px] uppercase tracking-label text-gold-light"><Editable k="live.howItWorks.eyebrow" value={t("live.howItWorks.eyebrow")} /></p>
            <h2 className="mt-2 font-display text-4xl font-light"><Editable k="live.howItWorks.title" value={t("live.howItWorks.title")} /></h2>
          </Reveal>
          <RevealGroup className="grid gap-10 md:grid-cols-3">
            {STEP_KEYS.map((base, i) => (
              <RevealItem key={base}>
                <span className="font-display text-6xl font-light text-gold/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-2xl"><Editable k={`${base}.t`} value={t(`${base}.t`)} /></h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ivory/65"><Editable k={`${base}.d`} value={t(`${base}.d`)} /></p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* OTHER LIVES THIS MONTH */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow"><Editable k="live.archive.eyebrow" value={t("live.archive.eyebrow")} /></p>
            <h2 className="mt-2 font-display text-3xl font-light text-onyx"><Editable k="live.archive.title" value={t("live.archive.title")} /></h2>
          </div>
          <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="hidden font-sans text-sm text-rose hover:text-rose-deep sm:inline">
            <Editable k="live.seeAllFacebook" value={t("live.seeAllFacebook")} /> →
          </a>
        </Reveal>
        <RevealGroup className="divide-y divide-onyx/10 border-y border-onyx/10">
          {restOfLives.map((live) => (
            <RevealItem key={live.id}>
              <a href={live.facebookUrl} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 py-5 transition-colors hover:bg-blush/20">
                <div>
                  <p className="font-display text-2xl text-onyx">{live.title}</p>
                  <p className="font-sans text-sm text-onyx/50">{weekLabel(live.date)} · {formatLiveDate(live.date)}</p>
                </div>
                <span className="flex items-center gap-2 font-sans text-sm text-rose">
                  <Editable k="live.watch" value={t("live.watch")} /> <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal delay={0.1} className="mt-8 text-center sm:hidden">
          <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="btn-outline"><Editable k="live.seeAllFacebook" value={t("live.seeAllFacebook")} /> →</a>
        </Reveal>
      </section>

      {/* CONTACT + SCHEDULE */}
      <section className="bg-blush/25 py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal className="mb-8 text-center">
            <p className="eyebrow"><Editable k="live.connect.eyebrow" value={t("live.connect.eyebrow")} /></p>
            <h2 className="mt-2 font-display text-3xl font-light text-onyx"><Editable k="live.connect.title" value={t("live.connect.title")} /></h2>
            <div className="mt-4 flex justify-center"><GoldThread width={160} /></div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-onyx/10 bg-white p-6 text-center shadow-soft transition-colors hover:border-rose/40">
              <p className="eyebrow"><Editable k="live.card.facebook.label" value={t("live.card.facebook.label")} /></p>
              <p className="mt-2 font-display text-xl text-onyx"><Editable k="live.card.facebook.handle" value={t("live.card.facebook.handle")} /></p>
              <p className="font-sans text-sm text-onyx/50"><Editable k="live.card.facebook.sub" value={t("live.card.facebook.sub")} /></p>
            </a>
            <div className="rounded-2xl border border-onyx/10 bg-white p-6 text-center shadow-soft">
              <p className="eyebrow"><Editable k="live.card.social.label" value={t("live.card.social.label")} /></p>
              <p className="mt-2 font-display text-xl text-onyx/45"><Editable k="live.card.social.value" value={t("live.card.social.value")} /></p>
              <p className="font-sans text-sm text-onyx/40"><Editable k="live.card.social.sub" value={t("live.card.social.sub")} /></p>
            </div>
            <div className="rounded-2xl border border-onyx/10 bg-white p-6 text-center shadow-soft">
              <p className="eyebrow"><Editable k="live.card.schedule.label" value={t("live.card.schedule.label")} /></p>
              <p className="mt-2 font-display text-xl text-onyx"><Editable k="live.card.schedule.value" value={t("live.card.schedule.value")} /></p>
              <p className="font-sans text-sm text-onyx/50"><Editable k="live.card.schedule.sub" value={t("live.card.schedule.sub")} /></p>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP CTA back to the collection */}
      <section className="bg-onyx py-16 text-center text-ivory">
        <Reveal>
          <h2 className="font-display text-3xl font-light sm:text-4xl"><Editable k="live.shopCta.title" value={t("live.shopCta.title")} /></h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-ivory/65"><Editable k="live.shopCta.body" value={t("live.shopCta.body")} /></p>
          <Link href="/collections" className="mt-6 inline-block btn-gold"><Editable k="live.shopCta.cta" value={t("live.shopCta.cta")} /></Link>
        </Reveal>
      </section>
    </>
  );
}
