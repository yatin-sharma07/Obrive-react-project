import FONTS from "@/assets/fonts";
import {
  BACKGROUND_IMAGE,
  BACKGROUND_IMAGE_META,
  IMAGES,
} from "@/assets/images";
import { QUOTES_TYPE } from "@/constants/pages/products/quotes";
import Image from "next/image";

export default function ProductPageCard({ quote, author, authorImage }: QUOTES_TYPE) {
  return (
    <div className="w-[1238px] max-md:w-full border bg-none border-zinc-800 rounded-2xl flex max-md:flex-col overflow-hidden">
      <div className="p-8 max-md:p-4 flex flex-col gap-4 w-3xl max-md:w-full">
        {authorImage && (
          <Image
            src={authorImage}
            alt={author}
            width={200}
            height={200}
            className="w-[200px] h-[200px] max-md:w-[120px] max-md:h-[120px] rounded-xl"
          />
        )}
        {!authorImage && (
          <Image
            src={IMAGES.DUMMY_IMAGE}
            alt="dummy image"
            width={200}
            height={200}
            className="w-[200px] h-[200px] max-md:w-[120px] max-md:h-[120px] rounded-xl"
          />
        )}
        <div className="sm:px-4">
          <p className="text-left max-sm:text-xs text-primary/80">{quote}</p>
          <h3
            className={`${FONTS.microgrammaBold.className} text-primary mt-4 text-left text-lg`}
          >
            {author}
          </h3>
        </div>
      </div>

      <div className="relative top-4 pointer-events-none max-md:hidden">
        <Image
          src={BACKGROUND_IMAGE.CARD_STACK}
          alt={BACKGROUND_IMAGE_META.CARD_STACK.alt}
          width={BACKGROUND_IMAGE_META.CARD_STACK.width}
          height={BACKGROUND_IMAGE_META.CARD_STACK.height}
        />
      </div>
    </div>
  );
}
