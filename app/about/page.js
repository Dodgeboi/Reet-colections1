import Link from "next/link";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import GoldThread from "@/components/GoldThread";
import { Reveal } from "@/components/Reveal";

export default function AboutPage() {
  return (
    <>
      <PageBanner eyebrow="Our story" title="Selected With Love" />

      {/* Personal intro */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            {/* MAMA PHOTO — replace with a real portrait of the owner */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-t-[180px] rounded-b-2xl ring-1 ring-gold/40 shadow-card">
              <Image src="/images/hero-anarkali.jpg" alt="The founder of Reet Collections" fill sizes="(max-width:1024px) 90vw, 40vw" className="object-cover object-[center_18%]" />
              <span className="absolute bottom-3 left-3 rounded-full bg-onyx/70 px-3 py-1 font-sans text-[10px] uppercase tracking-label text-ivory">Photo of Mama — coming soon</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl font-light leading-tight text-onyx">
              Hi, I&apos;m the heart behind Reet Collections
            </h2>
            <div className="my-5"><GoldThread width={180} /></div>
            <p className="font-sans text-base leading-relaxed text-onyx/75">
              What started as a love for beautiful Indian wear — and a habit of helping friends find
              the perfect outfit — slowly grew into something I never expected: a little boutique with
              a big, warm community around it.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-onyx/75">
              Every evening I go live, hold up the pieces I&apos;ve handpicked, and chat with you about
              fit, fabric, and which colour suits you best. It&apos;s the part of my day I look forward
              to most. There are no warehouses here, no endless racks — just pieces I genuinely love and
              think you&apos;ll love too.
            </p>
            <p className="mt-4 font-sans text-base italic leading-relaxed text-onyx/65">
              {/* Placeholder — swap for her own words */}
              &ldquo;I want every woman who shops with me to feel a little more like herself when she
              puts the outfit on.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* The promise (slogan, full) */}
      <section className="relative overflow-hidden bg-onyx py-20 text-center text-ivory">
        <div className="pointer-events-none absolute inset-0 bg-henna [background-size:24px_24px] opacity-10" />
        <div className="relative mx-auto max-w-2xl px-6">
          <Reveal>
            <p className="eyebrow text-gold-light">Our promise to you</p>
            <p className="mt-6 font-display text-3xl font-light italic leading-relaxed sm:text-4xl">
              Each piece is selected with love and care, just for you. We&apos;re honored to be a part
              of your style journey.
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
