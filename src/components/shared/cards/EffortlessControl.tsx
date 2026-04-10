import FullWidthSection from "../layout/FullWidthSection";
import { FadeInOnView } from "../motion/GsapMotion";
import FONTS from "@/assets/fonts";
import Image from "next/image";
import { OBPARK_IMAGES, OBPARK_IMAGES_META } from "@/assets/images";
import HoverAccordion from "../accordion/HoverAccordion";
import AnimatedButton from "../buttons/AnimatedButton";
import ObIcon from "../icons/ObIcon";
import Link from "next/link";

const EffortlessControl = () => {
  return (
    <FullWidthSection>
      <FadeInOnView>
        <div className="my-20 flex flex-col justify-between w-full gap-16 px-4">
          <FadeInOnView>
            <div className="text-center">
              <h2
                className={`${FONTS.microgrammaBold.className} text-3xl sm:text-4xl max-sm:text-center lg:text-5xl`}
              >
                Effortless Control
              </h2>
            </div>
          </FadeInOnView>
          <div className="flex flex-col lg:flex-row gap-10 justify-between items-start lg:items-start">
            <FadeInOnView>
              <div className="w-full max-w-3xl self-start rounded-2xl pointer-events-none select-none overflow-hidden">
                <Image
                  src={OBPARK_IMAGES.OBPARK_BUSINESS_3}
                  alt={OBPARK_IMAGES_META.OBPARK_BUSINESS_3.alt}
                  width={OBPARK_IMAGES_META.OBPARK_BUSINESS_3.width}
                  height={OBPARK_IMAGES_META.OBPARK_BUSINESS_3.height}
                  priority={false}
                />
              </div>
            </FadeInOnView>
            <FadeInOnView>
              <div className="w-full max-w-lg">
                <div className="flex flex-col gap-5">
                  <ObIcon />
                  <h4 className="text-lg sm:text-xl leading-8">
                    Obpark - AR simplifies navigation with real-time route
                    guidance, parking alerts, and spatial overlays—all in one
                    immersive dashboard.
                  </h4>
                  <HoverAccordion
                    className="mt-4"
                    defaultOpen={0}
                    autoAdvance={[
                      {
                        fromIndex: 0,
                        toIndex: 1,
                        durationMs: 4000,
                      },
                      {
                        fromIndex: 1,
                        toIndex: 2,
                        durationMs: 4000,
                      },
                      {
                        fromIndex: 2,
                        toIndex: 3,
                        durationMs: 4000,
                      },
                      {
                        fromIndex: 3,
                        toIndex: 0,
                        durationMs: 4000,
                      },
                    ]}
                    autoAdvanceMode="loop"
                    items={[
                      {
                        id: "ec-realtime",
                        wrapperClassName:
                          "border-y border-primary/40 px-6 py-6",
                        heading: (
                          <h3
                            className={`${FONTS.microgrammaBold.className} text-md`}
                          >
                            Effortless Real-Time Navigation
                          </h3>
                        ),
                        content: (
                          <p className="text-xs max-w-md leading-6">
                            Carve the perfect path with immersive, context-aware
                            AR overlays, avoiding traffic and parking
                            frustration.
                          </p>
                        ),
                      },
                      {
                        id: "ec-automation",
                        wrapperClassName:
                          "border-b border-primary/40 px-6 py-6",
                        heading: (
                          <h3
                            className={`${FONTS.microgrammaBold.className} text-md`}
                          >
                            Seamless Spatial Automation
                          </h3>
                        ),
                        content: (
                          <p className="text-xs max-w-md leading-6">
                            Let ObPark dynamically highlight parking zones,
                            verge areas, and no-go zones as you drive—no
                            toggling screens required.
                          </p>
                        ),
                      },
                      {
                        id: "ec-safety",
                        wrapperClassName:
                          "border-b border-primary/40 px-6 py-6",
                        heading: (
                          <h3
                            className={`${FONTS.microgrammaBold.className} text-md`}
                          >
                            Enhanced Safety & Awareness
                          </h3>
                        ),
                        content: (
                          <p className="text-xs max-w-md leading-6">
                            Stay focused on the road while essential navigation
                            details float directly in your field of view.
                          </p>
                        ),
                      },
                      {
                        id: "ec-flow",
                        wrapperClassName:
                          "border-b border-primary/40 px-6 py-6",
                        heading: (
                          <h3
                            className={`${FONTS.microgrammaBold.className} text-md`}
                          >
                            Optimize Urban Driving Flow
                          </h3>
                        ),
                        content: (
                          <p className="text-xs max-w-md leading-6">
                            Improve trip efficiency and reduce stress by
                            accessing intuitive, location-aware AR cues.
                          </p>
                        ),
                      },
                    ]}
                  />
                  <div className="mt-4">
                    <Link href="/products/obpark">
                    <AnimatedButton
                      size={"lg"}
                      className="uppercase text-[10px] cursor-pointer"
                      href="/coming-soon"
                      aria-label="Learn more about ObPark AR navigation and parking solutions"
                    >
                      learn more about ob
                    </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </div>
            </FadeInOnView>
          </div>
        </div>
      </FadeInOnView>
    </FullWidthSection>
  );
};

export default EffortlessControl;
