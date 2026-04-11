"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { JOIN_TEAM_CARD } from "@/constants/pages/career/join-team-card";
import JoinTeamCards from "./card/JoinTeamCards";

export default function JoinTeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = JOIN_TEAM_CARD.length;

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
    }, 4000);

    return () => clearInterval(autoScroll);
  }, [scrollToNext]);

  return (
    <div className="flex gap-8 max-sm:px-4 flex-col items-center justify-center py-16">
      <div className="w-full max-w-[1238px] overflow-hidden relative">
        <div
          className="flex transition-transform duration-1500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {JOIN_TEAM_CARD.map((card, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="mx-auto">
                <JoinTeamCards {...card} />
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
        {JOIN_TEAM_CARD.map((_, index) => (
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
