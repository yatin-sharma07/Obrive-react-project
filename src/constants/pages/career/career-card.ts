export const CAREER_CARD = [
  {
    title: "AR/VR/MR DEVELOPER",
    date: "Aug 20, 2025",
    slug: "ar-vr-mr-developer",
  },
  {
    title: "FULL STACK IMMERSIVE DEVELOPER",
    date: "Aug 15, 2025",
    slug: "full-stack-immersive-developer",
  },
  {
    title: "3D VISUALIZATION DESIGNER",
    date: "Aug 15, 2025",
    slug: "3d-visualization-designer",
  },
  {
    title: "MOTION GRAPHICS DESIGNER",
    date: "Aug 20, 2025",
    slug: "motion-graphics-designer",
  },
  {
    title: "MARKETING & CONTENT SPECIALIST - IMMERSIVE TECH",
    date: "Aug 20, 2025",
    slug: "marketing-content-specialist-immersive-tech",
  },
  {
    title: "PRODUCT MANAGER - AR/VR SOLUTIONS",
    date: "Aug 20, 2025",
    slug: "product-manager-ar-vr-solutions",
  },
  {
    title: "BUSINESS DEVELOPMENT EXECUTIVE",
    date: "Aug 20, 2025",
    slug: "business-development-executive",
  },
] as const;

export type CAREER_CARD_TYPE = {
  title: string;
  date: string;
  slug: string;
};
