import FONTS from "@/assets/fonts";

interface ResourceCompanyOverviewSectionProps {
  title?: string;
  content?: string;
  quote?: string;
}

export default function ResourceCompanyOverviewSection({
  title,
  content,
  quote,
}: ResourceCompanyOverviewSectionProps) {
  return (
    <section className="my-10 space-y-6">
      <h2
        className={`${FONTS.microgrammaBold.className} text-2xl sm:text-3xl leading-tight`}
      >
        {title}
      </h2>
      <p className="text-sm sm:text-base leading-relaxed text-gray-700">
        {content}
      </p>
      <div className="pr-30 max-md:pr-0">
        {quote && (
          <div className="bg-primary text-accent rounded-xl py-10 px-16 max-md:py-8 max-md:px-6 my-6">
            <p
              className={`${FONTS.microgrammaBold.className} tracking-wide text-lg sm:text-xl leading-relaxed`}
            >
              "{quote}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
