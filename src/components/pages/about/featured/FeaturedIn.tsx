"use client";

import FONTS from "@/assets/fonts";
import { FEATURED_IN } from "@/constants/pages/about/featured";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FeaturedIn = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = FEATURED_IN.length;
  const [cardsPerView, setCardsPerView] = useState<number | undefined>(
    undefined
  );
  const maxIndex = cardsPerView ? Math.ceil(totalCards / cardsPerView) - 1 : 0;

  const scrollToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const scrollToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const scrollToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    const autoScroll = setInterval(() => {
      scrollToNext();
    }, 4000);

    return () => clearInterval(autoScroll);
  }, [scrollToNext]);

  // responsive: show 1 card per view on mobile, 2 on desktop
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setCardsPerView(window.innerWidth < 768 ? 1 : 2);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render carousel until cardsPerView is determined to avoid hydration mismatch
  if (!cardsPerView) {
    return (
      <div className="flex items-center flex-col gap-10 py-16">
        <div>
          <h1
            className={`${FONTS.microgrammaBold.className} text-4xl sm:text-5xl text-center`}
          >
            Featured in
          </h1>
        </div>
        <div className="w-full max-w-7xl h-[400px] flex items-center justify-center">
          {/* Placeholder to prevent layout shift */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col gap-10 py-16">
      <div>
        <h1
          className={`${FONTS.microgrammaBold.className} text-4xl sm:text-5xl text-center`}
        >
          Featured in
        </h1>
      </div>

      <div className="w-full max-w-7xl overflow-hidden relative px-4">
        <div
          className="flex transition-transform duration-1500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {Array.from({ length: Math.ceil(totalCards / cardsPerView) }).map(
            (_, slideIndex) => (
              <div
                key={slideIndex}
                className="w-full flex-shrink-0 flex gap-8 px-4"
              >
                {FEATURED_IN.slice(
                  slideIndex * cardsPerView,
                  (slideIndex + 1) * cardsPerView
                ).map((item, cardIndex) => (
                  <div
                    key={`${slideIndex}-${cardIndex}`}
                    className="flex-1 min-w-0 flex flex-col items-center justify-center gap-4"
                  >
                    <div className="w-full max-w-md h-[320px] rounded-xl bg-primary flex items-center justify-center mx-auto">
                      <Image
                        src={item.src}
                        width={item.src_meta.width}
                        height={item.src_meta.height}
                        alt={item.src_meta.alt}
                        priority
                        className="max-w-[200px] max-h-[200px] object-contain"
                      />
                    </div>
                    <p className="text-sm text-primary/80 text-left max-w-md mx-auto">
                      {item.description}
                    </p>
                  </div>
                ))}
                {/* Fill empty space if odd number of cards on last slide */}
                {slideIndex === Math.ceil(totalCards / cardsPerView) - 1 &&
                  FEATURED_IN.slice(
                    slideIndex * cardsPerView,
                    (slideIndex + 1) * cardsPerView
                  ).length === 1 && <div className="flex-1 min-w-0"></div>}
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant={"outline"}
          size={"icon"}
          className="rounded-full hover:bg-primary/10 transition-colors"
          onClick={scrollToPrev}
        >
          <ArrowLeft />
        </Button>
        <Button
          variant={"outline"}
          size={"icon"}
          className="rounded-full hover:bg-primary/10 transition-colors"
          onClick={scrollToNext}
        >
          <ArrowRight />
        </Button>
      </div>

      {/* Indicator dots */}
      <div className="flex gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-primary/30"
            }`}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedIn;
