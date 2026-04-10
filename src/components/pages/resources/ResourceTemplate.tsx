import FONTS from "@/assets/fonts";
import {
  CASE_STUDIES_AVATAR,
  CASE_STUDIES_IMAGES,
  CASE_STUDIES_IMAGES_META,
  RESOURCES_BLOG_IMAGES,
  RESOURCES_BLOG_IMAGES_META,
} from "@/assets/images";
import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { ReactNode } from "react";
import { CaseStudyMetadata } from "@/lib/mdx";
import ResourceWorkflowSteps from "./ResourceWorkflowSteps";
import Link from "next/link";
import BlogRecommendations from "./BlogRecommendations";

interface ResourceTemplateProps {
  metadata: CaseStudyMetadata;
  children: ReactNode;
  slug: string;
}

export default function ResourceTemplate({
  metadata,
  children,
  slug,
}: ResourceTemplateProps) {
  return (
    <div>
      {/* hero section */}
      <section>
        <FullWidthSection
          backgroundColor="accent"
          className="pt-20 sm:pt-28 lg:pt-38 pb-16 sm:pb-24 lg:pb-30 min-h-[80vh] sm:min-h-screen"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 px-4 sm:px-8 lg:px-13 items-start justify-between">
            <div className="relative flex flex-col gap-4 w-full lg:min-w-[400px] lg:max-w-[500px]">
              <div className="relative z-10">
                <Link
                  href="/resources"
                  className={`text-xs ${buttonVariants({ variant: "link" })}`}
                >
                  BACK
                </Link>
              </div>

              <div className="w-full max-sm:w-[300px] max-sm:h-[300px] h-64 sm:h-80 lg:h-90 rounded-2xl sm:flex items-center justify-center sm:relative">
                {(() => {
                  const blogImage =
                    RESOURCES_BLOG_IMAGES[
                      slug as keyof typeof RESOURCES_BLOG_IMAGES
                    ];
                  const blogImageMeta =
                    RESOURCES_BLOG_IMAGES_META[
                      slug as keyof typeof RESOURCES_BLOG_IMAGES_META
                    ];
                  const heroKey = metadata?.heroImage as
                    | keyof typeof CASE_STUDIES_IMAGES
                    | undefined;
                  const fallbackHero = heroKey
                    ? CASE_STUDIES_IMAGES[heroKey]
                    : undefined;
                  const heroSrc = blogImage ?? fallbackHero;
                  const altText = blogImage
                    ? blogImageMeta?.alt || metadata.title
                    : (heroKey && CASE_STUDIES_IMAGES_META[heroKey]?.alt) ||
                      metadata.title;
                  if (!heroSrc) return null;
                  return (
                    <Image
                      src={heroSrc}
                      alt={altText}
                      fill
                      className="object-contain pointer-events-none"
                      priority
                    />
                  );
                })()}
              </div>
            </div>

            <div className="space-y-4 lg:space-y-6 w-full lg:relative lg:top-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Button
                  className="text-[10px] rounded-full w-fit"
                  variant={"outline"}
                  size={"sm"}
                >
                  {metadata.postType || "CASE STUDY"}
                </Button>

                <span className="text-slate-700 text-xs font-medium">
                  {metadata.date}
                </span>
              </div>

              <h1
                className={`${FONTS.microgrammaBold.className} text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-secondary leading-tight`}
              >
                {metadata.title}
              </h1>

              <blockquote className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed">
                {(() => {
                  const quote = metadata?.quote || "";
                  const prefix = "Disclaimer:";
                  if (quote.startsWith(prefix)) {
                    return (
                      <>
                        <span className={`${FONTS.microgrammaBold.className}`}>
                          Disclaimer
                        </span>
                        {quote.slice(prefix.length)}
                      </>
                    );
                  }
                  return quote;
                })()}
              </blockquote>

              <div className="flex items-center gap-3 pt-2 sm:pt-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 overflow-hidden bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-xs">
                  <Image
                    src={CASE_STUDIES_AVATAR[metadata.avatar]}
                    alt="avatar"
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm sm:text-base">
                    {metadata.author}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FullWidthSection>
      </section>

      <FullWidthSection backgroundColor="none">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 xl:gap-40 my-8 sm:my-16 lg:my-20 px-4 sm:px-8 lg:px-0">
          {/* workflow steps sidebar */}
          {metadata.workflowSteps && metadata.workflowSteps.length > 0 && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ResourceWorkflowSteps steps={metadata.workflowSteps} />
            </div>
          )}

          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 flex-1">
            {/* MDX Content */}
            <div
              className="max-w-none lg:pr-8 xl:pr-16 flex flex-col gap-6 sm:gap-8 lg:gap-10"
              data-resource-content
            >
              {children}
            </div>
          </div>
        </div>
      </FullWidthSection>

      {/* Blog Recommendations */}
      <BlogRecommendations currentSlug={slug} maxRecommendations={2} />
    </div>
  );
}
