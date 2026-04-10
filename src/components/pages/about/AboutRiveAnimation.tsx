"use client";

import { useEffect } from "react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";

export function AboutRiveAnimation() {
  const { RiveComponent, rive } = useRive({
    src: "/animations/about_us_ob.riv",
    autoplay: true,
    stateMachines: ["about us"],
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.CenterRight,
    }),
  });

  useEffect(() => {
    if (rive) {
      rive.resizeDrawingSurfaceToCanvas();
    }
  }, [rive]);

  return (
    <div className="w-full h-full">
      <RiveComponent className="w-full h-full" />
    </div>
  );
}
