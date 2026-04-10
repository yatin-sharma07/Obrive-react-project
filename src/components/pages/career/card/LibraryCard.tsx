import Image from "next/image";
import { JOIN_TEAM_LIBRARY_CARD_TYPE } from "@/constants/pages/career/library-card";
import FONTS from "@/assets/fonts";

export default function LibraryCard({
  src,
  srcMeta,
  title,
  date,
}: JOIN_TEAM_LIBRARY_CARD_TYPE) {
  return (
    <div className="rounded-xl gap-4 sm:gap-6 w-full sm:max-w-[425px] flex flex-col py-3 sm:py-4 px-4 sm:px-6 items-center justify-start">
      <div className="rounded-3xl w-[390px] max-md:w-full h-[346px] max-md:h-[220px] overflow-hidden">
        <Image
          src={src}
          width={srcMeta.width}
          height={srcMeta.height}
          alt={srcMeta.alt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full text-xs flex justify-between">
          <span>Industry</span>
          <span>{date}</span>
        </div>
        <div>
          <h3
            className={`${FONTS.microgrammaBold.className} text-primary text-sm`}
          >
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}
