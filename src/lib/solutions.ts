import { StaticImageData } from "next/image";
import { IMAGES } from "@/assets/images";
import {
  AR_DEVELOPMENT_HERO,
  AR_DEVELOPMENT_HOW_IT_WORKS,
  AR_DEVELOPMENT_KEY_BENEFITS,
  AR_DEVELOPMENT_WORKFLOW_STEPS_SIDEBAR,
} from "@/constants/pages/solutions/ar-development";
import {
  VR_DEVELOPMENT_HERO,
  VR_DEVELOPMENT_HOW_IT_WORKS,
  VR_DEVELOPMENT_KEY_BENEFITS,
  VR_DEVELOPMENT_WORKFLOW_STEPS_SIDEBAR,
} from "@/constants/pages/solutions/vr-development";
import {
  THREE_D_DESIGN_HERO,
  THREE_D_DESIGN_HOW_IT_WORKS,
  THREE_D_DESIGN_KEY_BENEFITS,
  THREE_D_DESIGN_WORKFLOW_STEPS_SIDEBAR,
} from "@/constants/pages/solutions/3d-design-development";
import {
  SPATIAL_COMPUTING_HERO,
  SPATIAL_COMPUTING_HOW_IT_WORKS,
  SPATIAL_COMPUTING_KEY_BENEFITS,
  SPATIAL_COMPUTING_WORKFLOW_STEPS_SIDEBAR,
} from "@/constants/pages/solutions/spatial-computing-development";

export interface SolutionHero {
  title: string;
  description: string;
  description2: string;
  backgroundImage: string | StaticImageData;
  icon?: React.ComponentType;
  ctaButtons: {
    primary: string;
    secondary: string;
  };
}

export interface SolutionData {
  slug: string;
  hero: SolutionHero;
  howItWorks: readonly any[];
  keyBenefits: readonly any[];
  workflowStepsSidebar: readonly string[];
}

const SOLUTIONS_DATA: Record<string, SolutionData> = {
  "augmented-reality-development": {
    slug: "augmented-reality-development",
    hero: {
      ...AR_DEVELOPMENT_HERO,
      backgroundImage: IMAGES.OBPARK_HERO,
    },
    howItWorks: AR_DEVELOPMENT_HOW_IT_WORKS,
    keyBenefits: AR_DEVELOPMENT_KEY_BENEFITS,
    workflowStepsSidebar: AR_DEVELOPMENT_WORKFLOW_STEPS_SIDEBAR,
  },
  "virtual-reality-development": {
    slug: "virtual-reality-development",
    hero: {
      ...VR_DEVELOPMENT_HERO,
      backgroundImage: IMAGES.OBNEST_HERO,
    },
    howItWorks: VR_DEVELOPMENT_HOW_IT_WORKS,
    keyBenefits: VR_DEVELOPMENT_KEY_BENEFITS,
    workflowStepsSidebar: VR_DEVELOPMENT_WORKFLOW_STEPS_SIDEBAR,
  },
  "3d-design-development": {
    slug: "3d-design-development",
    hero: {
      ...THREE_D_DESIGN_HERO,
      backgroundImage: IMAGES.OBNAVI_HERO,
    },
    howItWorks: THREE_D_DESIGN_HOW_IT_WORKS,
    keyBenefits: THREE_D_DESIGN_KEY_BENEFITS,
    workflowStepsSidebar: THREE_D_DESIGN_WORKFLOW_STEPS_SIDEBAR,
  },
  "spatial-computing-app-development": {
    slug: "spatial-computing-app-development",
    hero: {
      ...SPATIAL_COMPUTING_HERO,
      backgroundImage: IMAGES.OBMOVE_HERO,
    },
    howItWorks: SPATIAL_COMPUTING_HOW_IT_WORKS,
    keyBenefits: SPATIAL_COMPUTING_KEY_BENEFITS,
    workflowStepsSidebar: SPATIAL_COMPUTING_WORKFLOW_STEPS_SIDEBAR,
  },
};

export function getSolutionSlugs(): string[] {
  return Object.keys(SOLUTIONS_DATA);
}

export function getSolutionData(slug: string): SolutionData | null {
  return SOLUTIONS_DATA[slug] || null;
}

export function getAllSolutions(): SolutionData[] {
  return Object.values(SOLUTIONS_DATA);
}
