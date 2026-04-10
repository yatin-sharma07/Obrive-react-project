import FONTS from "@/assets/fonts";
import { KeyBenefitsCard } from "@/components/shared/cards/KeyBenefitsCard";
import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import { InfiniteHorizontalScroll } from "@/components/shared/layout/InfiniteHorizontalScroll";
import { FadeInOnView } from "@/components/shared/motion/GsapMotion";
import WorkflowSection from "./components/WorkflowSection";

interface SolutionTemplateProps {
  hero: {
    title: string;
    description: string;
    description2: string;
  };
  keyBenefits: readonly any[];
  howItWorks: readonly any[];
  workflowStepsSidebar: readonly string[];
}

export function SolutionTemplate({
  hero,
  keyBenefits,
  howItWorks,
  workflowStepsSidebar,
}: SolutionTemplateProps) {
  return (
    <div>
      <FadeInOnView>
        <FullWidthSection backgroundColor="none">
          <div className="flex mt-40 items-center flex-col gap-26 max-xl:mt-32 max-lg:mt-28 max-md:mt-20 max-sm:mt-26 max-md:gap-16">
            <div className="w-4xl max-xl:w-full">
              <h1
                className={`${FONTS.microgrammaBold.className} text-center text-primary text-7xl max-xl:text-6xl max-lg:text-5xl max-md:text-4xl max-sm:text-3xl`}
              >
                {hero.title}
              </h1>
            </div>
            <div className="flex items-center relative max-xl:w-full max-lg:flex-col max-lg:items-stretch max-lg:gap-6">
              <div className="flex flex-col w-[507px] items-start gap-2.5 pt-[25px] pb-2.5 px-2.5 relative self-stretch mt-[-1.00px] mb-[-1.00px] rounded-2xl border-[0.5px] border-solid border-primary/40 max-lg:w-full max-md:px-4 max-sm:px-3">
                <div className="flex h-[58px] items-center gap-2.5 p-2.5 relative self-stretch w-full max-md:h-auto max-md:p-2">
                  <div className="relative w-fit mt-[-2.00px] font-normal text-sm text-zinc-500 max-md:text-xs">
                    Overview
                  </div>
                </div>
              </div>

              <div className="inline-flex flex-col items-center justify-center gap-2.5 pl-6 pr-[90px] pt-4 pb-6 relative flex-[0_0_auto] mt-[-1.00px] mb-[-1.00px] rounded-2xl border-[0.5px] border-solid border-primary/40 max-lg:w-full max-lg:px-6 max-lg:py-6 max-md:px-4 max-md:py-5 max-sm:px-3">
                <div className="flex w-[804px] items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto] max-lg:w-full max-lg:p-0">
                  <p className="relative w-[804px] mt-[-1.00px] ml-[-4.50px] mr-[-4.50px] font-normal text-base tracking-[1.00px] leading-7 max-lg:w-full max-lg:m-0 max-md:text-sm max-md:leading-6 max-sm:text-xs">
                    {hero.description}
                    <br />
                    <br />
                    {hero.description2}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FullWidthSection>
      </FadeInOnView>

      <FadeInOnView>
        <div className="flex gap-10 my-5 max-lg:flex-col max-lg:items-stretch max-md:gap-6 max-md:my-14 max-sm:my-10">
          <InfiniteHorizontalScroll
            speed={25}
            gap={16}
            pauseOnHover={true}
            className="w-full"
            itemClassName="flex items-stretch max-md:basis-full"
          >
            {keyBenefits.map((item) => (
              <KeyBenefitsCard key={item.title} {...item} />
            ))}
          </InfiniteHorizontalScroll>
        </div>
      </FadeInOnView>

      <FullWidthSection backgroundColor="none">
        <WorkflowSection
          howItWorks={howItWorks}
          workflowStepsSidebar={workflowStepsSidebar}
        />
      </FullWidthSection>
    </div>
  );
}
