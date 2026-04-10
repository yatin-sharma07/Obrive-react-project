import FONTS from "@/assets/fonts";
import { Button } from "@/components/ui/button";
import { WHY_SECTION_TYPE } from "@/constants/pages/why-section";
import Link from "next/link";

const WhySection = ({ link,why, title, button, description }: WHY_SECTION_TYPE) => {
  return (
    <section className="flex items-center justify-center">
      <div className="flex flex-col max-sm:text-center md:flex-row gap-8 max-sm:gap-2 md:gap-20 max-md:gap-0 lg:gap-40 w-full">
        <div className="w-[150px] max-md:w-full sm:py-8">
          <h3
            className={`${FONTS.microgrammaBold.className} mt-3 text-center text-primary `}
          >
            {why}
          </h3>
        </div>
        <div className="w-3xl max-md:w-full max-md:px-4 py-8 flex flex-col gap-4">
          <h2
            className={`${FONTS.microgrammaBold.className}  text-primary text-3xl max-md:text-2xl`}
          >
            {title}
          </h2>
          <p className="text-primary text-lg max-md:text-sm tracking-wider">
            {description}
          </p>

          <div className="mt-8">
            {link ? (
              <Button
                asChild
                variant={"outline"}
                size={"lg"}
                className="relative z-50 text-xs border-primary text-[10px] cursor-pointer text-primary uppercase"
              >
                <Link href={link}>{button}</Link>
              </Button>
            ) : (
              <Button
                variant={"outline"}
                size={"lg"}
                className="relative z-50 text-xs border-primary text-[10px] cursor-pointer text-primary uppercase"
              >
                <Link href="/faq/ob-product-faq">{button}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
