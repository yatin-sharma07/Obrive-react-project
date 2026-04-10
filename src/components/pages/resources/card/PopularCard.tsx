import FONTS from "@/assets/fonts";
import { CASE_STUDIES_AVATAR } from "@/assets/images";
import { PopularCardContentType } from "@/constants/pages/resources/popular-card";
import Image from "next/image";
import Link from "next/link";

const PopularCard = ({
  src,
  alt,
  date,
  title,
  description,
  author,
  slug,
}: PopularCardContentType) => {
  return (
    <Link href={`/resources/${slug}`}>
      <div className="p-4 bg-accent rounded-xl flex gap-4 lg:gap-6 min-h-[180px] lg:min-h-[200px] cursor-pointer hover:bg-accent/80 transition-colors">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden min-w-[140px] max-w-[180px] lg:min-w-[200px] lg:max-w-[240px] flex-shrink-0">
          <Image src={src} fill alt={alt} className="object-cover" priority />
        </div>
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="flex text-xs items-center justify-between">
            <span>Blog</span>
            <span>{date}</span>
          </div>
          <div className="flex-1">
            <h3
              className={`${FONTS.microgrammaBold.className} text-sm lg:text-base text-primary leading-tight`}
            >
              {title}
            </h3>
            <p className="text-xs text-primary mt-2 lg:mt-3 line-clamp-2 lg:line-clamp-3">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-auto">
            <div className="w-8 h-8 lg:w-10 lg:h-10 overflow-hidden bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
              <Image
                src={CASE_STUDIES_AVATAR.AVATAR_ONE}
                alt="avatar"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-xs lg:text-sm truncate">{author}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PopularCard;
