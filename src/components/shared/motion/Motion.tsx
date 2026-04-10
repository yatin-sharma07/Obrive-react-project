"use client";

import { PropsWithChildren } from "react";
import { motion, Variants } from "framer-motion";

type CommonProps = PropsWithChildren<{ className?: string; delay?: number }>;

export function FadeInOnLoad({ children, className, delay = 0 }: CommonProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInOnView({ children, className, delay = 0 }: CommonProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

const containerStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function StaggerOnView({ children, className }: CommonProps) {
  return (
    <motion.div
      className={className}
      variants={containerStagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: CommonProps) {
  return (
    <motion.div className={className} variants={itemFade}>
      {children}
    </motion.div>
  );
}
