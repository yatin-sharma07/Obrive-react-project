"use client";

import { useCallback } from "react";

interface FAQWorkflowStepsProps {
  steps: string[];
  stepIds?: string[];
}

export default function FAQWorkflowSteps({
  steps,
  stepIds,
}: FAQWorkflowStepsProps) {
  const handleScrollToSection = useCallback((targetId?: string) => {
    if (!targetId) return;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <section>
      <div>
        <div className="w-[430px] max-sm:w-full">
          {steps.map((step, index) => {
            const targetId = stepIds?.[index];

            return (
              <button
                key={step + index}
                type="button"
                className={`flex w-full items-center gap-2 py-4 border-b border-zinc-400 transition-all duration-200 text-left text-sm ${
                  targetId ? "cursor-pointer hover:bg-primary/10 px-3" : "px-3 cursor-default"
                }`}
                onClick={() => handleScrollToSection(targetId)}
                aria-label={`Jump to ${step}`}
              >
                <span>{step}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
