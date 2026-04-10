"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FONTS from "@/assets/fonts";
import { BACKGROUND_IMAGE, BACKGROUND_IMAGE_META } from "@/assets/images";
import Image from "next/image";
import { objectiveCardsData } from "@/constants/pages/about/object-frame";

export default function ObjectiveCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = objectiveCardsData.length;

  const scrollToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const scrollToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalCards - 1 : prev - 1));
  }, [totalCards]);

  const scrollToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // auto scrolling
  useEffect(() => {
    const autoScroll = setInterval(() => {
      scrollToNext();
    }, 5000);

    return () => clearInterval(autoScroll);
  }, [scrollToNext]);

  return (
    <div className="bg-gradient flex gap-8 flex-col items-center max-sm:px-4 justify-center py-16">
      <div className="w-full max-w-[1238px] overflow-hidden relative">
        <div
          className="flex transition-transform duration-1500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {objectiveCardsData.map((card) => (
            <div key={card.id} className="w-full flex-shrink-0">
              <div className="w-[1238px] max-md:w-full border bg-none border-zinc-800 rounded-2xl flex max-md:flex-col overflow-hidden mx-auto">
                <div className="p-8 max-md:p-4 flex flex-col gap-4 w-3xl max-md:w-full">
                  <Image
                    src={card.icon}
                    alt={card.iconMeta.alt}
                    width={card.iconMeta.width}
                    height={card.iconMeta.height}
                  />
                  <div className="px-4">
                    <p className="text-left text-base max-md:text-sm text-primary/80">
                      {card.content}
                    </p>
                    <h3
                      className={`${FONTS.microgrammaBold.className} text-primary mt-4 text-left text-lg`}
                    >
                      - {card.title}
                    </h3>
                  </div>
                </div>

                <div className="relative top-4 pointer-events-none max-md:hidden">
                  <Image
                    src={BACKGROUND_IMAGE.CARD_STACK}
                    alt={BACKGROUND_IMAGE_META.CARD_STACK.alt}
                    width={BACKGROUND_IMAGE_META.CARD_STACK.width}
                    height={BACKGROUND_IMAGE_META.CARD_STACK.height}
                  />
                </div>
              </div>
            </div>
          ))}
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

      {/* indicator dots */}
      <div className="flex gap-2">
        {objectiveCardsData.map((_, index) => (
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
}
