import FONTS from "@/assets/fonts";
import {
  BACKGROUND_IMAGE,
  BACKGROUND_IMAGE_META,
  ICONS,
  ICONS_META,
} from "@/assets/images";
import Image from "next/image";
import { forwardRef } from "react";

interface ObjectiveCardProps {
  className?: string;
}

const ObjectiveCard = forwardRef<HTMLDivElement, ObjectiveCardProps>(
  ({ className = "" }, ref) => {
    return (
      <div 
        ref={ref}
        className={`flex gap-10 transition-transform duration-500 ease-in-out ${className}`}
      >
      <div className="w-[1238px] border bg-none border-zinc-800 rounded-2xl flex overflow-hidden">
        <div className="p-8 flex flex-col gap-4 w-3xl">
          <Image
            src={ICONS.TARGET_ICON}
            alt={ICONS_META.TARGET_ICON.alt}
            width={ICONS_META.TARGET_ICON.width}
            height={ICONS_META.TARGET_ICON.height}
          />
          <div className="px-4">
            <p className="text-left text-base text-primary/80">
              With industries rapidly embracing digital transformation, our
              outlook is crystal clear: be the partner of choice for businesses
              that want to stay ahead in the immersive era
              <br /> <br />
              We envision a world where: Parking navigation becomes effortless
              with AR overlays. Property buying happens through immersive 3D VR
              experiences. <br /> Retail thrives through interactive product
              visualization. Enterprises train employees in safe, simulated MR
              environments. <br />
              <br />
              Obrive is building the tools of tomorrow, today—solutions that
              scale with industry needs and prepare businesses for the spatial
              computing revolution.
            </p>
            <h3
              className={`${FONTS.microgrammaBold.className} text-primary mt-4 text-left text-lg`}
            >
              - Objective
            </h3>
          </div>
        </div>

        <div className="relative top-4 pointer-events-none">
          <Image
            src={BACKGROUND_IMAGE.CARD_STACK}
            alt={BACKGROUND_IMAGE_META.CARD_STACK.alt}
            width={BACKGROUND_IMAGE_META.CARD_STACK.width}
            height={BACKGROUND_IMAGE_META.CARD_STACK.height}
          />
        </div>
      </div>
      <div className="w-[1238px] border bg-none border-zinc-800 rounded-2xl flex overflow-hidden">
        <div className="p-8 flex flex-col gap-4 w-3xl">
          <Image
            src={ICONS.TARGET_ICON}
            alt={ICONS_META.TARGET_ICON.alt}
            width={ICONS_META.TARGET_ICON.width}
            height={ICONS_META.TARGET_ICON.height}
          />
          <div className="px-4">
            <p className="text-left text-base text-primary/80">
              With industries rapidly embracing digital transformation, our
              outlook is crystal clear: be the partner of choice for businesses
              that want to stay ahead in the immersive era
              <br /> <br />
              We envision a world where: Parking navigation becomes effortless
              with AR overlays. Property buying happens through immersive 3D VR
              experiences. <br /> Retail thrives through interactive product
              visualization. Enterprises train employees in safe, simulated MR
              environments. <br />
              <br />
              Obrive is building the tools of tomorrow, today—solutions that
              scale with industry needs and prepare businesses for the spatial
              computing revolution.
            </p>
            <h3
              className={`${FONTS.microgrammaBold.className} text-primary mt-4 text-left text-lg`}
            >
              - Objective
            </h3>
          </div>
        </div>

        <div className="relative top-4 pointer-events-none">
          <Image
            src={BACKGROUND_IMAGE.CARD_STACK}
            alt={BACKGROUND_IMAGE_META.CARD_STACK.alt}
            width={BACKGROUND_IMAGE_META.CARD_STACK.width}
            height={BACKGROUND_IMAGE_META.CARD_STACK.height}
          />
        </div>
      </div>
      <div className="w-[1238px] border bg-none border-zinc-800 rounded-2xl flex overflow-hidden">
        <div className="p-8 flex flex-col gap-4 w-3xl">
          <Image
            src={ICONS.TARGET_ICON}
            alt={ICONS_META.TARGET_ICON.alt}
            width={ICONS_META.TARGET_ICON.width}
            height={ICONS_META.TARGET_ICON.height}
          />
          <div className="px-4">
            <p className="text-left text-base text-primary/80">
              With industries rapidly embracing digital transformation, our
              outlook is crystal clear: be the partner of choice for businesses
              that want to stay ahead in the immersive era
              <br /> <br />
              We envision a world where: Parking navigation becomes effortless
              with AR overlays. Property buying happens through immersive 3D VR
              experiences. <br /> Retail thrives through interactive product
              visualization. Enterprises train employees in safe, simulated MR
              environments. <br />
              <br />
              Obrive is building the tools of tomorrow, today—solutions that
              scale with industry needs and prepare businesses for the spatial
              computing revolution.
            </p>
            <h3
              className={`${FONTS.microgrammaBold.className} text-primary mt-4 text-left text-lg`}
            >
              - Objective
            </h3>
          </div>
        </div>

        <div className="relative top-4 pointer-events-none">
          <Image
            src={BACKGROUND_IMAGE.CARD_STACK}
            alt={BACKGROUND_IMAGE_META.CARD_STACK.alt}
            width={BACKGROUND_IMAGE_META.CARD_STACK.width}
            height={BACKGROUND_IMAGE_META.CARD_STACK.height}
          />
        </div>
      </div>
      <div className="w-[1238px] border bg-none border-zinc-800 rounded-2xl flex overflow-hidden">
        <div className="p-8 flex flex-col gap-4 w-3xl">
          <Image
            src={ICONS.TARGET_ICON}
            alt={ICONS_META.TARGET_ICON.alt}
            width={ICONS_META.TARGET_ICON.width}
            height={ICONS_META.TARGET_ICON.height}
          />
          <div className="px-4">
            <p className="text-left text-base text-primary/80">
              With industries rapidly embracing digital transformation, our
              outlook is crystal clear: be the partner of choice for businesses
              that want to stay ahead in the immersive era
              <br /> <br />
              We envision a world where: Parking navigation becomes effortless
              with AR overlays. Property buying happens through immersive 3D VR
              experiences. <br /> Retail thrives through interactive product
              visualization. Enterprises train employees in safe, simulated MR
              environments. <br />
              <br />
              Obrive is building the tools of tomorrow, today—solutions that
              scale with industry needs and prepare businesses for the spatial
              computing revolution.
            </p>
            <h3
              className={`${FONTS.microgrammaBold.className} text-primary mt-4 text-left text-lg`}
            >
              - Objective
            </h3>
          </div>
        </div>

        <div className="relative top-4 pointer-events-none">
          <Image
            src={BACKGROUND_IMAGE.CARD_STACK}
            alt={BACKGROUND_IMAGE_META.CARD_STACK.alt}
            width={BACKGROUND_IMAGE_META.CARD_STACK.width}
            height={BACKGROUND_IMAGE_META.CARD_STACK.height}
          />
        </div>
      </div>
      <div className="w-[1238px] border bg-none border-zinc-800 rounded-2xl flex overflow-hidden">
        <div className="p-8 flex flex-col gap-4 w-3xl">
          <Image
            src={ICONS.TARGET_ICON}
            alt={ICONS_META.TARGET_ICON.alt}
            width={ICONS_META.TARGET_ICON.width}
            height={ICONS_META.TARGET_ICON.height}
          />
          <div className="px-4">
            <p className="text-left text-base text-primary/80">
              With industries rapidly embracing digital transformation, our
              outlook is crystal clear: be the partner of choice for businesses
              that want to stay ahead in the immersive era
              <br /> <br />
              We envision a world where: Parking navigation becomes effortless
              with AR overlays. Property buying happens through immersive 3D VR
              experiences. <br /> Retail thrives through interactive product
              visualization. Enterprises train employees in safe, simulated MR
              environments. <br />
              <br />
              Obrive is building the tools of tomorrow, today—solutions that
              scale with industry needs and prepare businesses for the spatial
              computing revolution.
            </p>
            <h3
              className={`${FONTS.microgrammaBold.className} text-primary mt-4 text-left text-lg`}
            >
              - Objective
            </h3>
          </div>
        </div>

        <div className="relative top-4 pointer-events-none">
          <Image
            src={BACKGROUND_IMAGE.CARD_STACK}
            alt={BACKGROUND_IMAGE_META.CARD_STACK.alt}
            width={BACKGROUND_IMAGE_META.CARD_STACK.width}
            height={BACKGROUND_IMAGE_META.CARD_STACK.height}
          />
        </div>
      </div>
    </div>
    );
  }
);

ObjectiveCard.displayName = "ObjectiveCard";

export default ObjectiveCard;
