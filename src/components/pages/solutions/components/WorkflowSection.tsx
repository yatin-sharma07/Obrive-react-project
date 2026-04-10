"use client";

import { useRef } from "react";
import WorkflowSteps from "../cards/WorkflowSteps";
import { FadeInOnView } from "@/components/shared/motion/GsapMotion";
import FONTS from "@/assets/fonts";
import { IMAGES, IMAGES_META } from "@/assets/images";
import BenefitsTable from "../cards/BenefitsTable";
import Image from "next/image";

interface WorkflowSectionProps {
  howItWorks: readonly any[];
  workflowStepsSidebar: readonly string[];
}

const WorkflowSection = ({
  howItWorks,
  workflowStepsSidebar,
}: WorkflowSectionProps) => {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToStep = (stepIndex: number) => {
    const targetElement = stepRefs.current[stepIndex];
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="flex items-start my-20 justify-between gap-10 max-xl:gap-8 max-lg:flex-col max-lg:items-stretch max-lg:justify-start max-lg:gap-12 max-md:my-14 max-sm:my-10">
      <div className="sticky top-20 self-start max-md:hidden">
        <div className="w-sm">
          <p className="text-xs py-4 px-2">Workflow Steps</p>
          {(workflowStepsSidebar || []).map((step, index) => (
            <div
              key={step}
              className={`flex items-center gap-3 py-4 px-2 cursor-pointer hover:bg-primary/10 transition-colors ${
                index === 0 ? "border-y" : "border-b"
              } border-primary/80`}
              onClick={() => scrollToStep(index)}
            >
              <span className="text-xs">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-20 max-xl:gap-16 max-lg:gap-14 max-md:gap-12 max-sm:gap-10">
        {howItWorks.map((item, index) => (
          <FadeInOnView key={item.title}>
            <div
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
            >
              <WorkflowSteps {...item} />
            </div>
          </FadeInOnView>
        ))}

        <FadeInOnView>
          <div className="bg-accent flex items-center justify-center px-14 py-8 border border-primary/80 rounded-xl max-xl:px-12 max-lg:px-10 max-md:px-8 max-sm:px-5 max-sm:py-6">
            <div className="flex flex-col gap-6 max-md:gap-5 max-sm:gap-4 w-full max-w-[720px]">
              <h1
                className={`${FONTS.microgrammaBold.className} text-primary text-5xl max-xl:text-4xl max-lg:text-3xl max-md:text-2xl max-sm:text-xl`}
              >
                Why Choose Obrive
              </h1>

              <Image
                src={IMAGES.SOLUTION_FIRST_IMAGE}
                alt={IMAGES_META.SOLUTION_FIRST_IMAGE.alt}
                width={IMAGES_META.SOLUTION_FIRST_IMAGE.width}
                height={IMAGES_META.SOLUTION_FIRST_IMAGE.height}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 560px"
              />

              <div className="overflow-x-auto">
                <BenefitsTable />
              </div>
            </div>
          </div>
        </FadeInOnView>
      </div>
    </div>
  );
}

export default WorkflowSection;
