import { IMAGES, IMAGES_META } from "@/assets/images";
import { StaticImageData } from "next/image";

export const WORKFLOW_STEPS = [
  {
    step: ".01",
    title: "1. Precise Visualization",
    description:
      "Overlay contextual 3D models or step-by-step instructions directly onto physical workspaces—eliminating guesswork and improving accuracy.",
    src: IMAGES.THREE_D_FIRST_IMAGE,
    srcMeta: IMAGES_META.THREE_D_FIRST_IMAGE,
  },
  {
    step: ".02",
    title: "2. Guided Support",
    description:
      "Enable field technicians, trainees, or remote collaborators to receive live AR annotations, voice prompts, and interactive cues in real time.",
    src: IMAGES.THREE_D_SECOND_IMAGE,
    srcMeta: IMAGES_META.THREE_D_SECOND_IMAGE,
  },
  {
    step: ".03",
    title: "3. Visual Collaboration",
    description:
      "Utilize a branded AR portal for secure sharing of AR projects—allowing clients and team members to view, interact, and provide feedback within a modern, intuitive interface.",
    src: IMAGES.THREE_D_THIRD_IMAGE,
    srcMeta: IMAGES_META.THREE_D_THIRD_IMAGE,
  },
  {
    step: ".04",
    title: "4. Monitor Approvals",
    description:
      "Embed digital sign-off options and usage tracking within AR experiences, ensuring accountability, compliance, and seamless project handoffs.",
    src: IMAGES.THREE_D_FOURTH_IMAGE,
    srcMeta: IMAGES_META.THREE_D_FOURTH_IMAGE,
  },
];

export const BENEFITS_TABLE = [
  {
    benefit: "Speed & Efficiency",
    description:
      "Slash training and onboarding time with immersive, in‑situ AR guidance.",
  },
  {
    benefit: "Enhanced Accuracy",
    description:
      "Real‑time overlays reduce human errors and support compliance.",
  },
  {
    benefit: "Scalability",
    description:
      "Deploy across facilities or client sites with minimal setup and cost.",
  },
  {
    benefit: "Stronger Engagement",
    description:
      "Interactive visuals foster deeper understanding and retention.",
  },
  {
    benefit: "Unified Workflow",
    description:
      "Integrate with core business systems for seamless data‑driven AR delivery.",
  },
] as const;

export type WORKFLOW_STEPS_TYPE = {
  step: string;
  title: string;
  description: string;
  src: StaticImageData;
  srcMeta: {
    alt: string;
    width: number;
    height: number;
  };
};
