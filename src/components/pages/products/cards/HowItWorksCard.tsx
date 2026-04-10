import FONTS from "@/assets/fonts";
import { IMAGES, IMAGES_META } from "@/assets/images";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HOW_IT_WORK_TYPE } from "@/constants/pages/products/how-it-work";

type HowItWorksCardProps = HOW_IT_WORK_TYPE & {
  variant?: "default" | "right";
};

export default function HowItWorksCard({
  title,
  description,
  step,
  image,
  variant = "default",
}: HowItWorksCardProps) {
  const titleClasses =
    variant === "right" ? "" : `border-y border-primary/40 py-8`;

  return (
    <div className={`${titleClasses} flex gap-8 items-center max-md:flex-col max-md:gap-4`}>
      {image && (
        <Image
          src={image}
          alt={`${title} - ${step}`}
          width={300}
          height={300}
          className="w-[300px] h-[300px] max-sm:w-[400px] max-sm:h-[400px] max-md:w-[160px] max-md:h-[120px] object-contain rounded-xl"
        />
      )}
      {!image && (
        <Image
          src={IMAGES.DUMMY_IMAGE}
          alt={IMAGES_META.DUMMY_IMAGE.alt}
          width={300}
          height={300}
          className="w-[300px] h-[300px] max-sm:w-[400px] max-sm:h-[400px] max-md:w-[160px] max-md:h-[120px] object-contain rounded-xl"
        />
      )}

      <div className="flex items-start flex-col gap-4 w-full">
        <Button
          variant={"outline"}
          size={"lg"}
          className="rounded-full bg-transparent! hover:bg-transparent! uppercase text-[10px]"
        >
          {step}
        </Button>
        <h3
          className={`${FONTS.microgrammaBold.className} text-primary text-center text-lg max-md:text-left`}
        >
          {title}
        </h3>
        <p className="text-sm w-lg max-md:w-full leading-7 max-md:text-left">
          {description}
        </p>
      </div>
    </div>
  );
}
