import React from "react";
import FONTS from "@/assets/fonts";

interface StyledTextProps {
  children: React.ReactNode;
  variant?: "microgrammaBold";
}

export const StyledText: React.FC<StyledTextProps> = ({
  children,
  variant = "microgrammaBold",
}) => {
  const fontClass = FONTS[variant].className;
  return <span className={fontClass}>{children}</span>;
};
