import { IMAGES, IMAGES_META, ICONS, ICONS_META } from "@/assets/images";

export const SPATIAL_COMPUTING_HERO = {
  title:
    "Spatial Computing App Development Across Industries in Bangalore, India.",
  description:
    "Developing spatial computing apps—AR, VR, MR, or XR—can often feel fragmented, slow, and complex. Obrive Industries simplifies this with end-to-end Spatial Computing development that accelerates delivery, strengthens collaboration, and elevates immersive experiences. Our Project Pipeline unifies workflows, while a secure Client Portal enables previews, feedback, and deployment triggers.",
  description2:
    "This streamlined approach minimizes manual friction, improves engagement, and speeds innovation across industries—from real estate and education to retail, healthcare, and beyond.",
  ctaButtons: {
    primary: "Explore Spatial Apps",
    secondary: "BOOK CONSULTATION",
  },
};

export const SPATIAL_COMPUTING_WORKFLOW_STEPS_SIDEBAR = [
  "Step 1: Structure Your Spatial App Workflow",
  "Step 2: Share Interactive Previews",
  "Step 3: Automate Iteration & Launch",
  "Step 4: Approve & Integrate",
];

export const SPATIAL_COMPUTING_HOW_IT_WORKS = [
  {
    step: "01",
    title: "1. Spatial Workflow",
    description:
      "Organize your development pipeline—concept, prototype, review, beta, deployment—with automated stage tracking and timeline visibility.",
    src: IMAGES.SPATIAL_FIRST_IMAGE,
    srcMeta: IMAGES_META.SPATIAL_FIRST_IMAGE,
  },
  {
    step: "02",
    title: "2. Interactive Previews",
    description:
      "Clients and stakeholders access immersive demos through a branded portal, interacting with the app and giving visual feedback in real-time.",
    src: IMAGES.SPATIAL_SECOND_IMAGE,
    srcMeta: IMAGES_META.SPATIAL_SECOND_IMAGE,
  },
  {
    step: "03",
    title: "3. Automated Launch",
    description:
      "Post-feedback, updates and testing environments are triggered automatically—pushing your project forward without manual coordination.",
    src: IMAGES.SPATIAL_THIRD_IMAGE,
    srcMeta: IMAGES_META.SPATIAL_THIRD_IMAGE,
  },
  {
    step: "04",
    title: "4. Approve & Integrate",
    description:
      "Collect final approvals within the portal, archive versions, and push deliverables into your asset libraries or customer environments effortlessly.",
    src: IMAGES.SPATIAL_FOURTH_IMAGE,
    srcMeta: IMAGES_META.SPATIAL_FOURTH_IMAGE,
  },
] as const;

export const SPATIAL_COMPUTING_KEY_BENEFITS = [
  {
    title: "Immersive Pipeline Management",
    description:
      "Track every stage of your spatial computing project—from concept and prototyping to deployment—in a sleek, structured workflow.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Intelligent Progress Forecasting",
    description:
      "Leverage real-time analytics that forecast delivery timelines, highlight bottlenecks, and ensure smooth rollout.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "AI-Driven Insight & Guidance",
    description:
      "Automatically analyze interactions, detect engagement drops, and adjustments to optimize VR/AR experiences.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Auto-Triggered Deployments",
    description:
      "Automatically launch user tests, beta previews, or live deployments as soon as milestones are reached.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Instant Interactive Demos",
    description:
      "Share links to immersive app previews—no installs, no delays—enabling clients to explore, collaborate, and provide feedback instantly.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Automated Proposal Generation",
    description:
      "Create personalized proposals using project templates, visual asset snippets, and client data—streamlining discovery-to-demo handoff.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
] as const;
