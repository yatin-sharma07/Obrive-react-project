import { ICONS, ICONS_META } from "@/assets/images";
import Image from "next/image";
import React from "react";

export default function AkarIcon() {
  return (
    <Image
      src={ICONS.AKAR_ICON}
      width={ICONS_META.AKAR_ICON.width}
      height={ICONS_META.AKAR_ICON.height}
      alt={ICONS_META.AKAR_ICON.alt}
    />
  );
}
