import {
  JOIN_TEAM_LIBRARY_CARD_IMAGE,
  JOIN_TEAM_LIBRARY_CARD_META,
} from "@/assets/images";
import { StaticImageData } from "next/image";

export const JOIN_TEAM_LIBRARY_CARD = [
  {
    src: JOIN_TEAM_LIBRARY_CARD_IMAGE.ARVR_VIRTUAL,
    srcMeta: JOIN_TEAM_LIBRARY_CARD_META.ARVR_VIRTUAL,
    title: "Vivo’s MR Headset and the Next Chapter in Mixed Reality.",
    date: "15/08/2025",
  },
  {
    src: JOIN_TEAM_LIBRARY_CARD_IMAGE.VIRTUAL_REALITY_LIBRARY,
    srcMeta: JOIN_TEAM_LIBRARY_CARD_META.VIRTUAL_REALITY_LIBRARY,
    title:
      "Surgical Precision via Mixed Reality: Transforming Healthcare in Bengaluru.",
    date: "02/08/2025",
  },
  {
    src: JOIN_TEAM_LIBRARY_CARD_IMAGE.ZUCK_VIRTUAL,
    srcMeta: JOIN_TEAM_LIBRARY_CARD_META.ZUCK_VIRTUAL,
    title:
      "Smart Glasses Take Center Stage: Meta’s Wearables Outpace VR Headsets.",
    date: "25/07/2025",
  },
] as const;

export type JOIN_TEAM_LIBRARY_CARD_TYPE = {
  src: StaticImageData;
  srcMeta: {
    alt: string;
    width: number;
    height: number;
  };
  title: string;
  date: string;
};
