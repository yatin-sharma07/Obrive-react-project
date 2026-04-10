import { HOME_IMAGES, HOME_IMAGES_META } from "@/assets/images";
import { StaticImageData } from "next/image";

export const PopularCardContent = [
  {
    src: HOME_IMAGES.AR_VR_IMAGE,
    alt: HOME_IMAGES_META.AR_VR_IMAGE.alt,
    date: "16.08.25",
    title: "How Spatial Computing is Redefining Business Operations.",
    description:
      "Unlocking Precision in Retirement Plan Reporting with Innovative Tech Solutions.",
    author: "Jonnah Razel",
    slug: "spatial-computing-business-operations-2025",
  },
  {
    src: HOME_IMAGES.VR_TECH_IMAGE,
    alt: HOME_IMAGES_META.VR_TECH_IMAGE.alt,
    date: "16.08.25",
    title: "Augmented Reality vs. Virtual Reality vs. Mixed Reality.",
    description:
      "At eu commodo turpis varius ut. Tristique risus tellus scelerisque ut et nulla etiam lectus ",
    author: "Jonnah Razel",
    slug: "ar-vr-mr-differences-business-use-cases-2025",
  },
] as const;

export type PopularCardContentType = {
  src: StaticImageData;
  alt: string;
  date: string;
  title: string;
  description: string;
  author: string;
  slug: string;
};
