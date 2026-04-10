import React from "react";
import FONTS from "@/assets/fonts";
import { StyledText } from "@/components/shared/StyledText";
import FAQAccordionSection from "./sections/FAQAccordionSection";

export { FAQAccordionSection };

export const createFAQMDXComponents = (metadata: any) => ({
  h1: (props: any) => (
    <h1
      className="text-3xl font-bold text-gray-900 mb-6 leading-tight"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-2xl font-semibold text-gray-800 mb-5 leading-snug"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-xl font-medium text-gray-800 mb-4 leading-relaxed"
      {...props}
    />
  ),
  p: (props: any) => (
    <p className="text-base leading-relaxed text-gray-700 mb-4" {...props} />
  ),
  ul: (props: any) => (
    <ul
      className="list-disc list-inside text-gray-700 mb-4 space-y-1"
      {...props}
    >
      {props.children}
    </ul>
  ),
  li: (props: any) => (
    <li className="text-gray-700" {...props}>
      {props.children}
    </li>
  ),
  strong: (props: any) => (
    <span className="text-gray-700" {...props}>
      {props.children}
    </span>
  ),
  blockquote: (props: any) => (
    <div className="pr-30">
      <div className="bg-primary text-accent rounded-xl p-12 my-6">
        <p
          className={`${FONTS.microgrammaBold.className} text-xl leading-relaxed`}
        >
          {props.children}
        </p>
      </div>
    </div>
  ),

  FAQAccordionSection: (props: any) => <FAQAccordionSection {...props} />,

  StyledText,
});

export default createFAQMDXComponents;
