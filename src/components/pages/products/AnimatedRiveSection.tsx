"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RiveProductAnimation } from "./RiveProductAnimation";

interface AnimatedRiveSectionProps {
  sectionClassName?: string;
  riveClassName?: string;
  aspectClassName?: string;
}

export function AnimatedRiveSection({
  sectionClassName = "w-full",
  riveClassName,
  aspectClassName,
}: AnimatedRiveSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const riveWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const sectionEl = sectionRef.current;
    const riveEl = riveWrapperRef.current;

    if (!sectionEl || !riveEl) return;

    const ctx = gsap.context(() => {
      gsap.set(riveEl, {
        opacity: 0,
        xPercent: -160,
        rotate: -2,
        yPercent: 0,
        scaleX: 0.8,
      });

      const tl = gsap.to(riveEl, {
        opacity: 1,
        xPercent: 0,
        rotate: 0,
        yPercent: 0,
        scaleX: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 60%",
          end: "bottom 0",
          scrub: 1.5,
        },
        onUpdate: function () {
          const progress = this.progress();
          // Add snake-like slithering wiggle to y-position
          const waveFrequency = Math.PI * 4; // ~2 full waves during progress
          const waveAmplitude = 8; // Slight vertical deviation in %
          const yWave = Math.sin(progress * waveFrequency) * waveAmplitude;
          gsap.set(riveEl, { yPercent: yWave });

          // Optional: Subtle rotation oscillation for more organic snake feel
          const rotWave = Math.sin(progress * waveFrequency * 1.5) * 1.5;
          gsap.set(riveEl, {
            rotate: this.targets()[0]._gsap?.rotate + rotWave || rotWave,
          });

          // Optional: Pulsing scale for lively emergence
          const scalePulse = Math.sin(progress * Math.PI * 6) * 0.05 + 1;
          gsap.set(riveEl, {
            scaleX:
              this.targets()[0]._gsap?.scaleX + (scalePulse - 1) || scalePulse,
          });
        },
      });

      // Reverse waves on scroll back for smoother scrub feel
      ScrollTrigger.create({
        trigger: sectionEl,
        start: "top 60%",
        end: "bottom 0",
        onUpdate: (self) => {
          if (self.progress < 0.5 && tl.vars.onUpdate) {
            tl.vars.onUpdate.call(tl);
          }
        },
      });
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={sectionClassName}>
      <div ref={riveWrapperRef} className="will-change-transform">
        <RiveProductAnimation
          className={riveClassName}
          aspectClassName={aspectClassName}
        />
      </div>
    </section>
  );
}
