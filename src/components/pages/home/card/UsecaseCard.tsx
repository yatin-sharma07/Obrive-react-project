import { Button } from "@/components/ui/button";
import FONTS from "@/assets/fonts";
import AnimatedButton from "@/components/shared/buttons/AnimatedButton";
import { HomeCard } from "@/constants/pages/home/home-card";

export default function UsecaseCard({
  title,
  description,
  icon,
  use,
  url,
}: HomeCard) {
  const Icon = icon;
  return (
    <div className="w-full sm:w-[450px] md:w-[550px] lg:w-[580px] py-6 sm:py-6 px-6 sm:px-10 lg:px-8 min-h-[320px] rounded-2xl bg-gradient cursor-default">
      <div className="flex justify-between">
        <Icon />
        <Button
          className={`${FONTS.microgrammaBold.className} bg-transparent! hover:bg-transparent! text-primary rounded-full`}
          size={"lg"}
          variant={"outline"}
        >
          {use}
        </Button>
      </div>
      <div className="flex flex-col gap-4 mt-5 pr-0 sm:pr-6 lg:pr-11">
        <h3
          className={`${FONTS.microgrammaBold.className} text-lg text-primary`}
        >
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-700">{description}</p>
        <AnimatedButton
          asChild
          size={"lg"}
          className="text-[10px] mt-4 uppercase cursor-pointer w-fit"
          iconSize={14}
          href={url}
          aria-label={`Learn more about ${title}`}
        >
          Learn More
        </AnimatedButton>
      </div>
    </div>
  );
}
