import { ICONS, ICONS_META } from "@/assets/images";
import Image from "next/image";

export default function RoundedBallIcon() {
  return (
    <Image
      src={ICONS.ROUNDED_BALLS}
      width={ICONS_META.ROUNDED_BALLS.width}
      height={ICONS_META.ROUNDED_BALLS.height}
      alt={ICONS_META.ROUNDED_BALLS.alt}
    />
  );
}
