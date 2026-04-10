import FONTS from "@/assets/fonts";

interface StrategicStep {
  title: string;
  description: string;
}

interface ResourceStrategicApproachSectionProps {
  title?: string;
  steps: StrategicStep[];
}

export default function ResourceStrategicApproachSection({ 
  title = "Strategic Approach", 
  steps 
}: ResourceStrategicApproachSectionProps) {
  return (
    <section className="mb-8">
      <h2 className={`${FONTS.microgrammaBold.className} text-3xl mb-6`}>
        {title}
      </h2>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index}>
            <h3 className={`${FONTS.microgrammaBold.className} text-lg mb-2`}>
              {index + 1}. {step.title}
            </h3>
            <p className="text-base leading-relaxed text-gray-700">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
