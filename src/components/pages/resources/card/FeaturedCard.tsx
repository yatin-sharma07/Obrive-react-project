import FONTS from "@/assets/fonts";
import {
  CASE_STUDIES_AVATAR,
  RESOURCES_NEWS_IMAGES,
  RESOURCES_NEWS_IMAGES_META,
} from "@/assets/images";
import Image from "next/image";

const FeaturedCard = () => {
  return (
    <div className="rounded-xl gap-4 sm:gap-6 w-full sm:max-w-[680px] flex flex-col p-4 items-center justify-start">
      <div className="rounded-3xl w-full h-[446px] overflow-hidden">
        <Image
          src={RESOURCES_NEWS_IMAGES.PARKING_IMG}
          width={RESOURCES_NEWS_IMAGES_META.PARKING_IMG.width}
          height={RESOURCES_NEWS_IMAGES_META.PARKING_IMG.height}
          alt={RESOURCES_NEWS_IMAGES_META.PARKING_IMG.alt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full px-7 text-sm flex justify-between">
          <span>News</span>
          <span>25.07.2025</span>
        </div>
        <div className="px-3">
          <h3 className={`${FONTS.microgrammaBold.className} text-[1.6rem]`}>
            Obrive Industries Launches OBPARK– A Next-Gen AR/MR Parking
            Navigation System.
          </h3>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-12 h-12 overflow-hidden bg-slate-300 rounded-full flex items-center justify-center">
            <Image
              src={CASE_STUDIES_AVATAR.AVATAR_ONE}
              alt="avatar"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <p className="text-sm">PR AGENCY INDIA</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;
