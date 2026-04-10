"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { FadeInOnView } from "../motion/GsapMotion";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const VideoCardObrive = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isPointerActive, setIsPointerActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recenterButton = useCallback(() => {
    const container = containerRef.current;
    const btn = buttonRef.current;
    if (!container || !btn) return;
    const rect = container.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    posRef.current = { x, y };
    targetRef.current = { x, y };
    btn.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }, []);

  const tick = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const { x: cx, y: cy } = posRef.current;
    const { x: tx, y: ty } = targetRef.current;
    const lerp = 0.05; // Reduced lerp value for smoother, more gradual following (higher inertia)
    const nx = cx + (tx - cx) * lerp;
    const ny = cy + (ty - cy) * lerp;
    posRef.current = { x: nx, y: ny };
    btn.style.transform = `translate3d(${nx}px, ${ny}px, 0) translate(-50%, -50%)`;

    const dist = Math.hypot(tx - nx, ty - ny);
    if (isPointerActive || dist > 0.5) {
      rafIdRef.current = window.requestAnimationFrame(tick);
    } else {
      rafIdRef.current = null;
    }
  }, [isPointerActive]);

  const startRAF = useCallback(() => {
    if (rafIdRef.current == null) {
      rafIdRef.current = window.requestAnimationFrame(tick);
    }
  }, [tick]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      targetRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      startRAF();
    },
    [startRAF]
  );

  const handlePointerEnter = useCallback(() => {
    setIsPointerActive(true);
    startRAF();
  }, [startRAF]);

  const handlePointerLeave = useCallback(() => {
    setIsPointerActive(false);
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    targetRef.current = { x: rect.width / 2, y: rect.height / 2 };
    startRAF();
  }, [startRAF]);

  const handlePlayClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    recenterButton();
  }, [recenterButton]);

  useEffect(() => {
    const handleResize = () => {
      recenterButton();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown);
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [recenterButton, isModalOpen, handleCloseModal]);

  return (
    <div className="w-full max-sm:h-screen">
      <div
        ref={containerRef}
        className="relative overflow-hidden max-sm:justify-center max-sm:h-screen h-[994px] max-md:h-auto flex items-center flex-col justify-between max-md:justify-start max-md:py-10"
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <video
            className="h-full w-full object-cover brightness-[0.4]"
            src="/videos/ar-vr-background.webm"
            poster="/images/ar-vr-background-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              willChange: "transform",
            }}
          />
        </div>

        <FadeInOnView>
          <div className="relative z-10 rounded-2xl flex items-center justify-center mt-20 max-md:mt-10">
            <p className="text-center w-[660px] max-sm:text-sm max-md:w-full max-md:px-4 tracking-wide text-white text-xl max-md:text-base">
              Obrive Industries is a pioneer in Augmented Reality, Virtual
              Reality, and Mixed Reality solutions. We empower businesses and
              individuals to seamlessly connect digital and physical worlds.
            </p>
          </div>
        </FadeInOnView>

        <Button
          ref={buttonRef}
          type="button"
          className={cn(
            "pointer-events-auto absolute top-0 left-0 hidden md:inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-opacity duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 z-10",
            isPointerActive ? "opacity-100" : "opacity-0"
          )}
          style={{ willChange: "transform" }}
          onClick={handlePlayClick}
          aria-label="Play immersive experience video"
        >
          <Play className="h-4 w-4" />
          Play Video
        </Button>
        <Button className="sm:hidden max-sm:flex mt-4" size={"lg"} type="button" onClick={handlePlayClick}>
          <Play className="h-4 w-4" />
          Watch Video
        </Button>
      </div>

      {/* Video Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-300"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-4xl mx-4 bg-black rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close video"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/eyvBhcDCBlI?si=fNAHC3U2lS-_1RKT&autoplay=1&rel=0"
                title="Obrive Immersive Experience"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCardObrive;
