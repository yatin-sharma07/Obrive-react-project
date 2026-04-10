import FONTS from "@/assets/fonts";
import { GIVING_BACK_CARD_TYPE } from "@/constants/pages/career/giving-back-card";

const GivingBackCard = ({
  title,
  description,
  number,
}: GIVING_BACK_CARD_TYPE) => {
  return (
    <div className="bg-gradient w-[390px] max-md:w-full rounded-xl">
      <div className="flex items-center px-6 py-4 justify-between border-b-2 border-primary/40 ">
        <h2 className={`${FONTS.microgrammaBold.className}`}>{title}</h2>
        <p className="text-xs">{number}</p>
      </div>
      <div className="px-6 py-4 pr-20 pb-8 border-b-2 border-primary/40">
        <p className="text-xs leading-7">{description}</p>
      </div>
      <div className="py-4" />
    </div>
  );
};

export default GivingBackCard;
