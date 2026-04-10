import FONTS from "@/assets/fonts";
import { BlogCardContent } from "@/constants/pages/resources/blog-card";
import Image from "next/image";
import Link from "next/link";

interface BlogRecommendationsProps {
  currentSlug: string;
  maxRecommendations?: number;
}

export default function BlogRecommendations({
  currentSlug,
  maxRecommendations = 2,
}: BlogRecommendationsProps) {
  const currentIndex = BlogCardContent.findIndex(
    (blog) => blog.slug === currentSlug
  );

  const recommendations = Array.from({ length: maxRecommendations }, (_, i) => {
    const nextIndex = (currentIndex + i + 1) % BlogCardContent.length;
    return BlogCardContent[nextIndex];
  });

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-black/15 divide-y divide-black/15 md:divide-y-0 md:divide-x">
        {recommendations.map((blog) => (
          <article
            key={blog.slug}
            className="group relative flex h-full px-6 sm:px-10 md:px-30 py-8 md:py-0"
          >
            {/* img hover effect */}
            <div
              className="hidden md:flex justify-center items-center absolute bottom-0 left-0 w-full bg-gradient overflow-hidden pointer-events-none z-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
              aria-hidden="true"
            >
              <div className="relative w-full flex items-center justify-center pt-20 max-w-[43.5rem] overflow-hidden rounded-2xl mb-5">
                <div className="relative w-[50%] pt-[85%] flex items-center justify-center">
                  <Image
                    src={blog.src}
                    alt={blog.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover w-full max-h-[300px] rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <Link
              href={`/resources/${blog.slug}`}
              className="flex flex-col md:flex-row justify-center w-full gap-6 md:gap-0 px-0 pt-2 pb-6 sm:pt-6 sm:pb-10 md:py-28 relative z-10"
              aria-label={`Read blog: ${blog.title}`}
            >
              <div className="md:hidden relative w-full overflow-hidden rounded-2xl bg-accent/20 aspect-[4/3]">
                <Image
                  src={blog.src}
                  alt={blog.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={false}
                />
              </div>

              <div className="flex flex-col items-start w-full md:max-w-[43.5rem] px-0 sm:px-2 md:px-0">
                <div className="flex items-start justify-between w-full mb-5">
                  <span className="rounded-full inline-flex h-9 md:h-10 items-center whitespace-nowrap px-3 md:px-4 text-xs font-mono uppercase border border-current">
                    BLOG
                  </span>
                  <time className="text-sm" dateTime={blog.date}>
                    {blog.date}
                  </time>
                </div>
                <h2
                  className={`${FONTS.microgrammaBold.className} w-full md:max-w-[32.5rem] text-lg sm:text-xl lg:text-2xl leading-snug text-balance`}
                >
                  {blog.title}
                </h2>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}