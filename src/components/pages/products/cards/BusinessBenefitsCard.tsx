import FONTS from "@/assets/fonts";
import { ICONS, ICONS_META } from "@/assets/images";
import Image from "next/image";

type BenefitItem = {
  title: string;
  description: string;
};

export default function BusinessBenefitsCard({
  items,
  bottomNote,
}: {
  items: readonly BenefitItem[];
  bottomNote?: string;
}) {
  return (
    <div className="w-full lg:w-[523px] bg-white h-fit pb-8 rounded-2xl shadow-xl">
      <div className="flex flex-col gap-5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <div
              key={`${item.title}-${idx}`}
              className={`${idx === 0 ? "mt-4" : ""} px-6 ${isLast ? "pb-0" : "pb-6 border-b border-primary/40"} ${idx === 0 ? "py-3" : ""}`}
            >
              <h3
                className={`${FONTS.microgrammaBold.className} text-primary text-md`}
              >
                {item.title}
              </h3>
              <p className="text-xs max-w-md leading-5">{item.description}</p>
            </div>
          );
        })}
        {bottomNote ? (
          <div className="mt-8 px-6 sm:px-10">
            <div className="flex items-center justify-center gap-4 bg-accent rounded-xl py-4 px-4">
              <Image
                src={ICONS.QUOTE_ICON}
                alt={ICONS_META.QUOTE_ICON.alt}
                width={ICONS_META.QUOTE_ICON.width}
                height={ICONS_META.QUOTE_ICON.height}
                className="w-13 h-13"
              />
              <p className="text-[14px] max-sm:text-[10px]">{bottomNote}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
