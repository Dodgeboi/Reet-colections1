"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import LiveBadge from "./LiveBadge";
import Editable from "./Editable";

const easeLux = [0.22, 0.8, 0.2, 1];
const rise = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: easeLux, delay: 0.12 + i * 0.1 } }),
};

export default function Hero({ image = "/images/products/pink-ombre-suit-angle.png", title = "Wear the Celebration", subtitle = "" }) {
  return (
    <section className="bg-[#F6EFE6] pt-[101px]">
      <div className="mx-auto grid min-h-[calc(100svh-101px)] w-full max-w-[1600px] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="relative flex items-center px-6 py-14 sm:px-10 sm:py-20 lg:px-14 xl:px-20 2xl:px-24">
          <div className="pointer-events-none absolute left-7 top-8 h-24 w-24 rounded-full border border-gold/20 sm:left-12 sm:top-14 sm:h-36 sm:w-36" />
          <div className="relative max-w-xl">
            <motion.div variants={rise} initial="hidden" animate="show" custom={0}>
              <LiveBadge />
            </motion.div>

            <motion.p variants={rise} initial="hidden" animate="show" custom={1}
              className="mt-8 font-deva text-lg text-gold-deep">उत्सव</motion.p>

            <motion.h1 variants={rise} initial="hidden" animate="show" custom={2}
              className="mt-2 font-display font-light leading-[0.96] text-onyx">
              <span className="block text-[clamp(3.35rem,6.2vw,6.75rem)]"><Editable k="hero.title" value={title} /></span>
            </motion.h1>

            <motion.p variants={rise} initial="hidden" animate="show" custom={3}
              className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-onyx/65 sm:text-base">
              <Editable k="hero.subtitle" value={subtitle} />
            </motion.p>

            <motion.div variants={rise} initial="hidden" animate="show" custom={4}
              className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/collections" className="btn-gold">Shop the collection</Link>
              <a href="https://www.facebook.com/Reetcollections068/" target="_blank" rel="noopener noreferrer" className="btn-outline">Watch live</a>
            </motion.div>

          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: easeLux }}
          className="relative min-h-[64svh] overflow-hidden bg-[#EADAC7] lg:min-h-[calc(100svh-101px)]"
          data-edit="site:hero"
        >
          <Image
            src={image}
            alt="Reet Collections pink ombre embroidered suit"
            fill
            priority
            sizes="(max-width:1024px) 100vw, 59vw"
            className="object-contain object-center"
          />
          <div className="pointer-events-none absolute inset-5 border border-white/45 sm:inset-8" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-onyx/15 to-transparent" />
          <p className="absolute bottom-8 right-8 bg-ivory/90 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.18em] text-onyx/65 backdrop-blur-sm sm:bottom-12 sm:right-12">
            The new Reet edit
          </p>
        </motion.div>
      </div>
    </section>
  );
}
