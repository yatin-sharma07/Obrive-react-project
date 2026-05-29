"use client";

import React, { useMemo } from "react";

type Props = {
  count?: number;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function FallingProfileLeaves({ count = 12 }: Props) {
  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = rand(3, 97); // percent
      const size = Math.floor(rand(36, 64));
      const duration = Number(rand(8, 18).toFixed(2));
      const delay = Number(rand(0, 8).toFixed(2));
      const rotate = Math.floor(rand(180, 720));
      const sway = Number(rand(3, 8).toFixed(2));

      // Use ui-avatars to generate simple circular avatars
      const url = `https://ui-avatars.com/api/?name=User+${i + 1}&background=076d47&color=ffffff&size=128`;

      return { left, size, duration, delay, rotate, sway, url, key: `leaf-${i}` };
    });
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(540deg); opacity: 0.92; }
        }
        @keyframes sway {
          0% { transform: translateX(0); }
          50% { transform: translateX(18px); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {items.map((it) => (
        <div
          key={it.key}
          style={{
            position: "absolute",
            left: `${it.left}%`,
            top: `-8vh`,
            width: `${it.size}px`,
            height: `${it.size}px`,
            borderRadius: "9999px",
            backgroundImage: `url(${it.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 8px 20px rgba(2,6,23,0.12)",
            transformOrigin: "center",
            animation: `fall ${it.duration}s linear ${it.delay}s infinite, sway ${it.sway}s ease-in-out ${it.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
