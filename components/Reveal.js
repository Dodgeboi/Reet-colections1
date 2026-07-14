"use client";

import { motion } from "framer-motion";

const easeLux = [0.22, 0.8, 0.2, 1];

export function Reveal({ children, delay = 0, y = 26, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: easeLux, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({ children, className = "", stagger = 0.12 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, y = 26, className = "" }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeLux } },
      }}
    >
      {children}
    </motion.div>
  );
}
