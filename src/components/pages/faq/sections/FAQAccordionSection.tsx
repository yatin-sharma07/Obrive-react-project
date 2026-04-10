import React from "react";
import DOMPurify from "dompurify";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionSectionProps {
  title?: string;
  items: FAQItem[];
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export default function FAQAccordionSection({
  title,
  items,
}: FAQAccordionSectionProps) {
  const sanitizeHTML = (html: string): string => {
    if (typeof window !== "undefined") {
      return DOMPurify.sanitize(html);
    }
    return html;
  };

  return (
    <section
      className="mb-6"
      id={title ? slugify(title) : undefined}
    >
      {title && <p className="text-base mb-4 text-gray-700">{title}</p>}

      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <Accordion type="single" collapsible className="space-y-0">
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="text-sm pr-4 text-secondary">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="text-sm leading-relaxed text-gray-700">
                  {typeof item.answer === "string" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(item.answer),
                      }}
                    />
                  ) : (
                    <div className="[&>ul]:list-disc [&>ul]:list-outside [&>ul]:pl-8 [&>ul]:space-y-2">
                      {item.answer}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
