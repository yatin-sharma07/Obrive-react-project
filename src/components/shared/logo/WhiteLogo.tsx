import { IMAGES, IMAGES_META } from "@/assets/images";
import Image from "next/image";
import React from "react";

export default function WhiteLogo() {
  return (
    <Image
      width={IMAGES_META.WHITE_LOGO.width}
      height={IMAGES_META.WHITE_LOGO.height}
      src={IMAGES.WHITE_LOGO}
      alt={IMAGES_META.WHITE_LOGO.alt}
    />
  );
}
