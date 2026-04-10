"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SmoothRoundedButtonProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  asChild?: boolean;
}

export default function SmoothRoundedButton({
  children,
  className,
  variant = "outline",
  size = "lg",
  onClick,
  href,
  target,
  rel,
  "aria-label": ariaLabel,
  asChild,
  ...props
}: SmoothRoundedButtonProps) {
  const buttonContent = (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={{
        rest: {
          borderRadius: "1rem",
          transition: {
            duration: 0,
            ease: "easeInOut"
          }
        },
        hover: {
          borderRadius: "9999px",
          transition: {
            duration: 0.8,
            ease: "easeInOut"
          }
        }
      }}
      style={{
        borderRadius: "1rem"
      }}
      className="w-fit"
    >
      <Button
        size={size}
        variant={variant}
        className={cn("uppercase cursor-pointer text-xs", className)}
        style={{
          borderRadius: "inherit",
        }}
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );

  if (asChild && href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className="inline-block"
      >
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
}
