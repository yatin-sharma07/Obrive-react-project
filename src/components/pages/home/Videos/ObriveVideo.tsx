"use client";

import { HOME_VIDEOS } from "@/assets/videos";
import { HOME_IMAGES, HOME_IMAGES_META } from "@/assets/images";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ObriveVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  const attemptVideoPlay = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    try {
      await video.play();
    } catch (error) {
      console.error("Video autoplay failed:", error);
    }
  };

  useEffect(() => {
    // load video only when in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            // load video
            if (videoRef.current) {
              videoRef.current.src = HOME_VIDEOS.OBRIVE_INTRO.srcWebM;
              videoRef.current.load();
            }
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "100px", // start loading video beforew entring 100px viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoadedData = () => {
    setIsLoaded(true);
    if (videoRef.current) {
      videoRef.current.muted = true; // mute video to allow autoplay in browsers that block unmuted autoplay
    }
    void attemptVideoPlay();
  };

  const handleCanPlay = () => {
    // video is ready to play
    if (videoRef.current && shouldLoad) {
      videoRef.current.muted = true; // ensure video is muted to allow autoplay
      void attemptVideoPlay();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-[54px] overflow-hidden"
    >
      {/* placeholder image shows until video plays */}
      {!isLoaded && (
        <Image
          src={HOME_IMAGES.HOME_OBRIVE_INTRO}
          width={HOME_IMAGES_META.HOME_OBRIVE_INTRO.width}
          height={HOME_IMAGES_META.HOME_OBRIVE_INTRO.height}
          alt={HOME_IMAGES_META.HOME_OBRIVE_INTRO.alt}
          className="w-full h-auto"
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      )}

      {/* video element - only loads when in viewport */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls
        controlsList="nodownload"
        src={shouldLoad ? HOME_VIDEOS.OBRIVE_INTRO.srcWebM : undefined}
        width={HOME_VIDEOS.OBRIVE_INTRO.width}
        height={HOME_VIDEOS.OBRIVE_INTRO.height}
        className={`w-full h-auto transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
        }`}
        onLoadedData={handleLoadedData}
        onCanPlay={handleCanPlay}
        onError={(e) => {
          // Video load failed - keep placeholder visible
          // Could implement fallback to alternative format or notify user
          console.error("Video failed to load:", e);
        }}
        aria-label="Obrive Industries introduction video showcasing AR/VR solutions"
      >
        {/* Captions track for accessibility - video is decorative and muted by default */}
        <track kind="captions" srcLang="en" label="English" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
