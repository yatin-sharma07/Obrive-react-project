import FONTS from "@/assets/fonts";
import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import {
  FadeInOnLoad,
  StaggerTiltBottomLeftOnScroll,
} from "@/components/shared/motion/GsapMotion";
import WhySection from "@/components/shared/layout/WhySection";
import { TEAM_ABOUT } from "@/constants/pages/why-section";
import SectionHeader from "@/components/shared/layout/SectionHeader";
import { InfiniteHorizontalScroll } from "@/components/shared/layout/InfiniteHorizontalScroll";
import { KeyBenefitsCard } from "@/components/shared/cards/KeyBenefitsCard";
import { TEAM_JOIN_BENEFITS } from "@/constants/pages/key-benefits";
import { JOIN_TEAM_LIBRARY_CARD } from "@/constants/pages/career/library-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BACKGROUND_IMAGE, BACKGROUND_IMAGE_META } from "@/assets/images";
import { GIVING_BACK_CARD } from "@/constants/pages/career/giving-back-card";
import JoinTeamCarousel from "@/components/pages/career/JoinTeamCarousel";
import LibraryCard from "@/components/pages/career/card/LibraryCard";
import GivingBackCard from "@/components/pages/career/card/GivingBackCard";
import CareerCarousel from "@/components/pages/career/CareerCarousel";
import TeamHero from "@/components/pages/career/TeamHero";
import SmoothScrollProvider from "@/components/shared/motion/SmoothScrollProvider";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.obrive.in"),

  title:
    "Careers at Obrive | AR, VR & Spatial Computing Jobs in Bangalore",

  description:
    "Join Obrive — a fast-growing immersive technology company in Bangalore. Explore AR/VR developer roles, 3D design careers, spatial computing engineering jobs and immersive tech opportunities.",

  keywords: [
    "Obrive careers",
    "AR VR jobs Bangalore",
    "Spatial computing jobs India",
    "3D design careers Bangalore",
    "Immersive tech jobs",
    "Unity developer jobs India",
    "XR developer careers"
  ],

  alternates: {
    canonical: "https://www.obrive.in/career",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://www.obrive.in/career",
    title:
      "Careers at Obrive | Immersive Technology Jobs",
    description:
      "Build the future of AR, VR and spatial computing with Obrive. Explore open roles in engineering, 3D design and immersive tech.",
    siteName: "Obrive",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Careers at Obrive | AR/VR & Spatial Computing Jobs",
    description:
      "Explore immersive tech job opportunities in Bangalore at Obrive.",
  },

  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bangalore, Karnataka, India",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function JoinTeamPage() {
  return (
    <SmoothScrollProvider>
    <div>
      <section>
        <FullWidthSection backgroundColor="none" className="py-10 pt-30">
          <div className="text-center flex flex-col items-center gap-8">
            <FadeInOnLoad delay={0.15}>
              <h1
                className={`${FONTS.microgrammaBold.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-secondary`}
              >
                Join The Otters
              </h1>
            </FadeInOnLoad>
            <FadeInOnLoad delay={0.3}>
              <p className="text-sm sm:text-xl text-center max-w-2xl px-4 font-medium">
                If you're passionate about immersive technology you're in the
                right place.
              </p>
            </FadeInOnLoad>
          </div>
        </FullWidthSection>

        {/* Team images */}
        <TeamHero />
      </section>
      <section className="flex items-center justify-center">
        <WhySection {...TEAM_ABOUT} />
      </section>

      <section className="flex my-20 max-md:my-10 flex-col gap-20 max-md:gap-12">
        <div>
          <SectionHeader
            title="Why You’ll Love It Here"
            iconText="Join The Otters"
          />
        </div>

        <div className="">
          <InfiniteHorizontalScroll gap={26}>
            {TEAM_JOIN_BENEFITS.map((item) => (
              <KeyBenefitsCard key={item.title} {...item} />
            ))}
          </InfiniteHorizontalScroll>
        </div>
      </section>

      {/* join team section */}
      <section>
        <JoinTeamCarousel />
      </section>

      {/* shaping the future section */}
      <section className="flex flex-col items-center gap-10 my-10 max-md:gap-8">
        <SectionHeader
          title="GIVING BACK TO THE INDUSTRY!"
          iconText="Shaping the Future, Together"
          description="We believe innovation should go hand-in-hand with impact. Beyond building immersive technologies, we're committed to giving back to the industry."
        />
        <div className="flex items-center gap-6 mt-10 justify-center max-md:flex-col">
          {JOIN_TEAM_LIBRARY_CARD.map((item) => (
            <LibraryCard key={item.title} {...item} />
          ))}
        </div>

        <div>
          <Button
            asChild
            className="uppercase text-[10px] cursor-pointer rounded-full"
            size={"lg"}
          >
            <Link href="/resources">Visit Library</Link>
          </Button>
        </div>
      </section>

      {/* giving back section */}
      <FullWidthSection backgroundColor="none">
        <section>
        <SectionHeader title="WE REDEFINED THE FUTURE" iconText="GIVING BACK" />
        <div className="mt-20">
          <div className="relative flex flex-col px-4 sm:px-8 lg:px-48 gap-6 lg:gap-0 min-h-[400px]">
            {/* curved primary bg image */}
            <div className="hidden lg:block absolute inset-y-0 left-30 -top-20 w-[800px] -z-10 pointer-events-none">
              <Image
                src={BACKGROUND_IMAGE.PRIMARY_CURVED_BG}
                alt={BACKGROUND_IMAGE_META.PRIMARY_CURVED_BG.alt}
                fill
                className="object-contain"
                sizes="800px"
                priority
              />
            </div>

            <StaggerTiltBottomLeftOnScroll className="flex flex-col gap-8 sm:gap-16 lg:gap-30 w-full items-end pr-30 max-md:items-center max-md:pr-0">
              {GIVING_BACK_CARD.map((item) => (
                <GivingBackCard key={item.number} {...item} />
              ))}
            </StaggerTiltBottomLeftOnScroll>
          </div>
        </div>
      </section>
      </FullWidthSection>

      {/* career section */}
      <section className="bg-gradient mt-30 flex flex-col gap-20 max-md:gap-10 items-center p-20 max-md:p-8">
        <div className="flex justify-center w-full">
          <h1
            className={`${FONTS.microgrammaBold.className} uppercase text-5xl max-md:text-3xl text-primary`}
          >
            Careers
          </h1>
        </div>

        <CareerCarousel />
      </section>
      </div>
    </SmoothScrollProvider>
  );
}
