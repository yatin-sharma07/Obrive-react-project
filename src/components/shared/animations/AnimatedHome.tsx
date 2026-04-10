"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { type HoverScaleOptions } from "@/lib/useHoverScale";
import AnimatedStripeSvg from "@/assets/images/animate/animted-box.svg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const leftPanelImages = [
  {
    top: 309,
    left: 493,
    marginBottom: -19612.81,
    marginLeft: -1647.12,
  },
  {
    top: 302,
    left: 491,
    width: 250,
    height: 4.78,
    marginTop: -0.78,
  },
  {
    top: 294,
    left: 489,
    width: 250,
    height: 12.78,
    marginTop: -0.78,
  },
  {
    top: 286,
    left: 487,
    width: 250,
    height: 20.78,
    marginTop: -0.78,
  },
  {
    top: 276,
    left: 484,
    width: 250,
    height: 30.78,
    marginTop: -0.78,
  },
  {
    top: 266,
    left: 481,
    width: 250,
    height: 40.78,
    marginTop: -0.78,
  },
  {
    top: 256,
    left: 478,
    width: 250,
    height: 50.78,
    marginTop: -0.78,
  },
  {
    top: 243,
    left: 474,
    width: 250,
    height: 63.78,
    marginTop: -0.78,
  },
  {
    top: 230,
    left: 470,
    width: 250,
    height: 76.78,
    marginTop: -0.78,
  },
  {
    top: 218,
    left: 466,
    width: 250,
    height: 88.78,
    marginTop: -0.78,
  },
  {
    top: 206,
    left: 462,
    width: 250,
    height: 100.78,
    marginTop: -0.78,
  },
  {
    top: 191,
    left: 455,
    width: 250,
    height: 115.78,
    marginTop: -0.78,
  },
  {
    top: 176,
    left: 448,
    width: 250,
    height: 130.78,
    marginTop: -0.78,
  },
  {
    top: 161,
    left: 441,
    width: 250,
    height: 145.78,
    marginTop: -0.78,
    marginBottom: -0.26,
  },
  {
    top: 146,
    left: 434,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 130,
    left: 425,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 114,
    left: 416,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 98,
    left: 407,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 81,
    left: 394,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 66,
    left: 379,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 51,
    left: 363,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 37,
    left: 345,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 26,
    left: 324,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 14,
    left: 303,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 7,
    left: 282,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 3,
    left: 257,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 1,
    left: 233,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
];

const centerPanelImages = [
  {
    top: 309,
    left: 493,
    marginBottom: -19612.81,
    marginLeft: -1647.12,
  },
  {
    top: 302,
    left: 491,
    width: 250,
    height: 4.78,
    marginTop: -0.78,
  },
  {
    top: 294,
    left: 489,
    width: 250,
    height: 12.78,
    marginTop: -0.78,
  },
  {
    top: 286,
    left: 487,
    width: 250,
    height: 20.78,
    marginTop: -0.78,
  },
  {
    top: 276,
    left: 484,
    width: 250,
    height: 30.78,
    marginTop: -0.78,
  },
  {
    top: 266,
    left: 481,
    width: 250,
    height: 40.78,
    marginTop: -0.78,
  },
  {
    top: 256,
    left: 478,
    width: 250,
    height: 50.78,
    marginTop: -0.78,
  },
  {
    top: 243,
    left: 474,
    width: 250,
    height: 63.78,
    marginTop: -0.78,
  },
  {
    top: 230,
    left: 470,
    width: 250,
    height: 76.78,
    marginTop: -0.78,
  },
  {
    top: 218,
    left: 466,
    width: 250,
    height: 88.78,
    marginTop: -0.78,
  },
  {
    top: 206,
    left: 462,
    width: 250,
    height: 100.78,
    marginTop: -0.78,
  },
  {
    top: 191,
    left: 455,
    width: 250,
    height: 115.78,
    marginTop: -0.78,
  },
  {
    top: 176,
    left: 448,
    width: 250,
    height: 130.78,
    marginTop: -0.78,
  },
  {
    top: 161,
    left: 441,
    width: 250,
    height: 145.78,
    marginTop: -0.78,
    marginBottom: -0.26,
  },
  {
    top: 146,
    left: 434,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 130,
    left: 425,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 114,
    left: 416,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 98,
    left: 407,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 81,
    left: 394,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 66,
    left: 379,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 51,
    left: 363,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 37,
    left: 345,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 26,
    left: 324,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 14,
    left: 303,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 7,
    left: 282,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 3,
    left: 257,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 1,
    left: 233,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 0,
    left: 209,
    width: 250,
    height: 149.51,
    marginBottom: -4.78,
  },
  {
    top: 9,
    left: 185,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 21,
    left: 161,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 37,
    left: 136,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 57,
    left: 115,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 74,
    left: 101,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 90,
    left: 87,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 109,
    left: 75,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 129,
    left: 64,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 150,
    left: 54,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 171,
    left: 44,
    width: 250,
    height: 136.15,
    marginTop: -0.78,
  },
  {
    top: 191,
    left: 34,
    width: 250,
    height: 115.51,
    marginTop: -0.78,
  },
  {
    top: 212,
    left: 24,
    width: 250,
    height: 94.88,
    marginTop: -0.78,
  },
  {
    top: 233,
    left: 16,
    width: 250,
    height: 73.78,
    marginTop: -0.78,
  },
  {
    top: 255,
    left: 10,
    width: 250,
    height: 51.78,
    marginTop: -0.78,
  },
  {
    top: 277,
    left: 4,
    width: 250,
    height: 29.78,
    marginTop: -0.78,
  },
  {
    top: 302,
    left: 0,
    width: 250,
    height: 4.78,
    marginTop: -0.78,
  },
];

const rightPanelImages = [
  {
    top: 230,
    left: 470,
    width: 250,
    height: 76.78,
    marginTop: -0.78,
  },
  {
    top: 218,
    left: 466,
    width: 250,
    height: 88.78,
    marginTop: -0.78,
  },
  {
    top: 206,
    left: 462,
    width: 250,
    height: 100.78,
    marginTop: -0.78,
  },
  {
    top: 191,
    left: 455,
    width: 250,
    height: 115.78,
    marginTop: -0.78,
  },
  {
    top: 176,
    left: 448,
    width: 250,
    height: 130.78,
    marginTop: -0.78,
  },
  {
    top: 161,
    left: 441,
    width: 250,
    height: 145.78,
    marginTop: -0.78,
    marginBottom: -0.26,
  },
  {
    top: 146,
    left: 434,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 130,
    left: 425,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 114,
    left: 416,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 98,
    left: 407,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 81,
    left: 394,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 66,
    left: 379,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 51,
    left: 363,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 37,
    left: 345,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 26,
    left: 324,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 14,
    left: 303,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 7,
    left: 282,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 3,
    left: 257,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 1,
    left: 233,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 0,
    left: 209,
    width: 250,
    height: 149.51,
    marginBottom: -4.78,
  },
  {
    top: 9,
    left: 185,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 21,
    left: 161,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 37,
    left: 136,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 57,
    left: 115,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 74,
    left: 101,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 90,
    left: 87,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 109,
    left: 75,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 129,
    left: 64,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 150,
    left: 54,
    width: 250,
    height: 150.29,
    marginTop: -0.78,
    marginBottom: -4.78,
  },
  {
    top: 171,
    left: 44,
    width: 250,
    height: 136.15,
    marginTop: -0.78,
  },
  {
    top: 191,
    left: 34,
    width: 250,
    height: 115.51,
    marginTop: -0.78,
  },
  {
    top: 212,
    left: 24,
    width: 250,
    height: 94.88,
    marginTop: -0.78,
  },
  {
    top: 233,
    left: 16,
    width: 250,
    height: 73.78,
    marginTop: -0.78,
  },
  {
    top: 255,
    left: 10,
    width: 250,
    height: 51.78,
    marginTop: -0.78,
  },
  {
    top: 277,
    left: 4,
    width: 250,
    height: 29.78,
    marginTop: -0.78,
  },
];

type ImageElementProps = {
  imageData: StripeImageData;
  index: number;
  stripeClassName: string;
  borderClassName: string;
  hoverOptions?: HoverScaleOptions;
};

const ImageElement = ({
  imageData,
  index,
  hoverOptions,
}: ImageElementProps) => {
  const {
    top,
    left,
    width = 150,
    height = 150,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    rotate = false,
  } = imageData;

  const elementRef = useRef<HTMLDivElement>(null);

  const style = {
    width: `${width}px`,
    height: `${height}px`,
    ...(marginTop && { marginTop: `${marginTop}px` }),
    ...(marginBottom && { marginBottom: `${marginBottom}px` }),
    ...(marginLeft && { marginLeft: `${marginLeft}px` }),
    ...(marginRight && { marginRight: `${marginRight}px` }),
  };

  // Add individual stripe animation and hover
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Set initial state for each stripe - start invisible and small
      gsap.set(el, {
        opacity: 0,
        scale: 0.2, // Start very small
        rotateZ: rotate ? 180 : 0, // Set to final rotation immediately
      });

      // Animate each stripe after the split animation begins
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 1.0 + index * 0.02, // Start after split begins, slight stagger
        ease: "back.out(1.5)", // Bouncy effect
      });

      // Add subtle continuous animation and store it for pause/resume
      const floatTl = gsap.to(el, {
        y: Math.sin(index) * 1.5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: Math.random() * 2,
      });

      // Simplified hover effects
      const handleMouseEnter = () => {
        // Pause continuous animation to prevent shaking
        floatTl.pause();

        // Find all stripe elements in the container
        const container = el.closest("[data-cards-container]");
        if (!container) return;

        const allStripes = container.querySelectorAll("[data-stripe-element]");
        const currentIndex = Array.from(allStripes).indexOf(el);

        // Define which cards should be affected (current + 1 before + 1 after = 3 cards)
        const affectedIndices = [
          currentIndex - 1,
          currentIndex,
          currentIndex + 1,
        ].filter((i) => i >= 0 && i < allStripes.length);

        affectedIndices.forEach((targetIndex) => {
          const targetStripe = allStripes[targetIndex].querySelector(
            "[data-stripe-image]"
          );
          if (!targetStripe) return;

          // Calculate effect intensity based on distance from hovered card
          const distance = Math.abs(targetIndex - currentIndex);
          const intensity = distance === 0 ? 1 : 0.5; // Main card full effect, neighbors 50%

          const scaleValue = 1 + intensity * 0.25; // Subtle scale
          const yOffset = intensity * -4; // Subtle lift

          gsap.to(targetStripe, {
            scale: scaleValue,
            y: yOffset,
            duration: 0.35,
            ease: "power2.out",
            transformOrigin: "center center",
            overwrite: true, // Prevent animation conflicts
          });
        });
      };

      const handleMouseLeave = () => {
        // Resume continuous animation
        floatTl.resume();

        // Reset all affected cards
        const container = el.closest("[data-cards-container]");
        if (!container) return;

        const allStripes = container.querySelectorAll("[data-stripe-element]");
        const currentIndex = Array.from(allStripes).indexOf(el);

        const affectedIndices = [
          currentIndex - 1,
          currentIndex,
          currentIndex + 1,
        ].filter((i) => i >= 0 && i < allStripes.length);

        affectedIndices.forEach((targetIndex) => {
          const targetStripe = allStripes[targetIndex].querySelector(
            "[data-stripe-image]"
          );
          if (!targetStripe) return;

          gsap.to(targetStripe, {
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.inOut",
            overwrite: true, // Prevent animation conflicts
          });
        });
      };

      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      };
    });

    return () => ctx.revert();
  }, [index, rotate, hoverOptions]);

  return (
    <div
      ref={elementRef}
      key={index}
      data-stripe-element
      className={`flex flex-col w-[236px] items-center justify-center gap-4 absolute ${
        rotate ? "-rotate-180" : ""
      } cursor-pointer`}
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      <div
        data-stripe-image
        className={cn("relative", rotate ? "-rotate-180" : "")}
        style={{ ...style, willChange: "transform" }}
      >
        <Image
          src={AnimatedStripeSvg}
          alt="animated stripe"
          width={width}
          height={height}
          draggable={false}
          className="select-none pointer-events-none"
        />
      </div>
    </div>
  );
};

type AnimatedCardsProps = {
  className?: string;
  cardBgClassName?: string;
  stripeClassName?: string;
  borderClassName?: string;
  baseWidth?: number;
  baseHeight?: number;
  hoverOptions?: HoverScaleOptions;
};

type StripeImageData = {
  top: number;
  left: number;
  width?: number;
  height?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  rotate?: boolean;
};

export const Box = ({
  className,
  cardBgClassName = "bg-accent",
  stripeClassName = "bg-primary",
  borderClassName = "border-primary/60",
  baseWidth = 1512,
  baseHeight = 345,
  hoverOptions,
}: AnimatedCardsProps) => {
  const containerRef = useRef(null);
  const leftSectionRef = useRef(null);
  const centerSectionRef = useRef(null);
  const rightSectionRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current as HTMLElement | null;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setScale(width / baseWidth);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);

  // Add internal card animations
  useEffect(() => {
    const container = containerRef.current;
    const leftSection = leftSectionRef.current;
    const centerSection = centerSectionRef.current;
    const rightSection = rightSectionRef.current;

    if (!container || !leftSection || !centerSection || !rightSection) return;

    const ctx = gsap.context(() => {
      // center postion for intial state
      const containerWidth = baseWidth;
      const centerX = containerWidth / 2;

      // Set initial states - all sections start at center position
      gsap.set([leftSection, centerSection, rightSection], {
        opacity: 1,
        scale: 0.3, // start small
        transformOrigin: "center center",
        willChange: "transform",
      });

      // position all sections at center initially
      gsap.set(leftSection, {
        x: centerX - 172.5, // Move to center 172.5 is half of 345px width
        y: 0,
      });

      gsap.set(centerSection, {
        x: centerX - 378.5 - 366, // Move center section to center position
        y: 0,
      });

      gsap.set(rightSection, {
        x: centerX - 172.5 - 1167, // Move right section to center position
        y: 0,
      });

      // Create timeline for simultaneous split animation
      const tl = gsap.timeline({
        delay: 0.6, // Delay to let parent slide-in animation start first
      });

      // All sections animate simultaneously - split from center
      tl.to(
        [leftSection, centerSection, rightSection],
        {
          scale: 1, // Grow to full size
          duration: 1.2,
          ease: "power3.out",
        },
        0
      ) // Start at time 0
        .to(
          leftSection,
          {
            x: 0, // Move to original left position
            duration: 1.2,
            ease: "power3.out",
          },
          0
        ) // Start at time 0
        .to(
          centerSection,
          {
            x: 0, // Move to original center position
            duration: 1.2,
            ease: "power3.out",
          },
          0
        ) // Start at time 0
        .to(
          rightSection,
          {
            x: 0, // Move to original right position
            duration: 1.2,
            ease: "power3.out",
          },
          0
        ); // Start at time 0

      // Add subtle floating animation after split completes
      tl.to([leftSection, centerSection, rightSection], {
        y: "random(-2, 2)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: "random(0, 1)",
      });
    }, container);

    return () => ctx.revert();
  }, [scale, baseWidth]);

  const renderImageElement = (imageData: StripeImageData, index: number) => {
    return (
      <ImageElement
        key={index}
        imageData={imageData}
        index={index}
        stripeClassName={stripeClassName}
        borderClassName={borderClassName}
        hoverOptions={hoverOptions}
      />
    );
  };

  return (
    <main
      ref={containerRef}
      data-cards-container
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: `${baseHeight * scale}px` }}
    >
      <div
        className="relative"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <section
          ref={leftSectionRef}
          className={cn(
            "absolute w-[345px] h-[345px] top-0 left-0 rounded-3xl overflow-hidden",
            cardBgClassName
          )}
          aria-label="Left panel"
        >
          <div className="relative w-[335px] h-[243px] top-[102px]">
            <div className="flex flex-col w-[335px] h-[243px] items-end gap-2.5 relative overflow-hidden">
              <div className="relative w-[728.55px] h-[453.74px] ml-[-393.55px]">
                <div className="relative w-[729px] h-[454px]">
                  {leftPanelImages.map((imageData, index) =>
                    renderImageElement(imageData, index)
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={centerSectionRef}
          className="absolute w-[757px] h-[345px] top-0 left-[366px]"
          aria-label="Center panel"
        >
          <div
            className={cn(
              "absolute w-[345px] h-[345px] top-0 left-[23px] rounded-3xl overflow-hidden",
              cardBgClassName
            )}
          />
          <div
            className={cn(
              "absolute w-[345px] h-[345px] top-0 left-[412px] rounded-3xl overflow-hidden",
              cardBgClassName
            )}
          />

          <div className="absolute w-[736px] h-[306px] top-[38px] left-0">
            <div className="flex flex-col w-[736px] h-[306px] items-start gap-2.5 relative overflow-hidden">
              <div className="relative w-[728.55px] h-[453.74px]">
                <div className="relative w-[729px] h-[454px]">
                  {centerPanelImages.map((imageData, index) =>
                    renderImageElement(imageData, index)
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={rightSectionRef}
          className={cn(
            "absolute w-[345px] h-[345px] top-0 left-[1167px] rounded-3xl overflow-hidden",
            cardBgClassName
          )}
          aria-label="Right panel"
        >
          <div className="relative w-[335px] h-[243px]">
            <div className="flex flex-col w-[345px] h-[345px] items-center justify-center gap-2.5 relative overflow-hidden">
              <div className="mt-[-300px] ml-[-100px] mr-[-120px] rotate-180 relative w-[728.55px] h-[453.74px]">
                <div className="relative w-[729px] h-[454px]">
                  {rightPanelImages.map((imageData, index) =>
                    renderImageElement(imageData, index)
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
