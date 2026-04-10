import FONTS from "@/assets/fonts";

interface ResourceOutcomeSnapshotSectionProps {
  title?: string;
  quote: string;
  author: string;
  closingStatement: string;
}

export default function ResourceOutcomeSnapshotSection({ 
  title = "Outcome Snapshot", 
  quote,
  author,
  closingStatement
}: ResourceOutcomeSnapshotSectionProps) {
  return (
    <section className="mb-8">
      <h2 className={`${FONTS.microgrammaBold.className} text-3xl mb-6`}>
        {title}
      </h2>
      <blockquote className="text-lg text-slate-700 leading-relaxed mb-4">
        "{quote}"
      </blockquote>
      <p className={`${FONTS.microgrammaBold.className} text-sm text-slate-800 mb-4`}>
        — {author}
      </p>
      <p className="text-base text-slate-700">
        {closingStatement}
      </p>
    </section>
  );
}
