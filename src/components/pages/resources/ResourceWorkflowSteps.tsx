"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Link as LinkIcon, X, Twitter, Facebook, Linkedin } from "lucide-react";
import CustomToast from "./components/Toast";
interface ResourceWorkflowStepsProps {
  steps: string[];
}

export default function ResourceWorkflowSteps({
  steps,
}: ResourceWorkflowStepsProps) {
  const [copied, setCopied] = React.useState(false);
  const [stepTargets, setStepTargets] = React.useState<(HTMLElement | null)[]>(
    []
  );
const [showToast, setShowToast] = React.useState(false);
   const handleShare = async () => {
     try {
      await handleCopy();
       const url = window.location.href;
       if (navigator.share) {
         await navigator.share({ title: document.title, url });
       } else if (navigator.clipboard) {
         await navigator.clipboard.writeText(url);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
       }
     } catch {
       // no-op: user cancelled or unsupported
     }
   };

  const handleTwitterShare = async () => {
    await handleCopy();
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(document.title);
  window.open(
    `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    "_blank"
  );
};

const handleFacebookShare = async () => {
  await handleCopy();
  const url = encodeURIComponent(window.location.href);
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    "_blank"
  );
};

const handleLinkedInShare = async () => {
  await handleCopy();
  const url = encodeURIComponent(window.location.href);
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    "_blank"
  );
};

  const handleCopy = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
       setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
    } catch {}
  };

  const handleTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {}
  };

  React.useEffect(() => {
    const normalize = (value: string) =>
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const contentRoot = document.querySelector<HTMLElement>(
      "[data-resource-content]"
    );
    if (!contentRoot) {
      setStepTargets(Array(steps.length).fill(null));
      return;
    }

    const sectionNodes = Array.from(
      contentRoot.querySelectorAll<HTMLElement>("section")
    );

    const sectionData = sectionNodes.map((section) => {
      const heading = section.querySelector<HTMLElement>(
        "h1, h2, h3, h4, h5, h6"
      );
      if (heading) {
        heading.id = heading.id || normalize(heading.textContent || "");
      }
      section.style.scrollMarginTop = section.style.scrollMarginTop || "120px";
      return {
        element: section,
        headingText: normalize(heading?.textContent || ""),
      };
    });

    const usedIndices = new Set<number>();

    const mappedTargets = steps.map((step) => {
      const normalizedStep = normalize(step);

      let matchedIndex = sectionData.findIndex((data, index) => {
        if (usedIndices.has(index) || !data.headingText) return false;
        return (
          data.headingText === normalizedStep ||
          data.headingText.startsWith(normalizedStep) ||
          data.headingText.includes(normalizedStep)
        );
      });

      if (matchedIndex === -1) {
        matchedIndex = sectionData.findIndex(
          (_, index) => !usedIndices.has(index)
        );
      }

      if (matchedIndex === -1) {
        return null;
      }

      usedIndices.add(matchedIndex);
      return sectionData[matchedIndex].element;
    });

    setStepTargets(mappedTargets);
  }, [steps]);

  const handleScrollToStep = React.useCallback(
    (index: number) => {
      const target = stepTargets[index];
      if (!target) return;
      try {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {}
    },
    [stepTargets]
  );

  return (
    <section>
      <div>
        <div className="w-sm">
          {steps.map((step, index) => {
            const hasTarget = Boolean(stepTargets[index]);
            return (
              <button
                key={`${step}-${index}`}
                type="button"
                className={`flex w-full items-center gap-3 py-4 px-3 border-b border-primary/80 text-left text-xs transition-colors duration-200 ${
                  hasTarget
                    ? "cursor-pointer hover:bg-primary/10"
                    : "cursor-default"
                }`}
                onClick={() => handleScrollToStep(index)}
                aria-label={`Jump to ${step}`}
                disabled={!hasTarget}
              >
                <span>{step}</span>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4  flex-wrap">
          <Button
            variant="default"
            size="lg"
            onClick={handleShare}
            className="text-[10px]"
          >
            <Share2 className="size-4" />
            {copied ? "Copied" : "Share"}
          </Button>

          <Button
            variant="default"
            size="lg"
            className="bg-accent"
            aria-label="Back to top"
            onClick={handleTop}
          >
            <X className="size-4" color="black" />
          </Button>

          <Button
            variant="default"
            size="lg"
            className="bg-accent"
            aria-label="Copy link"
            onClick={handleCopy}
          >
            <LinkIcon className="size-4" color="black" />
          </Button>
          <Button
  variant="default"
  size="lg"
  className="bg-accent text-white"
  onClick={handleTwitterShare}
>
  <Twitter className="size-4" color="black" />
</Button>

<Button
  variant="default"
  size="lg"
  className="bg-accent text-white"
  onClick={handleFacebookShare}
>
  <Facebook className="size-4"color="black" />
</Button>

<Button
  variant="default"
  size="lg"
  className="bg-accent text-white"
  onClick={handleLinkedInShare}
>
  <Linkedin className="size-4"color="black" />
</Button>
        </div>
      </div>
      <CustomToast show={showToast} />
    </section>
  );
}
