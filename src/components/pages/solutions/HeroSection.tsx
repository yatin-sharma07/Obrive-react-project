import FONTS from "@/assets/fonts";
import React from "react";

export const HeroSection = () => {
  return (
    <div className="flex mt-40 items-center flex-col gap-26">
      <div className="w-4xl">
        <h1
          className={`${FONTS.microgrammaBold.className} text-center text-primary text-7xl`}
        >
          Augmented Reality Development Across Industries in Bangalore, India.
        </h1>
      </div>
      <div className="flex items-center relative">
        {/* <div className="flex flex-col w-[507px] items-start gap-2.5 pt-[25px] pb-2.5 px-2.5 relative self-stretch mt-[-1.00px] mb-[-1.00px] ml-[-1.00px] rounded-2xl border-[0.5px] border-solid border-[#00000080]">
        <div className="relative self-stretch w-full h-[58px]" />
      </div> */}

        <div className="flex flex-col w-[507px] items-start gap-2.5 pt-[25px] pb-2.5 px-2.5 relative self-stretch mt-[-1.00px] mb-[-1.00px] rounded-2xl border-[0.5px] border-solid border-primary/40">
          <div className="flex h-[58px] items-center gap-2.5 p-2.5 relative self-stretch w-full">
            <div className="relative w-fit mt-[-2.00px] font-normal text-sm text-zinc-500">
              Overview
            </div>
          </div>
        </div>

        <div className="inline-flex flex-col items-center justify-center gap-2.5 pl-6 pr-[90px] pt-4 pb-6 relative flex-[0_0_auto] mt-[-1.00px] mb-[-1.00px] rounded-2xl border-[0.5px] border-solid border-primary/40">
          <div className="flex w-[804px] items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto]">
            <p className="relative w-[804px] mt-[-1.00px] ml-[-4.50px] mr-[-4.50px] font-normal text-base tracking-[1.00px] leading-7">
              Traditional workflows across industries—from manufacturing to
              healthcare to training—often rely on physical prototyping,
              manuals, and static visuals. These methods can be slow,
              error-prone, and lack engagement.
              <br />
              <br />
              Obrive Industries transforms this with immersive Augmented Reality
              solutions that boost operational efficiency, enhance user
              engagement, and accelerate training and adoption. Our tailored AR
              tools provide intuitive, real-time guidance, seamlessly overlaying
              digital insights onto the physical world—right where you need
              them.
            </p>
          </div>
        </div>

        {/* <div className="flex flex-col w-[507px] items-start gap-2.5 pt-[25px] pb-2.5 px-2.5 relative self-stretch mt-[-1.00px] mb-[-1.00px] mr-[-1.00px] rounded-2xl border-[0.5px] border-solid border-[#00000080]">
        <div className="relative self-stretch w-full h-[58px]" />
      </div> */}
      </div>
    </div>
  );
};
