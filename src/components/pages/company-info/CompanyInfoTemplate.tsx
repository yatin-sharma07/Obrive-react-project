import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import { ReactNode } from "react";
import { CompanyInfoMetadata } from "@/lib/mdx";

interface CompanyInfoTemplateProps {
  metadata: CompanyInfoMetadata;
  children: ReactNode;
  type: "legal" | "support" | "security";
}

export default function CompanyInfoTemplate({
  children,
}: CompanyInfoTemplateProps) {
  return (
    <div>
      <FullWidthSection backgroundColor="none">
        <div className="max-w-[950px] mx-auto my-8 sm:my-16 lg:my-20 px-2 sm:px-8 lg:px-0">
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
            {/* MDX Content */}
            <div className="max-w-none flex flex-col gap-6 sm:gap-8 lg:gap-10">
              {children}
            </div>
          </div>
        </div>
      </FullWidthSection>
    </div>
  );
}
