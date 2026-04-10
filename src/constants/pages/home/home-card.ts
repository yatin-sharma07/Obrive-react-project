import { HOME_IMAGES, HOME_IMAGES_META } from "@/assets/images";
import AkarIcon from "@/components/pages/home/icons/AkarIcon";
import SpatialIcon from "@/components/pages/home/icons/SpatialIcon";
import ThreeDIcon from "@/components/pages/home/icons/ThreeDBoxIcon";
import UserIcon from "@/components/pages/home/icons/UserIcon";
import VRIcon from "@/components/pages/home/icons/VRIcon";
import type React from "react";
import type { StaticImageData } from "next/image";

export const HOME_CARD = [
  {
    title: "Bring products to life with AR Visualization",
    description: `Talking your way into a client's buy-in is tough. Let your product speak for itself with AR visualization— show lifelike 3D models in their real-world space.
`,
    icon: AkarIcon,
    use: "Use Case .01",
    url: "/solutions/augmented-reality-development",
  },
  {
    title: "Upskill your crew with VR training simulations",
    description: `Learning from manuals is slow and risky. Immerse employees in lifelike VR environments—practice safety protocols, navigate industrial scenarios, or complete onboarding simulations safely and effectively.`,
    icon: VRIcon,
    use: "Use Case .02",
    url: "/solutions/virtual-reality-development",
  },
  {
    title: "Innovate without borders in mixed reality ",
    description: `Design reviews get messy when everyone’s scattered across locations. Collaborate on holographic 3D models in a shared MR space, manipulate virtual designs, and let ideas and feedback flow in real time.`,
    icon: UserIcon,
    use: "Use Case .03",
    url: "/coming-soon/mixed-reality",
  },
  {
    title: "3D Architectural Visualization",
    description: `Experience: Walk through photorealistic 3D renderings of architectural spaces—homes, offices, retail layouts—using handheld devices or headsets before they're built.`,
    icon: ThreeDIcon,
    use: "Use Case .04",
    url: "/solutions/3d-design-development",
  },
  {
    title: "Spatial Computing for Location-Based Experiences",
    description: `Create immersive, location-aware experiences—like museum tours, retail activations, or educational overlays—triggered by user presence and context.`,
    icon: SpatialIcon,
    use: "Use Case .05",
    url: "/solutions/spatial-computing-app-development",
  },
] as const;

export const HOME_CARD_BLOG = [
  {
    imageSrc: HOME_IMAGES.AR_VR_IMAGE,
    imgWidth: HOME_IMAGES_META.AR_VR_IMAGE.width,
    imgHeight: HOME_IMAGES_META.AR_VR_IMAGE.height,
    imgAlt: HOME_IMAGES_META.AR_VR_IMAGE.alt,
    title: `Augmented Reality vs. Virtual Reality vs. Mixed Reality: Key Differences.`,
    date: "30.07.25",
    slug: "ar-vr-mr-differences-business-use-cases-2025",
    description:
      "Learn the key differences between AR, VR, and MR and how to choose the right one for your business.",
  },
  {
    imageSrc: HOME_IMAGES.VR_TECH_IMAGE,
    imgWidth: HOME_IMAGES_META.VR_TECH_IMAGE.width,
    imgHeight: HOME_IMAGES_META.VR_TECH_IMAGE.height,
    imgAlt: HOME_IMAGES_META.VR_TECH_IMAGE.alt,
    title: `How Spatial Computing is Redefining Business Operation.`,
    date: "30.07.25",
    slug: "spatial-computing-business-operations-2025",
    description:
      "Discover how spatial computing is transforming industries and creating new opportunities for growth.",
  },
  {
    imageSrc: HOME_IMAGES.PARKING_IMAGE,
    imgWidth: HOME_IMAGES_META.PARKING_IMAGE.width,
    imgHeight: HOME_IMAGES_META.PARKING_IMAGE.height,
    imgAlt: HOME_IMAGES_META.PARKING_IMAGE.alt,
    title: `How AR-Powered Car Parking Systems are Solving Urban Mobility.`,
    date: "30.07.25",
    slug: "ar-powered-car-parking-systems-urban-mobility-challenges",
    description:
      "Explore how augmented reality is revolutionizing urban mobility with smart parking solutions.",
  },
];

export type HomeCard = {
  title: string;
  description: string;
  icon: React.ComponentType;
  use: string;
  url: string;
};

export type HomeCardBlog = {
  imageSrc: string | StaticImageData;
  imgWidth: number;
  imgHeight: number;
  imgAlt: string;
  title: string;
  date: string;
  slug: string;
  description: string;
};
