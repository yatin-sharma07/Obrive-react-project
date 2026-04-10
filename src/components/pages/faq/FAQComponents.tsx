'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
}

interface FAQSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FAQItem = ({ question, children }: FAQItemProps) => {
  return { question, children };
};

export const FAQSection = ({ title, children }: FAQSectionProps) => {
  const faqItems = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<FAQItemProps> =>
      React.isValidElement(child) && typeof child.type === 'function' && child.type.name === 'FAQItem'
  );

  return (
    <div className="mb-8" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <h2 className="text-2xl font-semibold text-teal-900 mb-6">{title}</h2>
      
      <Accordion type="single" collapsible className="space-y-4">
        {faqItems.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${title}-${index}`}
            className="bg-white rounded-lg border border-teal-200 shadow-sm hover:shadow-md transition-shadow"
            id={`question-${title.toLowerCase().replace(/\s+/g, '-')}-${index}`}
          >
            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
              <span className="text-teal-900 font-medium pr-4">
                {item.props.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="text-teal-700 leading-relaxed prose prose-teal max-w-none">
                {item.props.children}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
