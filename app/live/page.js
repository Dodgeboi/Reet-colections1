import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import LiveCard from "@/components/LiveCard";
import GoldThread from "@/components/GoldThread";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { newestThree, restOfLives, formatLiveDate, weekLabel, FACEBOOK_PAGE } from "@/lib/lives";

const steps = [
  { n: "01", t: "Join the live", d: "We go live every evening at 8 PM on Facebook. New pieces are revealed one by one." },
  { n: "02", t: "Comment to claim", d: "Love something? Comment the code and your size — we set it aside in your name, no scramble." },
  { n: "03", t: "We hold it for you", d: "We confirm over message, pack it with care, and ship it to your door." },
];

export default function LivePage() {
  return (
    <>
      <PageBanner eyebrow="Live" title="Live Every Evening"
        subtitle="The boutique comes alive at 8 PM. Replay the latest lives below and shop straight from the video." />

      {/* 3 NEWEST LIVES AT TOP */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <Reveal className="mb-8 text-center">
          <p className="eyebrow">Most recent</p>
          <h2 className="mt-2 font-display text-4xl font-light text-onyx">Our 3 Newest Lives</h2>
        </Reveal>
        <RevealGroup className="grid gap-6 md:grid-cols-3" stagger={0.1}>
          {newestThree.map((live) => <RevealItem key={live.id}><LiveCard live={live} /></RevealItem>)}
        </RevealGroup>
      </section>

      {/* HOW LIVE SHOPPING WORKS */}
      <section className="bg-onyx py-20 text-ivory">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal className="mb-12 text-center">
            <p className="font-sans text-[11px] uppercase tracking-label text-gold-light">Easy as one, two, three</p>
            <h2 className="mt-2 font-display text-4xl font-light">How live shopping works</h2>
          </Reveal>
          <RevealGroup className="grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <RevealItem key={s.n}>
                <span className="font-display text-6xl font-light text-gold/40">{s.n}</span>
                <h3 className="mt-3 font-display text-2xl">{s.t}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ivory/65">{s.d}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* OTHER LIVES THIS MONTH */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">The archive</p>
            <h2 className="mt-2 font-display text-3xl font-light text-onyx">More lives this month</h2>
          </div>
          <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="hidden font-sans text-sm text-rose hover:text-rose-deep sm:inline">
            See all on Facebook →
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
                  Watch <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal delay={0.1} className="mt-8 text-center sm:hidden">
          <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="btn-outline">See all on Facebook →</a>
        </Reveal>
      </section>

      {/* CONTACT + SCHEDULE */}
      <section className="bg-blush/25 py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal className="mb-8 text-center">
            <p className="eyebrow">Stay connected</p>
            <h2 className="mt-2 font-display text-3xl font-light text-onyx">Where to find us</h2>
            <div className="mt-4 flex justify-center"><GoldThread width={160} /></div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-onyx/10 bg-white p-6 text-center shadow-soft transition-colors hover:border-rose/40">
              <p className="eyebrow">Facebook</p>
              <p className="mt-2 font-display text-xl text-onyx">@Reetcollections068</p>
              <p className="font-sans text-sm text-onyx/50">Watch our lives</p>
            </a>
            <div className="rounded-2xl border border-onyx/10 bg-white p-6 text-center shadow-soft">
              <p className="eyebrow">Instagram &amp; WhatsApp</p>
              <p className="mt-2 font-display text-xl text-onyx/45">Coming soon</p>
              <p className="font-sans text-sm text-onyx/40">Add handle &amp; number</p>
            </div>
            <div className="rounded-2xl border border-onyx/10 bg-white p-6 text-center shadow-soft">
              <p className="eyebrow">Live schedule</p>
              <p className="mt-2 font-display text-xl text-onyx">Every evening · 8 PM</p>
              <p className="font-sans text-sm text-onyx/50">Weekend specials too</p>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP CTA back to the collection */}
      <section className="bg-onyx py-16 text-center text-ivory">
        <Reveal>
          <h2 className="font-display text-3xl font-light sm:text-4xl">Can&apos;t wait for the next live?</h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-ivory/65">Shop everything currently in the boutique right now.</p>
          <Link href="/collections" className="mt-6 inline-block btn-gold">Shop the collection</Link>
        </Reveal>
      </section>
    </>
  );
}
