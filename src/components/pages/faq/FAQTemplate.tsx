import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import { ReactNode } from "react";
import { FAQMetadata } from "@/lib/mdx";
import FAQWorkflowSteps from "./FAQWorkflowSteps";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import FONTS from "@/assets/fonts";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

interface FAQTemplateProps {
  metadata: FAQMetadata;
  children: ReactNode;
}

export default function FAQTemplate({ metadata, children }: FAQTemplateProps) {
  const workflowStepIds = metadata.workflowSteps?.map((step) => slugify(step));

  return (
    <FullWidthSection backgroundColor="accent" className="min-h-screen">
      <div className="pt-20 sm:pt-28 lg:pt-38 pb-16 sm:pb-24 lg:pb-30">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center px-4 sm:px-8 lg:px-13 mb-8 sm:mb-16 lg:mb-20">
          <p
            className={`${FONTS.microgrammaBold.className} text-4xl sm:text-5xl lg:text-6xl text-secondary leading-tight mb-6`}
          >
            {metadata.title}
          </p>

          {metadata.description && (
            <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed max-w-3xl">
              {metadata.description}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 xl:gap-40 px-4 sm:px-8 lg:px-0">
          {/* Workflow steps sidebar */}
          {metadata.workflowSteps && metadata.workflowSteps.length > 0 && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <FAQWorkflowSteps
                steps={metadata.workflowSteps}
                stepIds={workflowStepIds}
              />
            </div>
          )}

          <div className="flex flex-col flex-1">
            {/* MDX Content */}
            <div className="max-w-none lg:pr-8 xl:pr-16">{children}</div>
          </div>
        </div>
      </div>
    </FullWidthSection>
  );
}
