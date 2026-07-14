"use client";

import { motion } from "framer-motion";

// A fine gold hairline that draws in — the one ornament the site allows itself.
export default function GoldThread({ className = "", width = 260 }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`block h-px bg-gradient-to-r from-transparent via-gold to-transparent ${className}`}
      style={{ width }}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.1, ease: [0.22, 0.8, 0.2, 1] }}
    />
  );
}
