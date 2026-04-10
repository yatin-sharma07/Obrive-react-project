import FullWidthSection from "../layout/FullWidthSection";
import { FadeInOnView } from "../motion/GsapMotion";
import RoundedBallIcon from "../icons/RoundedBallIcon";
import FONTS from "@/assets/fonts";
import ImmersiveIcon from "../icons/ImmersiveIcon";
import HoverAccordion from "../accordion/HoverAccordion";
import { IMAGES_META } from "@/assets/images";
import AnimatedButton from "../buttons/AnimatedButton";

const ImmersiveExperience = () => {
  return (
    <FullWidthSection>
      <FadeInOnView>
        <div className="my-20 flex flex-col justify-between w-full gap-16 px-4">
          <FadeInOnView>
            <div className="flex flex-col items-center gap-14">
              <div className="flex flex-col items-center gap-2">
                <RoundedBallIcon />
                <span className="uppercase text-xs font-medium">Services</span>
              </div>
              <div>
                <h2
                  className={`${FONTS.microgrammaBold.className} text-3xl sm:text-4xl max-sm:text-center lg:text-5xl`}
                >
                  Immersive Experience
                </h2>
              </div>
            </div>
          </FadeInOnView>
          <div className="flex flex-col lg:flex-row gap-10 justify-between items-start lg:items-start w-full">
            <FadeInOnView>
              <div className="w-full max-w-lg">
                <div className="flex flex-col gap-5">
                  <ImmersiveIcon />
                  <h4 className="text-lg sm:text-xl leading-8">
                    Revolutionize client engagement with one intelligent
                    platform—seamlessly managing AR, VR, MR, 3D design, and
                    spatial computing experiences.
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
                        id: "ie-design",
                        wrapperClassName:
                          "border-y border-primary/40 px-6 py-6",
                        heading: (
                          <h3
                            className={`${FONTS.microgrammaBold.className} text-md`}
                          >
                            Design & Deploy with Ease
                          </h3>
                        ),
                        content: (
                          <p className="text-xs max-w-md leading-6">
                            Launch complex immersive experiences—be it AR
                            marketing campaigns, VR training worlds, MR product
                            demos, or 3D visualizations—through an intuitive,
                            unified platform
                          </p>
                        ),
                      },
                      {
                        id: "ie-payroll",
                        wrapperClassName:
                          "border-b border-primary/40 px-6 py-6",
                        heading: (
                          <h3
                            className={`${FONTS.microgrammaBold.className} text-md`}
                          >
                            Payroll and census data collection
                          </h3>
                        ),
                        content: (
                          <p className="text-xs max-w-md leading-6">
                            Eliminate manual steps. Automate environment
                            rendering, spatial data syncing, and version
                            tracking so your creative team stays focused on
                            innovation, not logistics.
                          </p>
                        ),
                      },
                      {
                        id: "ie-inbox",
                        wrapperClassName:
                          "border-b border-primary/40 px-6 py-6",
                        heading: (
                          <h3
                            className={`${FONTS.microgrammaBold.className} text-md`}
                          >
                            Smart Inbox with auto-responses <br /> and task
                            creation
                          </h3>
                        ),
                        content: (
                          <p className="text-xs max-w-md leading-6">
                            From remote stakeholder reviews to cross-department
                            design iterations, collaboration happens inside the
                            experience. Comment, adjust, and approve within the
                            platform—no back-and-forth emails needed.
                          </p>
                        ),
                      },
                      {
                        id: "ie-portal",
                        wrapperClassName:
                          "border-b border-primary/40 px-6 py-6",
                        heading: (
                          <h3
                            className={`${FONTS.microgrammaBold.className} text-md`}
                          >
                            Unified client portal for <br /> seamless
                            collaboration
                          </h3>
                        ),
                        content: (
                          <p className="text-xs max-w-md leading-6">
                            Monitor user engagement, spatial interactions, and
                            design feedback using real-time analytics. Gain
                            insight into what resonates—and refine for even more
                            immersive impact.
                          </p>
                        ),
                      },
                    ]}
                  />
                  <div className="mt-4">
                    <AnimatedButton
                      asChild
                      size={"lg"}
                      className="uppercase text-[10px] cursor-pointer"
                      href="/#use-cases"
                      aria-label="Learn more about Immersive Experience services and AR/VR solutions"
                    >
                      Learn more about IE.
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </FadeInOnView>

            <FadeInOnView>
              <div className="w-full lg:max-w-[620px] xl:max-w-[620px] xl:h-[820px] self-start overflow-hidden rounded-3xl">
                <video
                  className="w-full h-full object-cover"
                  src="/videos/immersive-experience.mp4"
                  preload="metadata"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <span className="sr-only">
                  {IMAGES_META.SERVICE_PAGE_HOME.alt}
                </span>
              </div>
            </FadeInOnView>
          </div>
        </div>
      </FadeInOnView>
    </FullWidthSection>
  );
};

export default ImmersiveExperience;
