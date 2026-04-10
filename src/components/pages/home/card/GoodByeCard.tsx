"use client";

import { useEffect, useRef } from "react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import AnimatedButton from "@/components/shared/buttons/AnimatedButton";

const RIVE_SRC = "/animations/goodbye-card.riv";
const STATE_MACHINE_NAME = "talk to expert for page";

type GoodbyeCardRiveProps = {
  className?: string;
};

function GoodbyeCardRive({ className }: GoodbyeCardRiveProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { RiveComponent, rive } = useRive({
    src: RIVE_SRC,
    autoplay: false,
    stateMachines: [STATE_MACHINE_NAME],
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (!rive || !containerRef.current) {
      return;
    }

    const node = containerRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          rive.resizeDrawingSurfaceToCanvas();
          rive.play();
        } else {
          rive.pause();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
      rive.pause();
    };
  }, [rive]);

  const combinedClassName = [
    "flex items-center justify-center w-full h-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className={combinedClassName}>
      <RiveComponent className="w-full h-full" />
    </div>
  );
}

const GoodByeCard = () => {
  return (
    <div className="w-full flex items-center my-10 sm:my-20 justify-center px-4">
      <div className="bg-gradient overflow-hidden relative flex flex-col max-sm:-space-y-10 justify-between w-full sm:min-w-[1238px] rounded-xl min-h-[250px] sm:min-h-[300px] md:min-h-[361px]">
        <div className="flex px-4 sm:px-10 py-6 sm:py-6 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <h2 className="text-xl sm:text-2xl">
            Say Goodbye to Traditional Experiences
          </h2>

          <div className="max-sm:hidden">
            <AnimatedButton
              asChild
              size={"lg"}
              className="uppercase z-10 text-xs cursor-pointer"
              iconSize={16}
              href="https://calendly.com/obrive-inc/talk-to-ob-experts"
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk to Expert
            </AnimatedButton>
          </div>
        </div>
        <div className="flex flex-col gap-10 sm:flex-row justify-between">
          <div className="max-sm:hidden flex-1 px-4 sm:px-0 h-full w-full">
            <GoodbyeCardRive className="h-[360px] absolute top-10 -left-48 lg:h-[320px]" />
          </div>
          <div>
            <p className="text-left md:text-right text-xs w-full px-4 sm:px-10 py-6 max-w-full md:max-w-[500px] mt-2 md:mt-6 leading-6">
              Stop limiting your brand with flat, outdated interactions. With
              Obrive Industries, unlock the power of Augmented Reality, Virtual
              Reality, Mixed Reality, 3D Design, and Spatial Computing to
              automate engagement and create immersive experiences that truly
              matter. <br /> #FreeToImagine
            </p>
          </div>
          <div className="sm:hidden pl-4 -mt-6">
            <AnimatedButton
              asChild
              size={"lg"}
              className="uppercase text-xs cursor-pointer"
              iconSize={16}
              href="https://calendly.com/obrive-inc/talk-to-ob-experts"
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk to Expert
            </AnimatedButton>
          </div>
          <div className="sm:hidden w-full px-4 mt-4">
            <GoodbyeCardRive className="h-[280px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoodByeCard;
