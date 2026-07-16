"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import LiveBadge from "./LiveBadge";

const easeLux = [0.22, 0.8, 0.2, 1];
const rise = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: easeLux, delay: 0.15 + i * 0.1 } }),
};

// Full-bleed editorial hero: one photograph, quiet type, two flat actions.
export default function Hero({ image = "/images/hero-anarkali.jpg" }) {
  return (
    <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-onyx">
      <Image
        src={image}
        alt="Reet Collections festive wear"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_22%]"
        data-edit="site:hero"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-onyx/85 via-onyx/25 to-onyx/10" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-44 sm:px-8 sm:pb-20">
        <motion.div variants={rise} initial="hidden" animate="show" custom={0}>
          <LiveBadge variant="onDark" />
        </motion.div>

        <motion.p variants={rise} initial="hidden" animate="show" custom={1}
          className="mt-4 font-deva text-lg text-gold-light/90">उत्सव</motion.p>

        <motion.h1 variants={rise} initial="hidden" animate="show" custom={2}
          className="mt-1 max-w-3xl font-display font-light leading-[1.02] text-ivory">
          <span className="block text-[clamp(2.6rem,7vw,5.5rem)]">Wear the Celebration</span>
        </motion.h1>

        <motion.p variants={rise} initial="hidden" animate="show" custom={3}
          className="mt-4 max-w-lg font-sans text-[15px] leading-relaxed text-ivory/80">
          Handpicked Indian ethnic &amp; fusion wear, revealed live every evening.
          Join the live, claim your piece, and we&apos;ll set it aside just for you.
        </motion.p>

        <motion.div variants={rise} initial="hidden" animate="show" custom={4}
          className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/collections" className="btn-light">Shop the collection</Link>
          <a href="https://www.facebook.com/Reetcollections068/" target="_blank" rel="noopener noreferrer"
            className="btn-light-outline">Watch live</a>
        </motion.div>
      </div>
    </section>
  );
}
