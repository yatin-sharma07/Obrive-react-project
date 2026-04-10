"use client";

import { useEffect } from "react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import { cn } from "@/lib/utils";

type RiveProductAnimationProps = {
  className?: string;
  aspectClassName?: string;
};

export function RiveProductAnimation({
  className,
  aspectClassName,
}: RiveProductAnimationProps) {
  const { RiveComponent, rive } = useRive({
    src: "/animations/product_page.riv",
    autoplay: true,
    stateMachines: ["product page scroll"],
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (rive) {
      rive.resizeDrawingSurfaceToCanvas();
    }
  }, [rive]);

  const containerClasses = cn(
    "relative w-full",
    aspectClassName ?? "aspect-[16/10]",
    className
  );

  return (
    <div className={containerClasses}>
      <RiveComponent className="absolute inset-0 w-full h-full" />
    </div>
  );
}
