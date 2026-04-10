"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export type HoverScaleOptions = {
  scale?: number;
  y?: number;
  duration?: number;
  ease?: string;
  shadow?: boolean;
};

export function useHoverScale<T extends HTMLElement>(
  options: HoverScaleOptions = {}
) {
  const {
    scale = 1.04,
    y = 0,
    duration = 0.25,
    ease = "power2.out",
    shadow = false,
  } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        transformOrigin: "50% 50%",
        willChange: "transform, box-shadow",
      },
    });
    tl.to(el, {
      scale,
      y,
      duration,
      ease,
      transformOrigin: "50% 50%",
      willChange: "transform, box-shadow",
      boxShadow: shadow ? "0 10px 20px rgba(0,0,0,0.08)" : undefined,
    });

    const onEnter = () => tl.play();
    const onLeave = () => tl.reverse();

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      tl.kill();
    };
  }, [scale, y, duration, ease, shadow]);

  return ref;
}
