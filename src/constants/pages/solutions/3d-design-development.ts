import { IMAGES, IMAGES_META, ICONS, ICONS_META } from "@/assets/images";

export const THREE_D_DESIGN_HERO = {
  title: "3D Design & Development Across Industries in Bangalore, India.",
  description:
    "Traditional 3D workflows—from CAD handoffs to reviews—are often fragmented, slow, and constrained by basic previews. Obrive redefines this with a unified platform that streamlines stages, accelerates collaboration, and improves quality across industries.",
  description2:
    "Our 3D Design pipeline centralizes the entire journey, from concept to render, while a secure Client Portal enables feedback, approvals, and data integration. This seamless approach reduces manual effort, increases visibility, and elevates stakeholder experience across sectors.",
  ctaButtons: {
    primary: "View 3D Portfolio",
    secondary: "GET A QUOTE",
  },
};

export const THREE_D_DESIGN_WORKFLOW_STEPS_SIDEBAR = [
  "Step 1: Centralize Your Design Workflow",
  "Step 2: Review & Revise with Precision",
  "Step 3: Iterate Automatically",
  "Step 4: Approve, Integrate & Deliver",
];

export const THREE_D_DESIGN_HOW_IT_WORKS = [
  {
    step: "01",
    title: "1. Unified Workflow",
    description:
      "Set up a connected pipeline that tracks each 3D asset from wireframe to final render—automating status updates, task assignments, and visibility.",
    src: IMAGES.THREE_D_FIRST_IMAGE,
    srcMeta: IMAGES_META.THREE_D_FIRST_IMAGE,
  },
  {
    step: "02",
    title: "2. Accurate Review",
    description:
      "Clients and team members comment directly on 3D previews through a sleek portal. AI-powered suggestions surface improvements or flag errors in real-time.",
    src: IMAGES.THREE_D_SECOND_IMAGE,
    srcMeta: IMAGES_META.THREE_D_SECOND_IMAGE,
  },
  {
    step: "03",
    title: "3. Smart Iteration",
    description:
      "Once revisions are approved, the next version is rendered and shared automatically—keeping delivery moving without manual intervention.",
    src: IMAGES.THREE_D_THIRD_IMAGE,
    srcMeta: IMAGES_META.THREE_D_THIRD_IMAGE,
  },
  {
    step: "04",
    title: "4. Approve & Deliver",
    description:
      "Capture client approval, log version history, and push final assets to downstream systems—smoothing handoffs and archiving for compliance.",
    src: IMAGES.THREE_D_FOURTH_IMAGE,
    srcMeta: IMAGES_META.THREE_D_FOURTH_IMAGE,
  },
] as const;

export const THREE_D_DESIGN_KEY_BENEFITS = [
  {
    title: "Structured Project Pipeline",
    description:
      "Monitor every design stage—concept, prototyping, review, revision—with clarity and precision.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Auto-Launch Iterations",
    description:
      'Trigger revised renders or next-stage assets automatically when a project moves into "approved-for-production" status.',
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Instant Collaborative Reviews",
    description:
      "Share interactive previews via unique links—no downloads, no setup—enabling clients to comment and collaborate instantly.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Intelligent Progress Forecasting",
    description:
      "Leverage data signals (feedback speed, approval delays, revision cycles) to anticipate project status and spot bottlenecks early.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Proposal Automation",
    description:
      "Generate customized design proposals using templated material, asset previews, and project scopes—aligned with client data.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "AI-Driven Design Feedback",
    description:
      "Detect inconsistencies, recommend optimizations, and flag issues (e.g., geometry errors, lighting anomalies) through automated analysis.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
] as const;
