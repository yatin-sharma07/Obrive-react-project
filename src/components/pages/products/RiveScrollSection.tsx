"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { RiveProductAnimation } from "./RiveProductAnimation";

export function RiveScrollSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLarge(query.matches);

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const translateRange: [number, number] = useMemo(
    () => (isLarge ? [-90, 90] : [-60, 60]),
    [isLarge]
  );

  const x = useTransform(scrollYProgress, [0, 1], translateRange);
  const smoothX = useSpring(x, {
    stiffness: 150,
    damping: 24,
    mass: 0.85,
  });

  return (
    <div
      ref={containerRef}
      className="relative max-sm:hidden w-screen max-w-none h-[90vh] left-1/2 -translate-x-1/2 overflow-visible flex items-center justify-center"
    >
      <motion.div
        style={{ x: smoothX }}
        className="relative h-full w-[140vw] max-w-none flex items-center justify-center left-1/2 -translate-x-1/2"
        aria-hidden
      >
        <RiveProductAnimation />
      </motion.div>
    </div>
  );
}
