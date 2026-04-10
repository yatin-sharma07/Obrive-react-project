import FONTS from "@/assets/fonts";
import { BACKGROUND_IMAGE, BACKGROUND_IMAGE_META } from "@/assets/images";
import BusinessBenefitsCard from "@/components/pages/products/cards/BusinessBenefitsCard";
import HowItWorksCard from "@/components/pages/products/cards/HowItWorksCard";
import ProductPageCard from "@/components/pages/products/cards/ProductPageCard";
import WhatMakesUsDifferent from "@/components/pages/products/cards/WhatMakesUsDifferent";
import AnimatedButton from "@/components/shared/buttons/AnimatedButton";
import { KeyBenefitsCard } from "@/components/shared/cards/KeyBenefitsCard";
import PrimaryFooterCard from "@/components/shared/cards/PrimaryFooterCard";
import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import { InfiniteHorizontalScroll } from "@/components/shared/layout/InfiniteHorizontalScroll";
import SectionHeader from "@/components/shared/layout/SectionHeader";
import WhySection from "@/components/shared/layout/WhySection";
import {
  FadeInOnView as FramerFadeIn,
  StaggerOnView,
  StaggerItem,
} from "@/components/shared/motion/Motion";
import { ProductData } from "@/lib/products";
import Image from "next/image";
import { ProductSectionIcon } from "./ProductSectionIcon";
import { AnimatedRiveSection } from "./AnimatedRiveSection";
import Link from "next/link";

interface ProductTemplateProps extends ProductData {}

export function ProductTemplate({
  hero,
  whySection,
  sections,
  whatMakesDifferent,
  howItWorks,
  quotes,
  keyBenefits,
  whatMakesDifferentDescription,
  howItWorksTitle,
  howItWorksDescription,
  link,
}: ProductTemplateProps) {
  return (
    <div className="relative">
      <div className="relative z-10">
        <FullWidthSection
          backgroundColor="accent"
          clipOverflow={false}
          className="!w-screen !max-w-none"
        >
          <div className="absolute top-0 left-0 bg-accent w-full h-[120vh] max-md:h-[80vh]">
            <Image
              className="object-cover w-full h-full"
              alt={`${hero.title} Hero Background`}
              src={hero.backgroundImage}
              fill
              sizes="100vw"
              priority={true}
            />
          </div>
          <div className="flex flex-col gap-10 px-0 md:px-0">
            {/* hero section */}
            <section className="relative w-full mt-40 max-sm:mt-10 max-md:mt-28 h-screen max-md:h-[80vh] flex flex-col gap-10 items-center justify-center">
              {/* Hero Content - positioned above background */}
              <FramerFadeIn delay={0.2}>
                <div className="relative z-10 flex flex-col gap-3 items-center">
                  <ProductSectionIcon iconName={hero.icon} />
                  <h1
                    className={`${FONTS.microgrammaBold.className} uppercase text-primary text-6xl max-md:text-4xl`}
                  >
                    {hero.title}
                  </h1>
                  <p className="text-md text-center text-primary max-w-2xl px-4 leading-7">
                    {hero.description}
                  </p>
                </div>
              </FramerFadeIn>
              <FramerFadeIn delay={0.4}>
                <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <Link
                    href={`https://${hero.title}.in`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AnimatedButton size="lg" className="text-xs">
                      {hero.ctaButtons.primary}
                    </AnimatedButton>
                  </Link>
                  <Link
                    href={"https://calendly.com/obrive-inc/talk-to-ob-experts"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AnimatedButton
                      size={"lg"}
                      className="cursor-pointer text-[10px]"
                    >
                      {hero.ctaButtons.secondary}
                    </AnimatedButton>
                  </Link>
                </div>
              </FramerFadeIn>
            </section>
            {/* why section */}
            <FramerFadeIn>
              <section className="flex items-center justify-center">
                <WhySection {...whySection} link={link} />
              </section>
            </FramerFadeIn>
            {/* rive hero animation */}
            <AnimatedRiveSection
              sectionClassName="w-full"
              riveClassName="max-w-none relative sm:left-1/2 sm:-translate-x-1/2 w-[110vw] max-sm:hidden"
              aspectClassName="aspect-[16/6]"
            />
            {/* what makes us different */}
            <FramerFadeIn>
              <section className="pb-30">
                <div className="flex items-center gap-8 justify-center flex-col">
                  <h1
                    className={`${FONTS.microgrammaBold.className} text-primary max-sm:text-center text-5xl max-md:text-3xl`}
                  >
                    What Makes Us Different.
                  </h1>
                  <p className="text-primary text-center w-[840px] max-md:w-full max-md:px-6 text-md tracking-wider">
                    {whatMakesDifferentDescription}
                  </p>
                </div>
              </section>
            </FramerFadeIn>
          </div>
        </FullWidthSection>

        {/* brand line */}
        <FramerFadeIn>
          <WhatMakesUsDifferent items={whatMakesDifferent} />
        </FramerFadeIn>

        <FullWidthSection backgroundColor="accent">
          <div className="pt-30 flex flex-col gap-30">
            {/* Dynamic sections */}
            {sections.map((section, index) => (
              <FramerFadeIn key={section.id}>
                <section className="flex flex-col justify-between w-full gap-16 px-4">
                  <div className="flex flex-col items-center gap-14">
                    <div className="flex flex-col items-center gap-2">
                      <ProductSectionIcon iconName={section.icon} />
                      {section.iconText && (
                        <span className="uppercase text-xs font-medium">
                          {section.iconText}
                        </span>
                      )}
                    </div>
                    <div className="w-[690px] max-md:w-full flex flex-col gap-4">
                      <h3
                        className={`${
                          FONTS.microgrammaBold.className
                        } tracking-wider text-primary text-center ${
                          index === 0 ? "text-2xl" : "text-5xl"
                        } max-md:text-2xl`}
                      >
                        {section.title}
                      </h3>
                      {section.description && (
                        <p className="text-center">{section.description}</p>
                      )}
                    </div>
                  </div>

                  <StaggerOnView className="flex flex-col lg:flex-row gap-12 mt-10 justify-between items-start lg:items-start py-10">
                    {section.variant === "right" ? (
                      <>
                        {section.image && (
                          <StaggerItem className="w-full lg:w-[600px] self-start">
                            <Image
                              src={section.image}
                              alt={`${section.title || "Product"} Image`}
                              width={600}
                              height={600}
                              className="w-full h-auto rounded-xl"
                              loading="lazy"
                            />
                          </StaggerItem>
                        )}
                        {section.items && (
                          <StaggerItem className="w-full lg:w-auto">
                            <BusinessBenefitsCard
                              items={section.items}
                              bottomNote={section.bottomNote}
                            />
                          </StaggerItem>
                        )}
                      </>
                    ) : (
                      <>
                        {section.items && (
                          <StaggerItem className="w-full lg:w-auto">
                            <BusinessBenefitsCard
                              items={section.items}
                              bottomNote={section.bottomNote}
                            />
                          </StaggerItem>
                        )}
                        {section.image && (
                          <StaggerItem className="w-full lg:w-[600px] self-start">
                            <Image
                              src={section.image}
                              alt={`${section.title || "Product"} Image`}
                              width={600}
                              height={600}
                              className="w-full h-auto rounded-xl"
                              loading="lazy"
                            />
                          </StaggerItem>
                        )}
                      </>
                    )}
                  </StaggerOnView>
                </section>
              </FramerFadeIn>
            ))}

            {/* elevate your operations card */}
            <FramerFadeIn>
              <PrimaryFooterCard
                title={`Elevate Your Operations with ${hero.title}`}
                description={`Discover how leading organizations are optimizing processes, increasing efficiency, and delivering exceptional experiences with ${hero.title}`}
                variant="small"
              />
            </FramerFadeIn>
          </div>
        </FullWidthSection>
      </div>
      <div className="mt-10">
        <FullWidthSection backgroundColor="white">
          <div>
            <section className="flex flex-col py-10 justify-between w-full gap-9 px-4">
              <FramerFadeIn>
                <SectionHeader
                  title={howItWorksTitle}
                  description={howItWorksDescription}
                  iconText="How it works"
                />
              </FramerFadeIn>

              {howItWorks.map((step, index) => (
                <FramerFadeIn key={index}>
                  <div
                    className={`flex flex-col ${
                      index % 2 === 0 ? "gap-10" : "items-end gap-10"
                    } ${
                      index === howItWorks.length - 1
                        ? "border-b border-primary/40 pb-8"
                        : ""
                    }`}
                  >
                    <HowItWorksCard
                      {...step}
                      variant={index % 2 === 0 ? undefined : "right"}
                    />
                  </div>
                </FramerFadeIn>
              ))}
            </section>
          </div>
        </FullWidthSection>
      </div>

      {quotes.length > 0 && (
        <FramerFadeIn>
          <div className="my-20 flex items-center max-sm:px-4 justify-center">
            <ProductPageCard {...quotes[0]} />
          </div>
        </FramerFadeIn>
      )}

      <div className="flex flex-col gap-10 mb-20">
        <FramerFadeIn>
          <SectionHeader
            title={`Revolutionising Experiences with ${hero.title}.`}
            iconText="Key Benefits"
          />
        </FramerFadeIn>
        <FramerFadeIn delay={0.2}>
          <InfiniteHorizontalScroll speed={25} gap={16} pauseOnHover={true}>
            {keyBenefits.map((item) => (
              <KeyBenefitsCard key={item.title} {...item} />
            ))}
          </InfiniteHorizontalScroll>
        </FramerFadeIn>
      </div>
    </div>
  );
}
