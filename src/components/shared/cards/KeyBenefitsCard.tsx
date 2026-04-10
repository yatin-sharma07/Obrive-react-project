import FONTS from "@/assets/fonts";
import { KEY_BENEFITS_TYPE } from "@/constants/pages/key-benefits";
import Image from "next/image";
import React from "react";

export const KeyBenefitsCard = ({
  title,
  description,
  src,
  srcMeta,
}: KEY_BENEFITS_TYPE) => {
  return (
    <article className="flex flex-col w-[509px] h-[433px] items-start gap-4 pl-9 pr-[20px] pb-5 relative bg-white rounded-2xl border-[0.5px] border-primary max-lg:w-[460px] max-md:w-full max-md:h-[360px] max-md:px-6 max-md:py-6">
      <div className="flex flex-col w-[416px] h-full justify-between items-start gap-[200px] relative flex-1 max-lg:w-full max-md:w-full max-md:gap-8">
        <div className="inline-flex items-center justify-center gap-2.5 top-4 relative">
          <Image
            alt={srcMeta.alt}
            src={src}
            width={srcMeta.width}
            height={srcMeta.height}
          />
        </div>

        <div className="flex flex-col items-start w-full relative gap-4 flex-1">
          <header className="inline-flex justify-center px-2.5 py-1 items-center gap-2.5 relative flex-[0_0_auto]">
            <h2
              className={`${FONTS.microgrammaBold.className} relative w-fit mt-[-1.00px] text-primary text-[23px] max-md:text-[20px] tracking-[0.46px] leading-[30px]`}
            >
              {title}
            </h2>
          </header>

          <div className="flex mb-2 pb-2.5 pl-2.5 self-stretch w-full items-center gap-2.5 relative flex-1 max-md:p-0">
            <p className="relative w-[416px] max-md:w-full mt-[-1.00px] mr-[-20.00px] max-md:mr-0 font-medium text-primary text-sm  leading-[26px] max-md:leading-[24px]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
