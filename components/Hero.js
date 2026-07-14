"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import LiveBadge from "./LiveBadge";

const easeLux = [0.22, 0.8, 0.2, 1];
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.85, ease: easeLux, delay: 0.12 + i * 0.11 } }),
};

export default function Hero() {
  return (
    // Tightened to content (no full-screen empty gap under the title on scroll).
    <section className="relative overflow-hidden bg-ivory pt-28 pb-12 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-henna [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-blush/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-gold/15 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="text-center lg:text-left">
          <motion.div variants={rise} initial="hidden" animate="show" custom={0}>
            <LiveBadge variant="light" />
          </motion.div>

          <motion.p variants={rise} initial="hidden" animate="show" custom={0.5} className="mt-5 font-deva text-xl text-gold-deep/85">उत्सव</motion.p>

          <motion.h1 variants={rise} initial="hidden" animate="show" custom={1} className="mt-2 font-display font-light leading-[0.96] text-onyx">
            <span className="block text-[clamp(2.8rem,8vw,6rem)]">Wear the</span>
            <span className="block text-[clamp(2.8rem,8vw,6rem)] text-gold-sheen">Celebration</span>
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.3, ease: easeLux, delay: 0.5 }}
            className="mx-auto mt-5 h-px w-52 origin-left bg-gradient-to-r from-gold via-rose to-transparent lg:mx-0" />

          <motion.p variants={rise} initial="hidden" animate="show" custom={3}
            className="mx-auto mt-6 max-w-md font-display text-xl font-light leading-relaxed text-onyx/70 lg:mx-0">
            Handpicked Indian ethnic &amp; fusion wear, revealed live every evening. Join the live,
            claim your piece, and we&apos;ll set it aside just for you.
          </motion.p>

          <motion.div variants={rise} initial="hidden" animate="show" custom={4}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link href="/collections" className="btn-gold">Shop the collection</Link>
            <a href="https://www.facebook.com/Reetcollections068/" target="_blank" rel="noopener noreferrer" className="btn-outline">Watch live →</a>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: easeLux, delay: 0.3 }} className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-[3/4.2] overflow-hidden rounded-t-[999px] rounded-b-[26px] ring-1 ring-gold/40 shadow-card">
            <Image src="/images/hero-anarkali.jpg" alt="Reet Collections festive set" fill
              sizes="(max-width:1024px) 80vw, 38vw" className="object-cover object-[center_18%]" priority />
            <span className="absolute left-4 bottom-5 rounded-full bg-rose px-3 py-1 font-sans text-[10px] uppercase tracking-label text-ivory shadow-soft">New drop</span>
          </div>
          <div className="pointer-events-none absolute -inset-2 rounded-t-[999px] rounded-b-[30px] border border-gold/35" />
        </motion.div>
      </div>
    </section>
  );
}
