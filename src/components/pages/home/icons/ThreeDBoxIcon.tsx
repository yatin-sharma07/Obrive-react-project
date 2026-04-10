import { ICONS, ICONS_META } from "@/assets/images";
import Image from "next/image";
import React from "react";

export default function ThreeDIcon() {
  return (
    <Image
      src={ICONS.THREE_D_BOX_ICON}
      width={ICONS_META.THREE_D_BOX_ICON.width}
      height={ICONS_META.THREE_D_BOX_ICON.height}
      alt={ICONS_META.THREE_D_BOX_ICON.alt}
    />
  );
}
