import { ICONS, ICONS_META } from "@/assets/images";
import Image from "next/image";
import React from "react";

export default function VRIcon() {
  return (
    <Image
      src={ICONS.VR_ICON}
      width={ICONS_META.VR_ICON.width}
      height={ICONS_META.VR_ICON.height}
      alt={ICONS_META.VR_ICON.alt}
    />
  );
}
