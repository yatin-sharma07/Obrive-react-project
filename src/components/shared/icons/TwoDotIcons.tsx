import { ICONS, ICONS_META } from "@/assets/images";
import Image from "next/image";

export default function TwoDotIcons() {
  return (
    <Image
      src={ICONS.TWO_DOTS_ICON}
      width={ICONS_META.TWO_DOTS_ICON.width}
      height={ICONS_META.TWO_DOTS_ICON.height}
      alt={ICONS_META.TWO_DOTS_ICON.alt}
    />
  );
}
