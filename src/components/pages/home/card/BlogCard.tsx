import FONTS from "@/assets/fonts";
import { HomeCardBlog } from "@/constants/pages/home/home-card";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({
  imageSrc,
  imgWidth,
  imgHeight,
  imgAlt,
  title,
  date,
  slug,
  description,
}: HomeCardBlog) {
  return (
    <Link
      href={`/resources/${slug}`}
      className="group block"
      aria-label={`Read more about ${title}`}
    >
      <div className="group bg-card rounded-2xl p-6 w-full sm:max-w-[425px] transition-colors duration-200 ease-in-out transform will-change-transform hover:-translate-y-0.5 hover:shadow-lg group-hover:bg-accent">
        <div className="relative rounded-xl overflow-hidden mb-6">
          <Image
            src={imageSrc}
            width={imgWidth}
            height={imgHeight}
            alt={imgAlt}
            className="object-cover w-full block transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm opacity-0 translate-y-2 group-hover:opacity-100 group-focus-within:opacity-100 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-all duration-300 pointer-events-none">
            <span className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-black/40">
              Read more
            </span>
          </div>
        </div>

        <div className="flex text-xs items-center justify-between px-3 mb-4 text-muted-foreground">
          <span className="uppercase tracking-wide">BLOG</span>
          <span>{date}</span>
        </div>

        <div className="space-y-3">
          <h3
            className={`${FONTS.microgrammaBold.className} text-lg font-bold text-foreground leading-tight transition-colors duration-200 group-hover:text-accent-foreground`}
          >
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-accent-foreground/90">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
