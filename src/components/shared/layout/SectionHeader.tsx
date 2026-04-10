import React from "react";
import RoundedBallIcon from "../icons/RoundedBallIcon";
import FONTS from "@/assets/fonts";

const SectionHeader = ({
  title,
  description,
  iconText,
}: {
  title: string;
  description?: string;
  iconText?: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-14 max-md:gap-8">
      <div className="flex flex-col items-center gap-2">
        <RoundedBallIcon />
        <span className="uppercase text-xs font-medium">{iconText}</span>
      </div>
      <div className="w-5xl max-md:w-full flex flex-col items-center gap-4 max-md:px-4">
        <h3
          className={`${FONTS.microgrammaBold.className} tracking-wider text-primary text-center text-5xl max-md:text-3xl`}
        >
          {title}
        </h3>
        <p className="text-center text-primary w-xl max-md:w-full max-md:text-sm">{description}</p>
      </div>
    </div>
  );
};

export default SectionHeader;
