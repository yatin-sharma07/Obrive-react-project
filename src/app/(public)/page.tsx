import type { Metadata } from "next";
import FONTS from "@/assets/fonts";
import { BACKGROUND_IMAGE, BACKGROUND_IMAGE_META } from "@/assets/images";
import RoundedBallIcon from "@/components/shared/icons/RoundedBallIcon";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import dynamic from "next/dynamic";

import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import UsecaseCard from "@/components/pages/home/card/UsecaseCard";
import { HOME_CARD, HOME_CARD_BLOG } from "@/constants/pages/home/home-card";
import BlogCard from "@/components/pages/home/card/BlogCard";
import {
  FadeInOnLoad,
  FadeInOnView,
  StaggerTiltBottomLeftOnScroll,
} from "@/components/shared/motion/GsapMotion";
import AnimatedButton from "@/components/shared/buttons/AnimatedButton";
import SmoothScrollLink from "@/components/shared/buttons/SmoothScrollLink";
import SmoothScrollProvider from "@/components/shared/motion/SmoothScrollProvider";
import ObriveVideo from "@/components/pages/home/Videos/ObriveVideo";
import Link from "next/link";
import GoodByeCard from "@/components/pages/home/card/GoodByeCard";
import { HomepageRiveAnimation } from "@/components/pages/home/HomepageRiveAnimation";

// Dynamic imports for performance optimization
// const HomepageRiveAnimation = dynamic(
//   () =>
//     import("@/components/pages/home/HomepageRiveAnimation").then(
//       (mod) => mod.HomepageRiveAnimation
//     ),
//   {
//     // ssr: false,
//     loading: () => (
//       <div className="h-[400px] animate-pulse bg-gray-200 rounded-lg" />
//     ),
//   }
// );

const VideoCardObrive = dynamic(
  () => import("@/components/shared/cards/VideoCardObrive"),
  {
    loading: () => (
      <div className="h-[300px] animate-pulse bg-gray-200 rounded-lg" />
    ),
  }
);

const ImmersiveExperience = dynamic(
  () => import("@/components/shared/cards/ImmersiveExperience"),
  {
    loading: () => (
      <div className="h-[400px] animate-pulse bg-gray-200 rounded-lg" />
    ),
  }
);

const EffortlessControl = dynamic(
  () => import("@/components/shared/cards/EffortlessControl"),
  {
    loading: () => (
      <div className="h-[400px] animate-pulse bg-gray-200 rounded-lg" />
    ),
  }
);

export const metadata: Metadata = {
  metadataBase: new URL("https://www.obrive.in"),

  title:
    "Obrive – AR, VR, MR & Spatial Computing Solutions | Immersive Tech in Bangalore",

  description:
    "Obrive is a leading immersive technology company in Bangalore, India offering cutting-edge AR, VR, MR, 3D design & spatial computing solutions for industries including real estate, automotive, retail, education & enterprise digital transformation.",

  keywords: [
    "Obrive immersive technology",
    "AR VR MR solutions India",
    "spatial computing development",
    "3D visualization Bangalore",
    "augmented reality services",
    "virtual reality applications",
    "mixed reality enterprise solutions",
    "immersive tech Bangalore",
  ],

  alternates: {
    canonical: "https://www.obrive.in",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://www.obrive.in",
    title:
      "Obrive – AR, VR, MR & Spatial Computing Solutions | Immersive Tech in Bangalore",
    description:
      "Leading immersive technology company in Bangalore delivering AR, VR, MR, 3D visualization and spatial computing solutions for enterprise digital transformation.",
    siteName: "Obrive",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Obrive – AR, VR, MR & Spatial Computing Solutions",
    description:
      "Immersive technology company in Bangalore delivering AR, VR, MR and 3D visualization solutions.",
  },

  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bangalore, Karnataka, India",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function Home() {
  return (
    <>
      <SmoothScrollProvider>
        <div className="flex flex-col items-center">
          {/* hero content */}
          <FullWidthSection backgroundColor="accent" className="py-10 pt-30">
            <div className="text-center flex flex-col items-center gap-8 mt-10">
              <FadeInOnLoad delay={0.15}>
                <h1
                  className={`${FONTS.microgrammaBold.className} text-4xl sm:text-5xl md:text-5xl lg:text-6xl text-secondary`}
                >
                  Orchestrating What’s Next
                </h1>
              </FadeInOnLoad>
              <FadeInOnLoad delay={0.3}>
                <p className="text-sm sm:text-md text-center max-w-4xl px-4 font-medium">
                  Stop manual bottlenecks. Elevate client experience. Conquer
                  compliance effortlessly. Obrive's AI-driven automation
                  platform liberates your team from repetitive tasks. Focus on
                  growth, efficiency, and client trust—all from one intuitive
                  dashboard.
                </p>
              </FadeInOnLoad>
            </div>
          </FullWidthSection>

          {/*  Buttons */}
          <FullWidthSection backgroundColor="accent" className="py-6">
            <FadeInOnLoad delay={0.45}>
              <div className="flex sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <AnimatedButton
                  asChild
                  className="text-xs uppercase"
                  size="lg"
                  href="/coming-soon"
                  aria-label="talk to ella our ai assistant"
                  iconSize={16}
                >
                  Talk to Ella
                </AnimatedButton>
                <SmoothScrollLink href="/about" offset={80}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-primary uppercase text-xs"
                  >
                    Learn More
                  </Button>
                </SmoothScrollLink>
              </div>
            </FadeInOnLoad>
          </FullWidthSection>

          {/* homepage animation */}
          <FullWidthSection backgroundColor="accent" className="py-10">
            <div className="mx-auto flex items-center w-full">
              <HomepageRiveAnimation className="w-full aspect-[16/4] max-h-[320px] sm:max-h-[340px] lg:max-h-[380px]" />
            </div>
          </FullWidthSection>

          {/* brand-line */}
          <FullWidthSection backgroundColor="accent" className="py-6">
            <FadeInOnView>
              <div className="flex flex-col sm:flex-row pb-8 border-b-2 border-primary/40 sm:items-center max-sm:items-start justify-between w-full gap-4">
                <Link href="/resources">
                  <Button
                    className="uppercase bg-accent cursor-pointer rounded-lg text-[10px]"
                    variant={"outline"}
                  >
                    News
                  </Button>
                </Link>
                <p className="uppercase text-[10px] font-semibold max-sm:text-left text-primary text-center sm:text-right">
                  Powering Your brand Workflows with Intelligent Automation
                </p>
              </div>
            </FadeInOnView>
          </FullWidthSection>

          {/* mission */}
          <FullWidthSection backgroundColor="accent" className="pt-10">
            <FadeInOnView>
              <div className="flex relative w-full overflow-hidden gap-10 flex-col">
                <div className="absolute top-20 left-80">
                  <Image
                    src={BACKGROUND_IMAGE.CURVED_BG}
                    alt={BACKGROUND_IMAGE_META.CURVED_BG.alt}
                    width={BACKGROUND_IMAGE_META.CURVED_BG.width}
                    height={BACKGROUND_IMAGE_META.CURVED_BG.height}
                  />
                </div>
                <FadeInOnView>
                  <div className="max-w-4xl w-full flex flex-col gap-6 items-start px-4">
                    <h2
                      className={`${FONTS.microgrammaBold.className} text-2xl sm:text-3xl lg:text-4xl leading-tight`}
                    >
                      Streamline processes. Empower people. Obrive enables
                      organisations to modernise operations through smart
                      automation—turning manual effort into strategic execution.
                    </h2>
                    <Link href="/about">
                      <Button
                        className="uppercase text-xs cursor-pointer"
                        variant={"outline"}
                        size={"lg"}
                      >
                        Know More About Obrive
                      </Button>
                    </Link>
                  </div>
                </FadeInOnView>

                <div className="my-20">
                  <FadeInOnView>
                    <ObriveVideo />
                  </FadeInOnView>
                  <FadeInOnView>
                    <div
                      className="mt-6 max-w-4xl w-full text-sm px-4 sm:px-14"
                      id="mission"
                    >
                      <p>
                        Stay ahead of the future—create immersive Augmented
                        Reality, Virtual Reality, and Mixed Reality experiences,
                        design stunning 3D environments, and harness the power
                        of spatial computing—all from one innovative platform
                        with Obrive Industries.
                      </p>
                    </div>
                  </FadeInOnView>
                </div>
              </div>
            </FadeInOnView>
          </FullWidthSection>

          {/* services */}
          <ImmersiveExperience />

          {/* effortless control */}
          <EffortlessControl />

          {/* goodbye card */}
          <FadeInOnView>
            <GoodByeCard />
          </FadeInOnView>

          {/* video vard obrive */}
          <VideoCardObrive />

          {/* use cases  */}
          <FullWidthSection>
            <FadeInOnView>
              <div className="my-20 flex flex-col justify-between w-full gap-16 px-4">
                <FadeInOnView>
                  <div className="flex flex-col items-center gap-14">
                    <div className="flex flex-col items-center gap-2">
                      <RoundedBallIcon />
                      <span className="uppercase text-xs font-medium">
                        Use cases
                      </span>
                    </div>
                    <div>
                      <h2
                        className={`${FONTS.microgrammaBold.className} text-center w-full sm:w-4xl lg:w-5xl text-3xl sm:text-4xl lg:text-5xl px-4 sm:px-8`}
                      >
                        Transforming Real-World Challenges with Immersive Tech
                      </h2>
                    </div>
                  </div>
                </FadeInOnView>
                <div className="relative flex flex-col px-4 sm:px-8 lg:px-18 gap-6 lg:gap-10 min-h-[400px]">
                  {/* curved primary bg image */}
                  <div className="hidden lg:block absolute inset-y-0 left-30 w-[800px] -z-10 pointer-events-none">
                    <Image
                      src={BACKGROUND_IMAGE.PRIMARY_CURVED_BG}
                      alt={BACKGROUND_IMAGE_META.PRIMARY_CURVED_BG.alt}
                      fill
                      className="object-contain"
                      sizes="800px"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>

                  {/* Cards column aligned to the end (right). Add left padding to avoid overlap with the absolute image */}
                  <div id="use-cases">
                    <StaggerTiltBottomLeftOnScroll className="flex relative flex-col gap-6 sm:gap-8 lg:gap-12 w-full mt-10 items-end">
                      {HOME_CARD.map((card) => (
                        <UsecaseCard
                          key={card.title}
                          description={card.description}
                          title={card.title}
                          icon={card.icon}
                          use={card.use}
                          url={card.url}
                        />
                      ))}
                    </StaggerTiltBottomLeftOnScroll>
                  </div>
                </div>
              </div>
            </FadeInOnView>
          </FullWidthSection>

          {/* immersive tech section */}
          <FullWidthSection>
            <FadeInOnView>
              <div className="my-20 flex flex-col justify-between w-full gap-16 px-4">
                <FadeInOnView>
                  <div className="text-center flex flex-col items-center gap-4">
                    <h2
                      className={`${FONTS.microgrammaBold.className} w-full sm:w-3xl leading-tight sm:leading-14 px-4 sm:px-10 text-primary text-3xl sm:text-4xl lg:text-5xl`}
                    >
                      Immersive Tech Resource Library
                    </h2>
                    <p className="text-md w-full sm:w-3xl lg:w-4xl px-4 sm:px-10 text-center">
                      Learn and lead with confidence through blogs, case
                      studies, and insights shaping the future of AR, VR, MR, 3D
                      Design, and Spatial Computing.
                    </p>
                  </div>
                </FadeInOnView>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {HOME_CARD_BLOG.map((blog) => (
                    <BlogCard
                      key={blog.title}
                      date={blog.date}
                      title={blog.title}
                      imageSrc={blog.imageSrc}
                      imgWidth={blog.imgWidth}
                      imgHeight={blog.imgHeight}
                      imgAlt={blog.imgAlt}
                      description={blog.description}
                      slug={blog.slug}
                    />
                  ))}
                </div>

                <div className="w-full flex justify-center mt-5 px-4">
                  <Link href="/resources">
                    <Button
                      size={"lg"}
                      variant={"outline"}
                      className="uppercase rounded-full bg-white! hover:bg-[#074139]! transition-all duration-300 hover:text-white text-[10px] w-full sm:w-auto cursor-pointer"
                    >
                      Visit Library
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInOnView>
          </FullWidthSection>
        </div>
      </SmoothScrollProvider>
    </>
  );
}
