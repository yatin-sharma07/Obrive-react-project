import { ICONS, ICONS_META } from "@/assets/images";
import Image from "next/image";
import React from "react";

export default function SpatialIcon() {
  return (
    <Image
      src={ICONS.SPATIAL_ICON}
      width={ICONS_META.SPATIAL_ICON.width}
      height={ICONS_META.SPATIAL_ICON.height}
      alt={ICONS_META.SPATIAL_ICON.alt}
    />
  );
}
