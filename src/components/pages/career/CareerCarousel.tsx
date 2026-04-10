"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CAREER_CARD } from "@/constants/pages/career/career-card";
import CareerCard from "./card/CareerCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
export default function CareerCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Autoplay plugin
  const plugin = useMemo(
    () =>
      Autoplay({
        delay: 2000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  // Setup carousel API
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="flex items-center flex-col gap-10 w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin]}
        className="w-full max-w-7xl"
        setApi={setApi}
      >
        <CarouselContent className="-ml-4">
          {CAREER_CARD.map((item, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/3 basis-full">
              <CareerCard {...item} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex gap-4">
        <Button
          variant={"outline"}
          size={"icon"}
          className="rounded-full hover:bg-primary/10 transition-colors"
          onClick={() => api?.scrollPrev()}
        >
          <ArrowLeft />
        </Button>
        <Button
          variant={"outline"}
          size={"icon"}
          className="rounded-full hover:bg-primary/10 transition-colors"
          onClick={() => api?.scrollNext()}
        >
          <ArrowRight />
        </Button>
      </div>

      {/* indicator dots */}
      <div className="flex gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === current ? "bg-primary" : "bg-primary/30"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
