"use client";

import { useEffect, useRef } from "react";
import AnimatedButton from "../buttons/AnimatedButton";
import FONTS from "@/assets/fonts";
import Link from "next/link";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";

type PrimaryFooterCardVariant = "default" | "small";

const FOOTER_RIVE_SRC = "/animations/footer-card.riv";
const FOOTER_STATE_MACHINE = "talk to expert for footer";

type FooterCardRiveProps = {
  className?: string;
};

function FooterCardRive({ className }: FooterCardRiveProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { RiveComponent, rive } = useRive({
    src: FOOTER_RIVE_SRC,
    autoplay: false,
    stateMachines: [FOOTER_STATE_MACHINE],
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
      { threshold: 0.2 },
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

export default function PrimaryFooterCard({
  title,
  description,
  variant = "default",
}: {
  title: string;
  description: string;
  variant?: PrimaryFooterCardVariant;
}) {
  const titleClasses =
    variant === "small"
      ? "text-xl sm:text-2xl"
      : `${FONTS.microgrammaBold.className} sm:w-2xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight sm:leading-14`;

  return (
    <section className="w-full flex items-center my-20 justify-center">
      <div className="bg-primary overflow-hidden relative text-white flex flex-col max-sm:-space-y-10 sm:gap-10 justify-between w-full max-w-[90%] sm:max-w-[95%] lg:max-w-[1238px] rounded-xl min-h-[300px] sm:min-h-[361px]">
        <div className="flex px-4 sm:px-10 py-6 sm:py-6 flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-0">
          <h2
            className={`${titleClasses} w-full text-center sm:text-left max-sm:text-left`}
          >
            {title}
          </h2>

          <div className="max-sm:hidden">
            <Link href="https://calendly.com/obrive-inc/talk-to-ob-experts">
            <AnimatedButton
              size={"lg"}
              className="uppercase bg-accent text-primary hover:bg-accent/90! text-[10px] w-full sm:w-auto max-sm:hidden"
              iconSize={16}
              arrowColor="primary"
              href="https://calendly.com/obrive-inc/talk-to-ob-experts"
            >
              Talk to Expert
            </AnimatedButton>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-10 sm:flex-row justify-between max-sm:justify-center">
          {/* animation */}
          <div className="max-sm:hidden flex-1 px-4 sm:px-0 h-full w-full relative">
            <FooterCardRive className="h-[360px] absolute -top-20 left-0 lg:h-[320px]" />
          </div>
          <div className="px-4 py-6 sm:px-10">
            <p className="text-center sm:text-right max-sm:text-left text-xs w-full sm:w-[300px] md:w-[350px] lg:w-[500px] mt-2 sm:mt-6 leading-5 sm:leading-6">
              {description}
            </p>
          </div>

          <div className="sm:hidden w-[200px] pl-4 max-sm:-mt-10">
            <Link href="https://calendly.com/obrive-inc/talk-to-ob-experts"> 
              <AnimatedButton
                size={"lg"}
                className="uppercase bg-accent text-primary hover:bg-accent/90 text-[10px] w-full sm:w-auto max-sm:hidden"
                iconSize={16}
                arrowColor="primary"
                href="https://calendly.com/obrive-inc/talk-to-ob-experts"
              >
                Talk to Expert
              </AnimatedButton>
            </Link>
            
          </div>

          <div className="pointer-events-none sm:hidden w-full px-4 mt-4">
            <FooterCardRive className="h-[220px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
