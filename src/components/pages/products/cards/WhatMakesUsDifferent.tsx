"use client";

import FONTS from "@/assets/fonts";
import { ICONS, ICONS_META } from "@/assets/images";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Item = { title: string; description: string };

export default function WhatMakesUsDifferent({
  items,
  showGlow = true,
}: {
  items: readonly Item[];
  showGlow?: boolean;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [shouldAnimateGlow, setShouldAnimateGlow] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldAnimateGlow(true);

            if (timeoutRef.current) {
              window.clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = window.setTimeout(() => {
              setShouldAnimateGlow(false);
              timeoutRef.current = null;
            }, 10000);
          }
        });
      },
      {
        threshold: 0.9,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const glowClassByIndex = (idx: number) => {
    switch (idx % 4) {
      case 0:
        return "top-18";
      case 1:
        return "top-1/2 -translate-y-1/2";
      case 2:
        return "top-28 -translate-y-1/2";
      default:
        return "top-1/2 -translate-y-1/2";
    }
  };

  return (
    <section
      ref={sectionRef}
      className="bg-primary pl-18 max-sm:p-0 max-md:pl-4"
    >
      <div className="grid grid-cols-1 relative sm:grid-cols-2 lg:grid-cols-4 h-auto sm:h-[569px] max-md:py-8">
        {items.map((item, idx) => {
          const bordered = idx % 2 === 0;
          return (
            <div
              key={`${item.title}-${idx}`}
              className={`relative p-6 max-sm:border-b border-accent/60 sm:p-10 lg:p-14 ${
                bordered ? "sm:border-1 border-accent/60" : ""
              }`}
            >
              {showGlow && (
                <motion.div
                  className={`hidden lg:block absolute left-0 -translate-x-1/2 ${glowClassByIndex(
                    idx
                  )} z-10 pointer-events-none`}
                  animate={
                    shouldAnimateGlow
                      ? { y: [0, -16, 50, 0], opacity: [0.9, 1, 0.9, 1] }
                      : { y: 0, opacity: 1 }
                  }
                  transition={{
                    duration: 6,
                    ease: "easeInOut",
                    times: [0, 0.3, 0.7, 1],
                    delay: idx * 0.3,
                  }}
                >
                  <Image
                    src={ICONS.GLOW_BALL}
                    alt={ICONS_META.GLOW_BALL.alt}
                    width={ICONS_META.GLOW_BALL.width}
                    height={ICONS_META.GLOW_BALL.height}
                  />
                </motion.div>
              )}
              <h3
                className={`${
                  FONTS.microgrammaBold.className
                } text-md text-accent mb-4 z-10 ${
                  idx === 0
                    ? "mt-10"
                    : idx === 1
                    ? "mt-70"
                    : idx === 2
                    ? "mt-8"
                    : "mt-50"
                } max-md:mt-6`}
              >
                {item.title}
              </h3>
              <p className="text-accent/80 text-xs leading-relaxed z-10">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
