"use client";

import { useEffect, useRef } from "react";
import { ICONS_META } from "@/assets/images";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";

const OB_RIVE_SRC = "/animations/OB.riv";
const OB_STATE_MACHINE = "OB";

type ObIconProps = {
  className?: string;
};

export default function ObIcon({ className }: ObIconProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { RiveComponent, rive } = useRive({
    src: OB_RIVE_SRC,
    autoplay: false,
    stateMachines: [OB_STATE_MACHINE],
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
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
      rive.pause();
    };
  }, [rive]);

  const combinedClassName = ["flex items-center justify-center", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={combinedClassName}
      style={{
        width: ICONS_META.OBICON_GIF.width,
        height: ICONS_META.OBICON_GIF.height,
      }}
    >
      <RiveComponent className="w-full h-full" />
    </div>
  );
}
