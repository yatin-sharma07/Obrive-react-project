"use client";

import Image from "next/image";
import { TEAM_IMAGES, TEAM_IMAGES_META } from "@/assets/images";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type CardProps = {
  k: keyof typeof TEAM_IMAGES;
  className?: string;
  priority?: boolean;
  parallaxSpeed?: number;
};

function Card({ k, className, priority, parallaxSpeed = 1 }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const img = TEAM_IMAGES[k];
  const meta = TEAM_IMAGES_META[k];

  useEffect(() => {
    if (!cardRef.current) return;

    const element = cardRef.current;

    // images should starts from right
    const initialOffset = 150 + parallaxSpeed * 180;

    gsap.set(element, {
      x: initialOffset,
      opacity: 0,
      scale: 0.8,
    });

    gsap.to(element, {
      opacity: 1,
      scale: 1,
      duration: 1,
      delay: 0.2 * parallaxSpeed,
      ease: "power2.out",
    });

    // parallax effect should move left at different speed
    gsap.to(element, {
      x: -150 * parallaxSpeed,
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element.parentElement) {
          trigger.kill();
        }
      });
    };
  }, [parallaxSpeed]);

  return (
    <div
      ref={cardRef}
      className={`overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm ${className}`}
    >
      <Image
        src={img}
        alt={meta.alt}
        width={meta.width}
        height={meta.height}
        className="h-full w-full object-cover"
        priority={priority}
      />
    </div>
  );
}

// Animation configuration constants
const SCROLL_UNLOCK_DISTANCE = 2500; // Scroll distance in pixels before unlocking
const PARALLAX_MULTIPLIER = 1500; // Base distance for parallax translation

export default function TeamHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const teamCards = scrollContainer.querySelectorAll(".team-card");

    // Create scroll-locked horizontal animation with parallax
    const scrollTrigger = ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: `+=${SCROLL_UNLOCK_DISTANCE}`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Apply parallax effect - each image moves at different speed
        teamCards.forEach((card) => {
          const parallaxSpeed = parseFloat(
            (card as HTMLElement).getAttribute("data-parallax") || "1"
          );
          const translateX = -progress * PARALLAX_MULTIPLIER * parallaxSpeed;

          // Use gsap.set for immediate transform without creating tweens
          gsap.set(card, {
            x: translateX,
          });
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto overflow-hidden"
    >
      {/* mobile simple grid */}
      <div className="grid grid-cols-3 gap-3 sm:hidden px-6">
        {[
          "TEAM_ONE",
          "TEAM_TWO",
          "LORD_GANESH",
          "TEAM_THREE",
          "TEAM_FOUR",
          "TEAM_FIVE",
        ].map((key) => (
          <div
            key={key}
            className="col-span-1 overflow-hidden rounded-xl shadow-md"
          >
            <Image
              src={TEAM_IMAGES[key as keyof typeof TEAM_IMAGES]}
              alt={TEAM_IMAGES_META[key as keyof typeof TEAM_IMAGES_META].alt}
              width={
                TEAM_IMAGES_META[key as keyof typeof TEAM_IMAGES_META].width
              }
              height={
                TEAM_IMAGES_META[key as keyof typeof TEAM_IMAGES_META].height
              }
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Desktop - Scroll-locked horizontal animation */}
      <div className="hidden sm:block" ref={scrollContainerRef}>
        <div className="relative h-[560px] md:h-[620px] lg:h-[680px] overflow-hidden">
          {/* Center: Lord Ganesh */}
          <div
            className="team-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[300px] md:w-[260px] md:h-[360px] lg:w-[400px] lg:h-[520px] z-80"
            data-parallax="0.5"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.LORD_GANESH}
                alt={TEAM_IMAGES_META.LORD_GANESH.alt}
                width={TEAM_IMAGES_META.LORD_GANESH.width}
                height={TEAM_IMAGES_META.LORD_GANESH.height}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Left side images */}
          <div
            className="team-card absolute left-58 top-34 w-[160px] h-[210px] md:w-[190px] md:h-[250px] lg:w-[480px] lg:h-[340px]"
            data-parallax="0.7"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_TWO}
                alt={TEAM_IMAGES_META.TEAM_TWO.alt}
                width={TEAM_IMAGES_META.TEAM_TWO.width}
                height={TEAM_IMAGES_META.TEAM_TWO.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute left-0 top-54 w-[170px] h-[200px] md:w-[200px] md:h-[240px] lg:w-[220px] lg:h-[270px]"
            data-parallax="0.8"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_ONE}
                alt={TEAM_IMAGES_META.TEAM_ONE.alt}
                width={TEAM_IMAGES_META.TEAM_ONE.width}
                height={TEAM_IMAGES_META.TEAM_ONE.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute left-90 bottom-0 w-[220px] h-[160px] md:w-[260px] md:h-[180px] lg:w-[400px] lg:h-[280px] z-10"
            data-parallax="0.75"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_THREE}
                alt={TEAM_IMAGES_META.TEAM_THREE.alt}
                width={TEAM_IMAGES_META.TEAM_THREE.width}
                height={TEAM_IMAGES_META.TEAM_THREE.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Existing right side images */}
          <div
            className="team-card absolute right-20 bottom-14 w-[160px] h-[210px] md:w-[190px] md:h-[250px] lg:w-[230px] lg:h-[300px] z-30"
            data-parallax="0.6"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_SEVEN}
                alt={TEAM_IMAGES_META.TEAM_SEVEN.alt}
                width={TEAM_IMAGES_META.TEAM_SEVEN.width}
                height={TEAM_IMAGES_META.TEAM_SEVEN.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute right-70 bottom-6 w-[210px] h-[170px] md:w-[250px] md:h-[200px] lg:w-[290px] lg:h-[230px]"
            data-parallax="0.7"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_FOUR}
                alt={TEAM_IMAGES_META.TEAM_FOUR.alt}
                width={TEAM_IMAGES_META.TEAM_FOUR.width}
                height={TEAM_IMAGES_META.TEAM_FOUR.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute right-[500px] top-22 w-[140px] h-[200px] md:w-[170px] md:h-[230px] lg:w-[190px] lg:h-[250px] z-20"
            data-parallax="1.25"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_EIGHT}
                alt={TEAM_IMAGES_META.TEAM_EIGHT.alt}
                width={TEAM_IMAGES_META.TEAM_EIGHT.width}
                height={TEAM_IMAGES_META.TEAM_EIGHT.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute right-44 top-30 w-[190px] h-[150px] md:w-[220px] md:h-[170px] lg:w-[250px] lg:h-[200px]"
            data-parallax="1.0"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_FIVE}
                alt={TEAM_IMAGES_META.TEAM_FIVE.alt}
                width={TEAM_IMAGES_META.TEAM_FIVE.width}
                height={TEAM_IMAGES_META.TEAM_FIVE.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute right-24 top-10 w-[170px] h-[210px] md:w-[200px] md:h-[240px] lg:w-[220px] lg:h-[270px] z-40"
            data-parallax="1.2"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_SIX}
                alt={TEAM_IMAGES_META.TEAM_SIX.alt}
                width={TEAM_IMAGES_META.TEAM_SIX.width}
                height={TEAM_IMAGES_META.TEAM_SIX.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* NEW: Additional images on the far right (off-screen initially) */}
          <div
            className="team-card absolute right-[-180px] top-14 w-[170px] h-[220px] md:w-[200px] md:h-[260px] lg:w-[230px] lg:h-[290px] z-15"
            data-parallax="0.5"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_ONE}
                alt={TEAM_IMAGES_META.TEAM_ONE.alt}
                width={TEAM_IMAGES_META.TEAM_ONE.width}
                height={TEAM_IMAGES_META.TEAM_ONE.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute right-[-320px] bottom-16 w-[200px] h-[180px] md:w-[240px] md:h-[210px] lg:w-[280px] lg:h-[230px] z-25"
            data-parallax="0.6"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_TWO}
                alt={TEAM_IMAGES_META.TEAM_TWO.alt}
                width={TEAM_IMAGES_META.TEAM_TWO.width}
                height={TEAM_IMAGES_META.TEAM_TWO.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute right-[-240px] top-52 w-[160px] h-[200px] md:w-[190px] md:h-[230px] lg:w-[220px] lg:h-[260px] z-18"
            data-parallax="1.6"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_THREE}
                alt={TEAM_IMAGES_META.TEAM_THREE.alt}
                width={TEAM_IMAGES_META.TEAM_THREE.width}
                height={TEAM_IMAGES_META.TEAM_THREE.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute right-[-380px] top-20 w-[180px] h-[230px] md:w-[210px] md:h-[260px] lg:w-[240px] lg:h-[300px] z-35"
            data-parallax="1"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_FOUR}
                alt={TEAM_IMAGES_META.TEAM_FOUR.alt}
                width={TEAM_IMAGES_META.TEAM_FOUR.width}
                height={TEAM_IMAGES_META.TEAM_FOUR.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute right-[-360px] bottom-48 w-[190px] h-[160px] md:w-[220px] md:h-[190px] lg:w-[250px] lg:h-[210px] z-22"
            data-parallax="0.3"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_FIVE}
                alt={TEAM_IMAGES_META.TEAM_FIVE.alt}
                width={TEAM_IMAGES_META.TEAM_FIVE.width}
                height={TEAM_IMAGES_META.TEAM_FIVE.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute right-[-470px] bottom-22 w-[175px] h-[220px] md:w-[205px] md:h-[250px] lg:w-[235px] lg:h-[280px] z-28"
            data-parallax="0.4"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_SIX}
                alt={TEAM_IMAGES_META.TEAM_SIX.alt}
                width={TEAM_IMAGES_META.TEAM_SIX.width}
                height={TEAM_IMAGES_META.TEAM_SIX.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute right-[-520px] top-6 w-[185px] h-[240px] md:w-[220px] md:h-[280px] lg:w-[255px] lg:h-[310px] z-32"
            data-parallax="0.8"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_SEVEN}
                alt={TEAM_IMAGES_META.TEAM_SEVEN.alt}
                width={TEAM_IMAGES_META.TEAM_SEVEN.width}
                height={TEAM_IMAGES_META.TEAM_SEVEN.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div
            className="team-card absolute right-[-300px] top-58 w-[165px] h-[210px] md:w-[195px] md:h-[240px] lg:w-[225px] lg:h-[270px] z-19"
            data-parallax="0.5"
          >
            <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 bg-white/10 backdrop-blur-sm h-full">
              <Image
                src={TEAM_IMAGES.TEAM_EIGHT}
                alt={TEAM_IMAGES_META.TEAM_EIGHT.alt}
                width={TEAM_IMAGES_META.TEAM_EIGHT.width}
                height={TEAM_IMAGES_META.TEAM_EIGHT.height}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
