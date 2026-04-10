import FONTS from "@/assets/fonts";
import { BACKGROUND_IMAGE, BACKGROUND_IMAGE_META } from "@/assets/images";
import Image from "next/image";
import React from "react";
import { JoinTeamCardType } from "@/constants/pages/career/join-team-card";

const JoinTeamCards = ({
  title,
  description_one,
  description_two,
  description_three,
}: JoinTeamCardType[0]) => {
  return (
    <div className="w-[1238px] max-md:w-full border bg-none min-h-[481px] border-zinc-800 rounded-2xl flex max-md:flex-col overflow-hidden">
      <div className="p-4 max-md:p-4 flex flex-col gap-4 w-3xl max-md:w-full">
        <div className="px-4">
          <h3
            className={`${FONTS.microgrammaBold.className} text-primary mt-4 text-left text-lg`}
          >
            {title}
          </h3>
          <p className="text-left mt-8 text-sm text-primary/90">
            {description_one}
            <br /> <br />
            {description_two}
            <br /> <br />
            {description_three}
          </p>
        </div>
      </div>

      <div className="relative top-0 -left-10 pointer-events-none max-md:hidden">
        <Image
          src={BACKGROUND_IMAGE.CARD_STACK}
          alt={BACKGROUND_IMAGE_META.CARD_STACK.alt}
          width={BACKGROUND_IMAGE_META.CARD_STACK.width}
          height={BACKGROUND_IMAGE_META.CARD_STACK.height}
          className=""
        />
      </div>
    </div>
  );
};

export default JoinTeamCards;
