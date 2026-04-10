"use client";

import { useEffect } from "react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";

import { cn } from "@/lib/utils";

type HomepageRiveAnimationProps = {
  className?: string;
  canvasClassName?: string;
};
function HomepageRiveAnimationComponent({
  className,
  canvasClassName,
}: HomepageRiveAnimationProps) {
  const { RiveComponent, rive } = useRive({
    src: "/animations/homepage.riv",
    autoplay: true,
    stateMachines: ["homepage"],
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

  return (
    <div className={cn("relative max-sm:scale-[2] w-full h-full overflow-hidden", className)}>
      <RiveComponent
        className={cn("h-full w-full", canvasClassName)}
      />
    </div>
  );
}

const HomepageRiveAnimation = HomepageRiveAnimationComponent;

export { HomepageRiveAnimation };

export default HomepageRiveAnimationComponent;
