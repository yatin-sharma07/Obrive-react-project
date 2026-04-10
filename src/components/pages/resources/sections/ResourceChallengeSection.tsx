import FONTS from "@/assets/fonts";
import React from "react";

interface ResourceChallengeSectionProps {
  title?: string;
  content: React.ReactNode;
}

export default function ResourceChallengeSection({
  title = "The Challenge",
  content,
}: ResourceChallengeSectionProps) {
  return (
    <section className="mb-8">
      <h2 className={`${FONTS.microgrammaBold.className} text-3xl mb-4`}>
        {title}
      </h2>
      <div className="text-base leading-relaxed text-gray-700">{content}</div>
    </section>
  );
}
