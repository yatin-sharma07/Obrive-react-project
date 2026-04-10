import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Link from "next/link";
import RightAnimateIcon from "../icons/RightAnimateIcon";

interface AnimatedButtonProps {
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
  asChild?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  showArrow?: boolean;
  iconSize?: number;
  arrowColor?: "default" | "primary";
}

export default function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  asChild,
  onClick,
  href,
  target,
  rel,
  "aria-label": ariaLabel,
  showArrow = true,
  iconSize = 14,
  arrowColor = "default",
  ...props
}: AnimatedButtonProps) {
  const buttonContent = (
    <span className="relative inline-flex items-center">
      {/* left icon */}
      {showArrow && (
        <span
          className="btn__icon --1 absolute left-0 top-1/2 flex items-center"
          style={{
            width: iconSize,
            height: iconSize,
          }}
        >
          <RightAnimateIcon aria-hidden="true" color={arrowColor} />
        </span>
      )}

      {/* text */}
      <span className="btn__label">
        {children}
      </span>

      {/* right icon */}
      {showArrow && (
        <span
          className="btn__icon --2 relative left-1 flex items-center"
          style={{
            width: iconSize,
            height: iconSize,
            marginLeft: 8,
          }}
        >
          <RightAnimateIcon aria-hidden="true" color={arrowColor} />
        </span>
      )}
    </span>
  );

  if (asChild && href) {
    return (
      <Button
        asChild
        className={cn("btn relative overflow-hidden inline-flex", className)}
        variant={variant}
        size={size}
        {...props}
      >
        <Link
          href={href}
          target={target}
          rel={rel}
          aria-label={ariaLabel}
          className="inline-flex items-center"
        >
          {buttonContent}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      className={cn("btn relative overflow-hidden inline-flex", className)}
      variant={variant}
      size={size}
      onClick={onClick}
      {...props}
    >
      {buttonContent}
    </Button>
  );
}
