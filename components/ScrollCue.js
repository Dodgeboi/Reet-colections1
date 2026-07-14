"use client";
import { motion } from "framer-motion";
export default function ScrollCue({ label = "Scroll" }) {
  return (
    <div className="flex flex-col items-center py-7">
      <span className="font-sans text-[10px] uppercase tracking-label text-gold-deep/70">{label}</span>
      <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="mt-2 block h-8 w-px bg-gradient-to-b from-gold to-transparent" />
    </div>
  );
}
