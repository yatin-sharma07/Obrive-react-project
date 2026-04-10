"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface AnimatedNavLabelProps {
  children: ReactNode;
  iconSize?: number;
  icon?: ReactNode;
  shiftDirection?: "left" | "right";
  color?: "white" | "black";
  gap?: number;
}

export default function AnimatedNavLabel({
  children,
  iconSize = 12,
  icon,
  shiftDirection = "right",
  color = "white",
  gap = 10,
}: AnimatedNavLabelProps) {
  const shiftAmount = iconSize + gap;

  return (
    <motion.span
      className="relative inline-flex items-center"
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      {/* left icon slides */}
      <motion.span
        className="absolute left-0 flex items-center justify-center"
        style={{
          width: shiftAmount,
          height: iconSize + 4,
          overflow: "hidden",
          top: "50%",
          translateY: "-50%",
          pointerEvents: "none",
        }}
        variants={{
          rest: { x: -shiftAmount, opacity: 0 },
          hover: { x: 0, opacity: 1 },
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        aria-hidden="true"
      >
        {icon ?? <ArrowRight strokeWidth={3} size={iconSize} color={color} />}
      </motion.span>

      {/* text shifting when icon appears */}
      <motion.span
        className="relative"
        variants={{
          rest: { x: 0 },
          hover: {
            x: shiftDirection === "left" ? -shiftAmount : shiftAmount + 4,
          },
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
