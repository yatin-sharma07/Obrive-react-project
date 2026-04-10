"use client";

import { PropsWithChildren, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type CommonProps = PropsWithChildren<{ className?: string; delay?: number }>;

export function FadeInOnLoad({ children, className, delay = 0 }: CommonProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: -16, force3D: true },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        delay,
        force3D: true,
        willChange: "transform, opacity",
      }
    );
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

export function FadeInOnView({ children, className, delay = 0 }: CommonProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 16, force3D: true },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
          delay,
          force3D: true,
          willChange: "transform, opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
            markers: false,
            refreshPriority: -1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

export function StaggerOnView({ children, className, delay = 0 }: CommonProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.12,
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            once: true,
            markers: false,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

// stagger children in from the left with a slight tilt, for a smooth use-case card reveal.
export function StaggerTiltLeftOnView({
  children,
  className,
  delay = 0,
}: CommonProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    const ctx = gsap.context(() => {
      // prepare transform origin for a subtle pivot effect
      gsap.set(items, {
        transformOrigin: "left center",
        willChange: "transform, opacity",
      });

      // create individual triggers so each card aimates as it scrolls into view
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -80, rotate: -6 },
          {
            opacity: 1,
            x: 0,
            rotate: 0,
            duration: 0.65,
            ease: "power3.out",
            delay: 0.12,
            scrollTrigger: {
              trigger: item,
              start: "top 98%",
              once: true,
              markers: false,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// stagger children from bottom-left with smoother transitions.
export function StaggerTiltBottomLeftOnScroll({
  children,
  className,
  delay = 50,
  scrollStart = "top 115%",
}: CommonProps & { scrollStart?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    const ctx = gsap.context(() => {
      items.forEach((item, index) => {
        gsap.set(item, {
          transformOrigin: "left bottom",
          willChange: "transform, opacity",
          force3D: true,
          opacity: 1, // Start invisible
          x: -150,
          y: 80,
          scale: 0.6,
        });

        gsap.fromTo(
          item,
          {
            opacity: 1, // Start from invisible
            x: -120,
            y: 80,
            scale: 0.6,
            skewY: 8,
          },
          {
            opacity: 1, // Fade in slowly
            x: 0,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            skewY: 0,
            duration: 1.5, // Slower duration
            ease: "power2.out", // Smoother easing
            immediateRender: false,
            overwrite: "auto",
            force3D: true,
            scrollTrigger: {
              trigger: item,
              start: scrollStart,
              end: "top 30%", // Longer animation range
              scrub: 1.5, // Higher scrub = smoother, slower
              markers: false,
              invalidateOnRefresh: true,
              refreshPriority: -1,
              onEnter: () => {
                gsap.to(item, {
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  duration: 1.2, // Slower shadow transition
                  ease: "power2.out",
                  force3D: true,
                });
              },
              onLeave: () => {
                gsap.to(item, {
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  duration: 0.8,
                  ease: "power2.out",
                  force3D: true,
                });
              },
              onEnterBack: () => {
                gsap.to(item, {
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  duration: 1.2,
                  ease: "power2.out",
                  force3D: true,
                });
              },
              onLeaveBack: () => {
                gsap.to(item, {
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  duration: 0.8,
                  ease: "power2.out",
                  force3D: true,
                });
              },
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [delay, scrollStart]);

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}
//smooth slide in animation for cards with staggered effects
export function SmoothSlideInCards({
  children,
  className,
  delay = 0,
}: CommonProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // set initial state cards
      gsap.set(el, {
        transformOrigin: "center center",
        willChange: "transform, opacity",
        force3D: true,
      });

      // main animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%", // start animation earlier for smooth experience
          once: true,
          markers: false,
          refreshPriority: -1,
        },
      });

      // animate container from left with smooth easing
      tl.fromTo(
        el,
        {
          opacity: 0,
          x: 0, // we can adjust here from which direction the card should come intial is center
          scale: 0.95,
          rotateY: -10, // reduced rotation for smoother feel
          force3D: true,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          rotateY: 0,
          duration: 1.0, // slightly faster
          delay,
          ease: "power3.out",
          force3D: true,
        }
      );

      // for a subtle bounce effect at the end
      tl.to(el, {
        scale: 1.01, // reduced bounce
        duration: 0.2,
        ease: "power2.out",
        force3D: true,
      }).to(el, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out", // simpler easing for better performance
        force3D: true,
      });
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

// staggered slide-in animation for multiple cards
export function StaggerSlideInCards({
  children,
  className,
  delay = 0,
}: CommonProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // get all direct indiviual cards
    const cards = Array.from(el.children) as HTMLElement[];

    // store stable handler references per card so we can properly remove them on cleanup
    const handlerMap = new Map<
      HTMLElement,
      { enter: EventListener; leave: EventListener }
    >();

    const ctx = gsap.context(() => {
      // set initial state for all cards
      gsap.set(cards, {
        transformOrigin: "center center",
        willChange: "transform, opacity",
        opacity: 0,
        x: -100,
        scale: 0.8,
        rotateY: -20,
      });

      // create staggered animation
      gsap.to(cards, {
        opacity: 1,
        x: 0,
        scale: 1,
        rotateY: 0,
        duration: 1,
        stagger: {
          amount: 0.6, // total time for all stagger animations
          from: "start", // start from first element
          ease: "power2.out",
        },
        ease: "power3.out",
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
          markers: false,
        },
      });

      // add hover effects for each card
      cards.forEach((card) => {
        const onMouseEnter: EventListener = () => {
          gsap.to(card, {
            scale: 1.05,
            rotateY: 5,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const onMouseLeave: EventListener = () => {
          gsap.to(card, {
            scale: 1,
            rotateY: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        handlerMap.set(card, { enter: onMouseEnter, leave: onMouseLeave });
        card.addEventListener("mouseenter", onMouseEnter);
        card.addEventListener("mouseleave", onMouseLeave);
      });
    });

    return () => {
      // detach hover listeners with the same handler references to avoid leaks
      handlerMap.forEach((handlers, card) => {
        card.removeEventListener("mouseenter", handlers.enter);
        card.removeEventListener("mouseleave", handlers.leave);
      });
      ctx.revert();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}
