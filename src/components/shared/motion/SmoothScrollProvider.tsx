"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  className?: string;
}

export default function SmoothScrollProvider({
  children,
  className,
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with optimized settings for ultra-smooth scrolling
    const lenis = new Lenis({
      duration: 1.2, // Increased for smoother, more fluid motion
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential easing
      wheelMultiplier: 1.0, // More responsive wheel scrolling
      touchMultiplier: 2.0, // Enhanced touch sensitivity
      smoothWheel: true,
      syncTouch: false, // Better for performance, enable if needed
      lerp: 0.1, // Optimal interpolation for smoothness
      infinite: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
    });

    lenisRef.current = lenis;

    // Optimize ScrollTrigger integration
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker for better performance 
    // Create stable function reference to ensure proper cleanup
    const onTick = (time: number) => {
      lenis.raf(time * 1000); // GSAP ticker uses seconds, Lenis uses milliseconds
    };

    gsap.ticker.add(onTick);

    // Disable GSAP's lag smoothing for smoother scrolling
    gsap.ticker.lagSmoothing(0);

    // Enhanced ScrollTrigger scroller proxy
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        if (value !== undefined) {
          lenis.scrollTo(value, { immediate: true, lock: true });
          return value;
        }
        return lenis.scroll ?? 0;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.defaults({ scroller: document.body });

    // Refresh ScrollTrigger after a brief delay to ensure proper initialization
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);

      // Remove GSAP ticker with the same function reference
      gsap.ticker.remove(onTick);

      // Remove Lenis scroll event listener before destroy
      lenis.off("scroll", ScrollTrigger.update);

      // Cleanup Lenis
      lenis.destroy();
      lenisRef.current = null;

      // Reset ScrollTrigger
      ScrollTrigger.scrollerProxy(document.body, {});
      ScrollTrigger.refresh();
    };
  }, []);

  // Handle window resize with debouncing for better performance
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.resize();
          ScrollTrigger.refresh();
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Stop scrolling when user is inactive (optional performance boost)
  useEffect(() => {
    const stopRaf = () => {
      if (lenisRef.current) {
        lenisRef.current.stop();
      }
    };

    const startRaf = () => {
      if (lenisRef.current) {
        lenisRef.current.start();
      }
    };

    window.addEventListener("blur", stopRaf);
    window.addEventListener("focus", startRaf);

    return () => {
      window.removeEventListener("blur", stopRaf);
      window.removeEventListener("focus", startRaf);
    };
  }, []);

  return <div className={className}>{children}</div>;
}
