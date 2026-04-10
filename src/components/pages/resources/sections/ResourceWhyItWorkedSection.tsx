import FONTS from "@/assets/fonts";
import React from "react";

interface WhyItWorkedItem {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
}

interface ResourceWhyItWorkedSectionProps {
  title?: string;
  items: WhyItWorkedItem[];
  finalQuote?: string;
}

export default function ResourceWhyItWorkedSection({ 
  title = "Why It Worked", 
  items,
  finalQuote
}: ResourceWhyItWorkedSectionProps) {
  return (
    <section className="mb-8 space-y-6">
      <h2
        className={`${FONTS.microgrammaBold.className} text-2xl sm:text-3xl leading-tight`}
      >
        {title}
      </h2>
      <div className="space-y-6 pl-6 max-md:pl-0">
        {items.map((item, index) => (
          <div key={index}>
            <h3 className={`${FONTS.microgrammaBold.className} text-lg mb-2`}>
              {item.title}
            </h3>
            {typeof item.description === "string" ? (
              <p className="text-sm sm:text-base leading-relaxed">
                {item.description}
              </p>
            ) : (
              <div className="text-sm sm:text-base leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2">
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pr-30 max-md:pr-0">
        {finalQuote && (
          <div className="bg-primary text-accent rounded-xl py-10 px-16 max-md:py-8 max-md:px-6 mt-6">
            <p className={`${FONTS.microgrammaBold.className} tracking-wide text-lg sm:text-xl leading-relaxed`}>
              "{finalQuote}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
