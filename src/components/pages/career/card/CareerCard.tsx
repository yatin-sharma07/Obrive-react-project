import FONTS from "@/assets/fonts";
import { CAREER_CARD_TYPE } from "@/constants/pages/career/career-card";
import Link from "next/link";

const CareerCard = ({ title, date, slug }: CAREER_CARD_TYPE) => {
  return (
    <Link href={`/career/${slug}`}>
      <div className="w-full max-w-[400px] h-[350px] max-md:h-[280px] bg-white rounded-xl p-6 max-md:p-4 flex flex-col justify-between">
        <div>
          <h1
            className={`${FONTS.microgrammaBold.className} text-primary text-2xl max-md:text-xl`}
          >
            {title}
          </h1>
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <h2
              className={`${FONTS.microgrammaBold.className} text-primary text-lg max-md:text-base`}
            >
              Obrive.com Bangalore, India
            </h2>
            <p className="text-sm mt-1 max-md:text-xs">Posted on {date}</p>
          </div>
          <div>
            <p className="text-sm max-md:text-xs">Full-time: Remote/On-site</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CareerCard;
