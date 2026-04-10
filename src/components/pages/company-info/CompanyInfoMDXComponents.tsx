import React from "react";
import FONTS from "@/assets/fonts";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StyledText } from "@/components/shared/StyledText";
import CompanyInfoSection from "./sections/CompanyInfoSection";
import CompanyInfoApproachTable from "./sections/CompanyInfoApproachTable";
import CompanyInfoHeader from "./sections/CompanyInfoHeader";

// Export components for direct import in MDX files
export { CompanyInfoSection, CompanyInfoApproachTable, CompanyInfoHeader };

// Create a function that returns MDX components with access to metadata
export const createCompanyInfoMDXComponents = (metadata: any) => ({
  h1: (props: any) => (
    <h1
      className={`${FONTS.microgrammaBold.className} text-4xl mb-6 mt-8`}
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className={`${FONTS.microgrammaBold.className} text-3xl mb-4 mt-6`}
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className={`${FONTS.microgrammaBold.className} text-lg mb-2 mt-4`}
      {...props}
    />
  ),
  h4: (props: any) => (
    <h4
      className={`${FONTS.microgrammaBold.className} text-sm mb-2 mt-3`}
      {...props}
    />
  ),
  p: (props: any) => (
    <p className="text-sm leading-relaxed text-gray-700 mb-4" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal pl-6 space-y-2 mb-4" {...props} />
  ),
  li: (props: any) => (
    <li className="text-sm leading-relaxed text-gray-700" {...props} />
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
  strong: (props: any) => (
    <strong className={`${FONTS.microgrammaBold.className}`} {...props} />
  ),
  em: (props: any) => <em className="italic" {...props} />,

  // Custom company-info components
  CompanyInfoSection: (props: any) => <CompanyInfoSection {...props} />,
  CompanyInfoApproachTable: (props: any) => (
    <CompanyInfoApproachTable {...props} />
  ),
  CompanyInfoHeader: (props: any) => <CompanyInfoHeader {...props} />,

  // Backward compatibility - shorter names
  InfoSection: (props: any) => <CompanyInfoSection {...props} />,
  ApproachTable: (props: any) => <CompanyInfoApproachTable {...props} />,
  PageHeader: (props: any) => <CompanyInfoHeader {...props} />,

  // Custom components
  ButtonLink,
  StyledText,
});

export default {
  h1: (props: any) => (
    <h1
      className={`${FONTS.microgrammaBold.className} text-4xl mb-6 mt-8`}
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className={`${FONTS.microgrammaBold.className} text-3xl mb-4 mt-6`}
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className={`${FONTS.microgrammaBold.className} text-lg mb-2 mt-4`}
      {...props}
    />
  ),
  h4: (props: any) => (
    <h4
      className={`${FONTS.microgrammaBold.className} text-sm mb-2 mt-3`}
      {...props}
    />
  ),
  p: (props: any) => (
    <p className="text-sm leading-relaxed text-gray-700 mb-4" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal pl-6 space-y-2 mb-4" {...props} />
  ),
  li: (props: any) => (
    <li className="text-sm leading-relaxed text-gray-700" {...props} />
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
  strong: (props: any) => (
    <strong className={`${FONTS.microgrammaBold.className}`} {...props} />
  ),
  em: (props: any) => <em className="italic" {...props} />,
  StyledText,
  ButtonLink,
};
