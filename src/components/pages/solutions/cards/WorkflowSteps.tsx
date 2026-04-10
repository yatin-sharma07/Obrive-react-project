import FONTS from "@/assets/fonts";
import { WORKFLOW_STEPS_TYPE } from "@/constants/pages/solutions/workflow-steps";
import Image from "next/image";

const WorkflowSteps = ({
  step,
  title,
  description,
  src,
  srcMeta,
}: WORKFLOW_STEPS_TYPE) => {
  return (
    <div className="bg-gradient flex items-center justify-center px-14 py-8 border border-primary/80 rounded-xl max-xl:px-12 max-lg:px-10 max-md:px-8 max-sm:px-4 max-sm:py-6">
      <div className="flex flex-col gap-6 w-full max-w-[720px] max-md:gap-5 max-sm:gap-4">
        <div className="text-[10px] rounded-full border border-zinc-800 w-fit px-5 py-2 max-sm:px-4 max-sm:py-1.5">
          Step {step}
        </div>
        <h1
          className={`${FONTS.microgrammaBold.className} text-primary text-5xl max-xl:text-4xl max-lg:text-3xl max-md:text-2xl max-sm:text-xl`}
        >
          {title}
        </h1>

        <Image
          src={src}
          alt={srcMeta.alt}
          width={srcMeta.width}
          height={srcMeta.height}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, 720px"
        />

        <p className="max-w-[700px] w-full text-xs leading-6 max-md:text-xs max-sm:text-[11px]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default WorkflowSteps;
