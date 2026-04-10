import { IMAGES, IMAGES_META } from "@/assets/images";
import Image from "next/image";
import React from "react";

interface PrimaryLogoProps {
  variant?: "primary" | "white";
}

export default function PrimaryLogo({ variant = "primary" }: PrimaryLogoProps) {
  const logoSrc = variant === "white" ? IMAGES.WHITE_LOGO : IMAGES.LOGO;
  const logoMeta = variant === "white" ? IMAGES_META.WHITE_LOGO : IMAGES_META.LOGO;
  
  return (
    <Image
      width={logoMeta.width}
      height={logoMeta.height}
      src={logoSrc}
      alt={logoMeta.alt}
      priority
    />
  );
}
