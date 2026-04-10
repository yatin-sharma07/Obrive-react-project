import React from "react";
import FONTS from "@/assets/fonts";
import { StyledText } from "@/components/shared/StyledText";
import CareerSection from "./sections/CareerSection";
import CareerHeader from "./sections/CareerHeader";
import { CareerButton } from "@/components/shared/CareerButton";

export { CareerSection, CareerHeader, CareerButton };

export const createCareerMDXComponents = (metadata: any) => ({
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
  p: (props: any) => <p className="text-sm leading-relaxed mb-4" {...props} />,
  ul: (props: any) => (
    <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal pl-6 space-y-2 mb-4" {...props} />
  ),
  li: (props: any) => <li className="text-sm leading-relaxed" {...props} />,
  blockquote: (props: any) => (
    <div className="pr-30">
      <div className="bg-primary text-accent rounded-xl p-12 my-6">
        <div
          className={`${FONTS.microgrammaBold.className} text-xl leading-relaxed`}
        >
          {props.children}
        </div>
      </div>
    </div>
  ),
  strong: (props: any) => (
    <strong className={`${FONTS.microgrammaBold.className}`} {...props} />
  ),
  em: (props: any) => <em className="italic" {...props} />,

  CareerSection: (props: any) => <CareerSection {...props} />,
  CareerHeader: (props: any) => <CareerHeader {...props} />,

  JobSection: (props: any) => <CareerSection {...props} />,
  JobHeader: (props: any) => <CareerHeader {...props} />,

  CareerButton,
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
  p: (props: any) => <p className="text-sm leading-relaxed mb-4" {...props} />,
  ul: (props: any) => (
    <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal pl-6 space-y-2 mb-4" {...props} />
  ),
  li: (props: any) => <li className="text-sm leading-relaxed" {...props} />,
  blockquote: (props: any) => (
    <div className="pr-30">
      <div className="bg-primary text-accent rounded-xl p-12 my-6">
        <div
          className={`${FONTS.microgrammaBold.className} text-xl leading-relaxed`}
        >
          {props.children}
        </div>
      </div>
    </div>
  ),
  strong: (props: any) => (
    <strong className={`${FONTS.microgrammaBold.className}`} {...props} />
  ),
  em: (props: any) => <em className="italic" {...props} />,
  StyledText,
  CareerButton,
};
