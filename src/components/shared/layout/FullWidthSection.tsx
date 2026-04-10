import React from "react";
import { cn } from "@/lib/utils";

type FullWidthSectionProps = {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: "accent" | "primary" | "white" | "none";
  clipOverflow?: boolean;
};

export default function FullWidthSection({
  children,
  className,
  backgroundColor = "none",
  clipOverflow = true,
}: FullWidthSectionProps) {
  const bgColorMap = {
    accent: "bg-gradient",
    primary: "bg-primary",
    white: "bg-white",
    none: "",
  };

  return (
    <div
      className={cn(
        "w-full relative -mb-[1px]",
        clipOverflow ? "overflow-x-clip" : "overflow-visible",
        bgColorMap[backgroundColor]
      )}
    >
      <div className={cn("w-full", className)}>
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
          {children}
        </div>
      </div>
    </div>
  );
}
