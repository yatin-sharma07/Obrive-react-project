import type { StaticImageData } from "next/image";
import { ABOUT_FEATURE, ABOUT_FEATURE_META } from "@/assets/images";

export type FeaturedItem = {
  src: StaticImageData;
  src_meta: {
    alt: string;
    width: number;
    height: number;
  };
  description: string;
};

export const FEATURED_IN: FeaturedItem[] = [
  {
    src: ABOUT_FEATURE.AUGMENTED_REALITY,
    src_meta: ABOUT_FEATURE_META.AUGMENTED_REALITY,
    description:
      "Obrive is proud to be featured by Best AR among the Top 50+ AR Company worldwide.  ",
  },
  {
    src: ABOUT_FEATURE.VIRTUAL_REALITY,
    src_meta: ABOUT_FEATURE_META.VIRTUAL_REALITY,
    description:
      "Obrive is proud to be featured by IVRHA among the VR in healthcare. company worldwide. ",
  },
  {
    src: ABOUT_FEATURE.UNITY,
    src_meta: ABOUT_FEATURE_META.UNITY,
    description:
      "Obrive is proud to be featured by Unity Certified among the Top 50+ AR/VR Developers worldwide.  ",
  },
  {
    src: ABOUT_FEATURE.TOP_DEVELOPERS,
    src_meta: ABOUT_FEATURE_META.TOP_DEVELOPERS,
    description:
      "Obrive is proud to be featured by Finest 500 App among the Top 50+ Virtual Reality Company worldwide.",
  },
  {
    src: ABOUT_FEATURE.TOP_AR_VR,
    src_meta: ABOUT_FEATURE_META.TOP_AR_VR,
    description:
      "Obrive is proud to be featured by Top AR/VR Company among the Top 50+ Virtual Reality Company worldwide.  ",
  },
  {
    src: ABOUT_FEATURE.PRODUCT_HUNT,
    src_meta: ABOUT_FEATURE_META.PRODUCT_HUNT,
    description:
      "Obrive products are features in the top technology development products worldwide in ProductHunt.com  ",
  },
  {
    src: ABOUT_FEATURE.MOBILE_APP_DAILY,
    src_meta: ABOUT_FEATURE_META.MOBILE_APP_DAILY,
    description:
      "Obrive is proud to be featured by Mobile App Daily among the Top App development Company worldwide.  ",
  },
  {
    src: ABOUT_FEATURE.GOOD_FIRM,
    src_meta: ABOUT_FEATURE_META.GOOD_FIRM,
    description:
      "Obrive is proud to be featured by Good firms among the Top Tech Development company worldwide. ",
  },
  {
    src: ABOUT_FEATURE.GLOBAL_OUT,
    src_meta: ABOUT_FEATURE_META.GLOBAL_OUT,
    description:
      "Obrive is proud to be featured by IAOP among the Top 50+ AR/VR Company worldwide.  ",
  },
  {
    src: ABOUT_FEATURE.BEHEMOTHS,
    src_meta: ABOUT_FEATURE_META.BEHEMOTHS,
    description:
      "Obrive is proud to be featured by TechBehemoths among the Top AR/VR Developer company worldwide. ",
  },
  {
    src: ABOUT_FEATURE.STARTUP_INDIA,
    src_meta: ABOUT_FEATURE_META.STARTUP_INDIA,
    description:
      "Obrive is proud to be featured as Start-up India Certified Company in India to the world.",
  },
  {
    src: ABOUT_FEATURE.CLUTCH_IMG,
    src_meta: ABOUT_FEATURE_META.CLUTCH_IMG,
    description:
      "Obrive is proud to be featured by Clutch among the Top augmented reality company worldwide.",
  },
];
