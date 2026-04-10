import FONTS from "@/assets/fonts";
import React from "react";

interface CareerItem {
  title?: string | React.ReactNode;
  description: string | React.ReactNode;
}

interface CareerSectionProps {
  title?: string | React.ReactNode;
  items: CareerItem[];
}

export default function CareerSection({
  title,
  items,
}: CareerSectionProps) {
  return (
    <section>
      {title && (
        <h2 className={`${FONTS.microgrammaBold.className} text-primary text-3xl mb-6`}>
          {title}
        </h2>
      )}
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index}>
            {item.title && (
              <h3 className={`${FONTS.microgrammaBold.className} text-primary text-lg mb-2`}>
                {item.title}
              </h3>
            )}
            {typeof item.description === "string" ? (
              <p className="text-sm leading-relaxed">{item.description}</p>
            ) : (
              <div className="text-sm leading-relaxed [&>ul]:list-disc [&>ol]:list-decimal">
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
