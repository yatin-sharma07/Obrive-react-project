"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

type AccordionItem = {
  id?: string;
  heading: React.ReactNode;
  content: React.ReactNode;
  wrapperClassName?: string;
};

type AutoAdvanceConfig = {
  fromIndex: number;
  toIndex: number;
  durationMs?: number;
  fillColorClassName?: string;
};

type AutoAdvanceMode = "hover" | "loop";

type HoverAccordionProps = {
  items: AccordionItem[];
  defaultOpen?: number;
  transitionMs?: number;
  intentDelayMs?: number;
  leaveDelayMs?: number;
  className?: string;
  autoAdvance?: AutoAdvanceConfig[];
  autoAdvanceMode?: AutoAdvanceMode;
};

export default function HoverAccordion({
  items,
  defaultOpen = 0,
  transitionMs = 500,
  intentDelayMs = 80,
  leaveDelayMs = 140,
  className = "",
  autoAdvance,
  autoAdvanceMode = "hover",
}: HoverAccordionProps) {
  const [active, setActive] = React.useState<number>(defaultOpen);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [progressingIdx, setProgressingIdx] = React.useState<number | null>(
    null
  );
  const contentRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = React.useState<number[]>([]);
  const hoverTimerRef = React.useRef<number | null>(null);
  const leaveTimerRef = React.useRef<number | null>(null);
  const autoAdvanceTimerRef = React.useRef<number | null>(null);

  React.useLayoutEffect(() => {
    const h = contentRefs.current.map((el) => (el ? el.scrollHeight : 0));
    setHeights(h);
  }, [items]);

  React.useEffect(() => {
    const onResize = () => {
      const h = contentRefs.current.map((el) => (el ? el.scrollHeight : 0));
      setHeights(h);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleMouseLeave = () => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (autoAdvanceMode === "loop") {
      setHoveredIndex(null);
      setProgressingIdx(null);
      return;
    }
    leaveTimerRef.current = window.setTimeout(() => {
      setActive(defaultOpen);
      setHoveredIndex(null);
      setProgressingIdx(null);
      leaveTimerRef.current = null;
    }, leaveDelayMs);
  };

  const scheduleActivate = (idx: number) => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
    }
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setProgressingIdx(null);
    hoverTimerRef.current = window.setTimeout(() => {
      setActive(idx);
      setHoveredIndex(idx);
    }, intentDelayMs);
  };

  React.useEffect(() => {
    if (!autoAdvance || autoAdvance.length === 0) {
      return () => undefined;
    }

    const config = autoAdvance.find((entry) => entry.fromIndex === active);
    if (!config) {
      setProgressingIdx(null);
      return () => undefined;
    }

    const isLoopMode = autoAdvanceMode === "loop";
    const shouldRun = isLoopMode
      ? hoveredIndex === null
      : hoveredIndex === active;

    if (!shouldRun) {
      setProgressingIdx(null);
      return () => undefined;
    }

    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
    }

    setProgressingIdx(null);
    let rafId: number | null = null;
    if (typeof window !== "undefined") {
      rafId = window.requestAnimationFrame(() => {
        setProgressingIdx(active);
      });
    } else {
      setProgressingIdx(active);
    }

    const duration = config.durationMs ?? transitionMs;
    autoAdvanceTimerRef.current = window.setTimeout(() => {
      setActive(config.toIndex);
      if (!isLoopMode) {
        setHoveredIndex(config.toIndex);
      } else {
        setHoveredIndex(null);
      }
      setProgressingIdx(null);
      autoAdvanceTimerRef.current = null;
    }, duration);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (autoAdvanceTimerRef.current !== null) {
        window.clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
    };
  }, [active, autoAdvance, autoAdvanceMode, hoveredIndex, transitionMs]);

  React.useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current !== null) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`flex flex-col gap-0 ${className}`}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => {
        if (leaveTimerRef.current !== null) {
          window.clearTimeout(leaveTimerRef.current);
          leaveTimerRef.current = null;
        }
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.id ?? i}
          data-active={active === i ? "true" : "false"}
          className={`${
            item.wrapperClassName ?? ""
          } relative group/item cursor-pointer overflow-hidden`}
          onMouseEnter={() => {
            if (leaveTimerRef.current !== null) {
              window.clearTimeout(leaveTimerRef.current);
              leaveTimerRef.current = null;
            }
            scheduleActivate(i);
          }}
        >
          {autoAdvance?.some((entry) => entry.fromIndex === i) && (
            <span
              className={`pointer-events-none absolute left-0 bottom-0 h-[0.5px] origin-left bg-primary block ${
                autoAdvance.find((entry) => entry.fromIndex === i)
                  ?.fillColorClassName ?? ""
              }`}
              style={{
                width: progressingIdx === i ? "100%" : "0%",
                transition:
                  progressingIdx === i
                    ? `width ${
                        autoAdvance.find((entry) => entry.fromIndex === i)
                          ?.durationMs ?? transitionMs
                      }ms linear`
                    : "none",
              }}
            />
          )}
          <div className="relative flex items-center">
            <ArrowRight
              aria-hidden
              strokeWidth={3}
              className="pointer-events-none absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-full text-primary opacity-0 transition-opacity duration-200 group-data-[active=true]/item:opacity-100"
            />
            <div>{React.Children.toArray(item.heading as React.ReactNode)}</div>
          </div>
          <div
            ref={(el) => {
              contentRefs.current[i] = el;
            }}
            style={{
              maxHeight: active === i ? heights[i] ?? 0 : 0,
              opacity: active === i ? 1 : 0,
              transition: `max-height ${transitionMs}ms ease-in-out, opacity ${transitionMs}ms ease-in-out`,
            }}
            className="overflow-hidden will-change-[max-height,opacity]"
          >
            <div className="mt-3">
              {React.Children.toArray(item.content as React.ReactNode)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
