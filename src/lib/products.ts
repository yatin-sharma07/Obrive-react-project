import { StaticImageData } from "next/image";
import {
  IMAGES,
  OBMOVE_IMAGES,
  OBPARK_IMAGES,
  OBNAVI_IMAGES,
  OBNEST_IMAGES,
} from "@/assets/images";
import {
  OBPARK_BUSINESS_BENEFIT,
  OBPARK_WHY,
  PARKING_WITH_OBPARK,
  OBPARK_OTHER_BENEFITS,
} from "@/constants/pages/products/obpark/business-benefit";
import {
  OBMOVE_WHAT_MAKES_DIFFERENT,
  OBNAVI_WHAT_MAKES_DIFFERENT,
  OBNEST_WHAT_MAKES_DIFFERENT,
  OBPARK_WHAT_MAKES_DIFFERENT,
} from "@/constants/pages/products/obpark/makes-difference";
import {
  WHY_SECTION_OBMOVE,
  WHY_SECTION_OBNAVI,
  WHY_SECTION_OBNEST,
  WHY_SECTION_OBPARK,
} from "@/constants/pages/why-section";
import {
  OBMOVE_HOW_IT_WORK,
  OBNAVI_HOW_IT_WORK,
  OBNEST_HOW_IT_WORK,
  OBPARK_HOW_IT_WORK,
} from "@/constants/pages/products/how-it-work";
import {
  OBMOVE_QUOTES,
  OBNAVI_QUOTES,
  OBNEST_QUOTES,
  OBPARK_QUOTES,
} from "@/constants/pages/products/quotes";
import {
  OBMOVE_KEY_BENEFITS,
  OBNAVI_KEY_BENEFITS,
  OBNEST_KEY_BENEFITS,
  OBPARK_KEY_BENEFITS,
} from "@/constants/pages/key-benefits";
import {
  OBNEST_BUSINESS_BENEFIT,
  OBNEST_OTHER_BENEFITS,
  OBNEST_WHY,
  PARKING_WITH_OBNEST,
} from "@/constants/pages/products/obnest/business-benefit";
import {
  OBNAVI_FOR_BUSINESS,
  OBNAVI_FOR_CONSUMERS,
  OBNAVI_OTHER_BENEFITS,
  OBNAVI_WHY,
} from "@/constants/pages/products/obnavi/business-benefits";
import {
  OBMOVE_BUSINESS_BENEFIT,
  OBMOVE_FOR_CONSUMERS,
  OBMOVE_OTHER_BENEFITS,
  OBMOVE_WHY,
} from "@/constants/pages/products/obmove/business-benefits";
import { IconName } from "@/lib/iconMap";

export interface ProductHero {
  title: string;
  description: string;
  backgroundImage: string | StaticImageData;
  icon?: IconName;
  ctaButtons: {
    primary: string;
    secondary: string;
  };
}

export interface ProductSection {
  id: string;
  icon?: IconName;
  iconText?: string;
  title: string;
  description?: string;
  items?: readonly any[];
  image?: string | StaticImageData;
  bottomNote?: string;
  variant?: "left" | "right";
}

export interface ProductData {
  slug: string;
  hero: ProductHero;
  whySection: any;
  sections: ProductSection[];
  whatMakesDifferent: readonly any[];
  howItWorks: readonly any[];
  quotes: readonly any[];
  keyBenefits: readonly any[];
  whatMakesDifferentDescription: string;
  howItWorksTitle: string;
  howItWorksDescription: string;
  link?: string;
}

const PRODUCTS_DATA: Record<string, ProductData> = {
  obpark: {
    link: "/faq/obpark-faq",
    slug: "obpark",
    hero: {
      title: "Obpark",
      description:
        "Seamless Parking. Smarter Navigation. Revolutionizing indoor and outdoor parking experiences with AR/MR-powered navigation, reservations, and safety tools.",
      backgroundImage: IMAGES.OBPARK_HERO,
      icon: "ObIcon",
      ctaButtons: {
        primary: "Visit Obpark website",
        secondary: "SCHEDULE A DEMO",
      },
    },
    whatMakesDifferentDescription:
      "At Obpark, we don't just provide a solution—we redefine how you experience the entire journey. Our difference lies in combining cutting-edge immersive technology with practical, real-world solutions that benefit both users and businesses.",
    whySection: WHY_SECTION_OBPARK,
    sections: [
      {
        id: "business-benefits",
        icon: "RoundedBallIcon",
        iconText: "Obpark for Businesses",
        title:
          "Better space utilization, higher revenue, and happier customers. Transform Parking Into a Smart Mobility Advantage",
        description:
          "Parking is no longer just about filling spaces—it's about creating value, efficiency, and customer satisfaction. With Obpark, facility owners and operators can revolutionize how parking is managed, monetized, and experienced.",
        items: OBPARK_BUSINESS_BENEFIT,
        image: OBPARK_IMAGES.OBPARK_BUSINESS_1,
        bottomNote:
          "Obpark turns traditional parking into a smart, connected service ecosystem",
        variant: "left",
      },
      {
        id: "why-partner",
        title: "Why Partner with Obpark?",
        items: OBPARK_WHY,
        image: OBPARK_IMAGES.OBPARK_BUSINESS_2,
        bottomNote:
          "Obpark elevates parking from a necessity into a premium, data-driven experience.",
        variant: "right",
      },
      {
        id: "parking-works",
        icon: "RoundedBallIcon",
        iconText: "Obpark for Businesses",
        title: "Parking That Works for You",
        description:
          "Say goodbye to the frustration of circling lots, missing appointments, or guessing where to park. With Obpark, every journey ends with a seamless, stress-free parking experience powered by Augmented Reality (AR) and Mixed Reality (MR).",
        items: PARKING_WITH_OBPARK,
        image: OBPARK_IMAGES.OBPARK_BUSINESS_3,
        bottomNote:
          "Obpark turns traditional parking into a smart, connected service ecosystem",
        variant: "left",
      },
      {
        id: "extended-features",
        title: "Extended Features Beyond Parking",
        items: OBPARK_OTHER_BENEFITS,
        image: OBPARK_IMAGES.OBPARK_BUSINESS_4,
        bottomNote:
          "Request or manage valet parking directly through the app.",
        variant: "right",
      },
    ],
    whatMakesDifferent: OBPARK_WHAT_MAKES_DIFFERENT,
    howItWorks: OBPARK_HOW_IT_WORK,
    quotes: OBPARK_QUOTES,
    keyBenefits: OBPARK_KEY_BENEFITS,
    howItWorksTitle: "Simple Integration. Smarter Parking.",
    howItWorksDescription:
      "Transforming your parking facility into a smart AR/MR-enabled ecosystem is seamless with Obpark. Here's how:",
  },
  obnest: {
    link: "/faq/obnest-faq",
    slug: "obnest",
    hero: {
      title: "Obnest",
      description:
        "Seamless Tours. Effortless Decisions. Revolutionizing property exploration with MR/VR experiences—walk through spaces, interact with layouts, and finalize decisions faster and easier.",
      backgroundImage: IMAGES.OBNEST_HERO,
      icon: "ObIcon",
      ctaButtons: {
        primary: "Visit Obnest website",
        secondary: "SCHEDULE A DEMO",
      },
    },
    whatMakesDifferentDescription:
      "With Obnest, property exploration goes beyond photos and blueprints. Using Mixed Reality (MR) and Virtual Reality (VR), buyers and stakeholders can experience every corner of a property—from living rooms and kitchens to lobbies and offices—as if they were physically there.",
    whySection: WHY_SECTION_OBNEST,
    sections: [
      {
        id: "business-benefits",
        icon: "RoundedBallIcon",
        iconText: "Obnest For Businesses",
        title:
          "Empowers businesses to move beyond static photos and brochures, delivering immersive, interactive property experiences",
        description:
          "With Obnest, property exploration goes beyond photos and blueprints. Using MR and VR, buyers and stakeholders can experience every corner of a property—from living rooms and kitchens to lobbies and offices—as if they were physically there.",
        items: OBNEST_BUSINESS_BENEFIT,
        image: OBNEST_IMAGES.OBNEST_BUSINESS_1,
        bottomNote:
          "Obnest turns property shopping from exhausting to exciting with tech that shows, not tells.",
        variant: "left",
      },
      {
        id: "why-partner",
        title: "Why Partner with Obnest?",
        items: OBNEST_WHY,
        image: OBNEST_IMAGES.OBNEST_BUSINESS_2,
        bottomNote:
          "Deliver a modern, engaging experience that builds trust and loyalty.",
        variant: "right",
      },
      {
        id: "parking-works",
        icon: "RoundedBallIcon",
        iconText: "Obnest for Businesses",
        title: "Experience Homes Before You enter",
        description:
          "Finding the right home or space is a big decision—and photos or floorplans can only tell part of the story. With Obnest, you can walk through properties in MR/VR before you visit, explore design options, and feel confident in your choices.",
        items: PARKING_WITH_OBNEST,
        image: OBNEST_IMAGES.OBNEST_BUSINESS_3,
        bottomNote:
          "Change wall colors, flooring, and furniture in real-time to see how a property fits your style.",
        variant: "left",
      },
      {
        id: "extended-features",
        title: "Who Benefits Most?",
        items: OBNEST_OTHER_BENEFITS,
        image: OBNEST_IMAGES.OBNEST_BUSINESS_4,
        bottomNote:
          "Obnest brings confidence, convenience, and clarity to property hunting",
        variant: "right",
      },
    ],
    whatMakesDifferent: OBNEST_WHAT_MAKES_DIFFERENT,
    howItWorks: OBNEST_HOW_IT_WORK,
    quotes: OBNEST_QUOTES,
    keyBenefits: OBNEST_KEY_BENEFITS,
    howItWorksTitle: "List Showcase. Sell Smarter.",
    howItWorksDescription:
      "With Obnest, turning your properties into immersive MR/VR experiences is simple. Here’s how:",
  },
  obnavi: {
    link: "/faq/obnavi-faq",
    slug: "obnavi",
    hero: {
      title: "Obnavi",
      description:
        "Immersive In-Store Navigation, Reimagined.\nimmersive real-time navigation, personalized product discovery, and seamless AR/MR shopping assistance",
      backgroundImage: IMAGES.OBNAVI_HERO,
      icon: "ObIcon",
      ctaButtons: {
        primary: "Visit Obnavi website",
        secondary: "SCHEDULE A DEMO",
      },
    },
    whatMakesDifferentDescription:
      "At Obnavi, From entry to checkout, reimagine every customer interaction through one immersive solution. Deliver a retail experience that’s smart, personalized, and immersive. Guide shoppers through indoor spaces with real-time AR/MR overlays, ensuring they effortlessly discover products and never wander again.",
    whySection: WHY_SECTION_OBNAVI,
    sections: [
      {
        id: "smart-navigation",
        icon: "RoundedBallIcon",
        iconText: "Obnavi for For Businesses",
        title:
          "Better space utilization, higher revenue, and happier customers. Transform Parking Into a Smart Mobility Advantage",
        description:
          "Obnavi turns retail spaces into immersive AR/MR experiences, offering real-time navigation and personalized promotions to boost engagement, sales, and loyalty.",
        items: OBNAVI_FOR_BUSINESS,
        image: OBNAVI_IMAGES.OBNAVI_BUSINESS_1,
        bottomNote:
          "Gain visibility into client behaviors—track what spaces they spend time in, what finishes they prefer, and which layouts resonate most.",
        variant: "left",
      },
      {
        id: "why-partner",
        title: "Why Partner with Obnavi?",
        items: OBNAVI_WHY,
        image: OBNAVI_IMAGES.OBNAVI_BUSINESS_2,
        bottomNote:
          "Deliver a modern, engaging experience that builds trust and loyalty.",
        variant: "right",
      },
      {
        id: "parking-works",
        icon: "RoundedBallIcon",
        iconText: "Obnavi for Consumers",
        title: "Shop Smarter. Shop Faster. Shop Immersive.",
        description:
          "Obnavi makes shopping simple and personalized. Using AR/MR, it guides you in real-time, highlights deals, and gives instant product details—no wandering, no confusion, just seamless shopping.",
        items: OBNAVI_FOR_CONSUMERS,
        image: OBNAVI_IMAGES.OBNAVI_BUSINESS_3,
        bottomNote:
          "With Obnavi, every visit to the store is more than just a trip—it’s an experience.",
        variant: "left",
      },
      {
        id: "extended-features",
        title: "Who Benefits Most?",
        items: OBNAVI_OTHER_BENEFITS,
        image: OBNAVI_IMAGES.OBNAVI_BUSINESS_4,
        bottomNote: "Request or manage valet parking directly through the app.",
        variant: "right",
      },
    ],
    whatMakesDifferent: OBNAVI_WHAT_MAKES_DIFFERENT,
    howItWorks: OBNAVI_HOW_IT_WORK,
    quotes: OBNAVI_QUOTES,
    keyBenefits: OBNAVI_KEY_BENEFITS,
    howItWorksTitle: "A Seamless, Immersive Shopping Journey",
    howItWorksDescription:
      "Obnavi combines AR/MR navigation, real-time data, and personalized discovery to make in-store shopping effortless and engaging.",
  },
  obmove: {
    link: "/faq/obmove-faq",
    slug: "obmove",
    hero: {
      title: "Obmove",
      description:
        "Redefining Automotive Showrooms with MR/VR Obmove is a next-generation MR/VR virtual showroom platform that transforms the way customers explore, customize, and purchase vehicles.",
      backgroundImage: IMAGES.OBMOVE_HERO,
      icon: "ObIcon",
      ctaButtons: {
        primary: "Visit Obmove website",
        secondary: "SCHEDULE A DEMO",
      },
    },
    whatMakesDifferentDescription:
      "Obmove helps dealerships meet rising customer expectations with an MR/VR showroom that delivers immersive, personalized, and convenient car-buying experiences.",
    whySection: WHY_SECTION_OBMOVE,
    sections: [
      {
        id: "business-benefits",
        icon: "RoundedBallIcon",
        iconText: "Obmove For Businesses",
        title: "Transform the Way You Showcase & Sell Vehicles",
        description:
          "Obmove is redefining vehicle sales with an MR/VR showroom that delivers immersive, personalized experiences—building buyer confidence and transforming the car-buying journey.",
        items: OBMOVE_BUSINESS_BENEFIT,
        image: OBMOVE_IMAGES.OBMOVE_BUSINESS_1,
        bottomNote:
          "Present every model, trim, and configuration—without showroom space limitations.",
        variant: "left",
      },
      {
        id: "why-partner",
        title: "Why Partner with Obmove?",
        items: OBMOVE_WHY,
        image: OBMOVE_IMAGES.OBMOVE_BUSINESS_2,
        bottomNote:
          "Stand out with futuristic retail experiences that strengthen brand loyalty and enhance customer trust.",
        variant: "right",
      },
      {
        id: "parking-works",
        icon: "RoundedBallIcon",
        iconText: "Obmove for Consumers",
        title: "Experience Your Next Car Like Never Before",
        description:
          "Finding the right home or space is a big decision—and photos or floorplans can only tell part of the story. With Obnest, you can walk through properties in MR/VR before you visit, explore design options, and feel confident in your choices.",
        items: OBMOVE_FOR_CONSUMERS,
        image: OBMOVE_IMAGES.OBMOVE_BUSINESS_3,
        bottomNote:
          "Feel like you’re inside the showroom without leaving home.",
        variant: "left",
      },
      {
        id: "extended-features",
        title: "Who Benefits Most?",
        items: OBMOVE_OTHER_BENEFITS,
        image: OBMOVE_IMAGES.OBMOVE_BUSINESS_4,
        bottomNote:
          "Feel like you’re inside the showroom without leaving home.",
        variant: "right",
      },
    ],
    whatMakesDifferent: OBMOVE_WHAT_MAKES_DIFFERENT,
    howItWorks: OBMOVE_HOW_IT_WORK,
    quotes: OBMOVE_QUOTES,
    keyBenefits: OBMOVE_KEY_BENEFITS,
    howItWorksTitle: "A Seamless, Immersive Shopping Journey",
    howItWorksDescription:
      "Obmove combines AR/MR navigation, real-time data, and personalized discovery to make in-store shopping effortless and engaging.",
  },
};

export function getProductSlugs(): string[] {
  return Object.keys(PRODUCTS_DATA);
}

export function getProductData(slug: string): ProductData | null {
  return PRODUCTS_DATA[slug] || null;
}

export function getAllProducts(): ProductData[] {
  return Object.values(PRODUCTS_DATA);
}
