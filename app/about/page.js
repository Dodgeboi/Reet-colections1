import Link from "next/link";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import GoldThread from "@/components/GoldThread";
import { Reveal } from "@/components/Reveal";
import { getSiteSettings } from "@/lib/siteSettings";
import { textOf } from "@/lib/siteText";
import Editable from "@/components/Editable";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const site = await getSiteSettings();
  return (
    <>
      <PageBanner eyebrow="Our story" title="Selected With Love" />

      {/* Personal intro */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden shadow-card">
              <Image src={site.about} alt="The founder of Reet Collections" fill sizes="(max-width:1024px) 90vw, 40vw" className="object-cover object-[center_18%]" data-edit="site:about" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl font-light leading-tight text-onyx">
              <Editable k="about.heading" value={textOf(site, "about.heading")} />
            </h2>
            <div className="my-5"><GoldThread width={180} /></div>
            <p className="font-sans text-base leading-relaxed text-onyx/75">
              <Editable k="about.p1" value={textOf(site, "about.p1")} />
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-onyx/75">
              <Editable k="about.p2" value={textOf(site, "about.p2")} />
            </p>
            <p className="mt-4 font-sans text-base italic leading-relaxed text-onyx/65">
              <Editable k="about.quote" value={textOf(site, "about.quote")} />
            </p>
          </Reveal>
        </div>
      </section>

      {/* The promise (slogan, full) */}
      <section className="bg-onyx py-20 text-center text-ivory">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal>
            <p className="eyebrow text-gold-light">Our promise to you</p>
            <p className="mt-6 font-display text-3xl font-light italic leading-relaxed sm:text-4xl">
              <Editable k="about.promise" value={textOf(site, "about.promise")} />
            </p>
            <div className="mt-7 flex justify-center"><GoldThread width={200} /></div>
          </Reveal>
        </div>
      </section>

      {/* Contact link at the bottom */}
      <section className="bg-ivory py-16 text-center">
        <Reveal>
          <p className="eyebrow">Come say hello</p>
          <h2 className="mt-2 font-display text-3xl font-light text-onyx sm:text-4xl">I&apos;d love to hear from you</h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-onyx/60">
            Whether it&apos;s a question about sizing or you just want to chat — reach out any time.
          </p>
          <Link href="/contact" className="mt-6 inline-block btn-rose">Contact us</Link>
        </Reveal>
      </section>
    </>
  );
}
