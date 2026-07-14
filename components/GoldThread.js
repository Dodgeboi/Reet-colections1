"use client";

import { motion } from "framer-motion";

/**
 * The signature "silk thread": a single fine gold line that draws itself in.
 * Used as a hero underline and as a section divider that ties the page together.
 */
export default function GoldThread({ className = "", width = 260, variant = "underline" }) {
  const paths = {
    underline: "M2 12 C 60 2, 120 22, 180 10 S 258 6, 258 12",
    divider: "M2 10 C 90 -6, 180 26, 270 8 S 430 -4, 520 12 S 690 24, 778 8",
  };
  const d = paths[variant] || paths.underline;
  const vbWidth = variant === "divider" ? 780 : 260;

  return (
    <svg
      className={className}
      width={width}
      height={variant === "divider" ? 22 : 16}
      viewBox={`0 0 ${vbWidth} ${variant === "divider" ? 22 : 16}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="threadGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B8860B" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#E6C66E" />
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <motion.path
        d={d}
        stroke="url(#threadGold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.6, ease: [0.22, 0.8, 0.2, 1] }}
      />
    </svg>
  );
}
