import { IMAGES, IMAGES_META, ICONS, ICONS_META } from "@/assets/images";

export const VR_DEVELOPMENT_HERO = {
  title: "Virtual Reality Development Across Industries in Bangalore, India.",
  description:
    "Obrive Industries delivers immersive Virtual Reality (VR) solutions designed to transform how industries train, collaborate, and operate. By creating interactive 3D environments, we help organizations replace costly manual methods with engaging, efficient simulations.",
  description2:
    "From healthcare training to manufacturing workflows, our VR platforms provide realistic, step-by-step guidance that enhances accuracy, reduces risks, and improves decision-making. With scalable solutions, we enable enterprises to accelerate adoption and achieve measurable results.",
  ctaButtons: {
    primary: "Explore VR Solutions",
    secondary: "SCHEDULE A DEMO",
  },
};

export const VR_DEVELOPMENT_WORKFLOW_STEPS_SIDEBAR = [
  "Step 1: Design VR Workflows",
  "Step 2: Launch & Train",
  "Step 3: Collaborate & Review Securely",
  "Step 4: Analyze & Optimize Training Adoption",
];

export const VR_DEVELOPMENT_HOW_IT_WORKS = [
  {
    step: "01",
    title: "1. Build VR Workflows",
    description:
      "Build immersive simulations tailored to your operational environment—whether it's factory line training, equipment handling, or virtual inspections.",
    src: IMAGES.VIRTUAL_FIRST_IMAGE,
    srcMeta: IMAGES_META.VIRTUAL_FIRST_IMAGE,
  },
  {
    step: "02",
    title: "2. Launch & Train",
    description:
      "Deploy VR experiences to teams, with interactive guidance, prompts, and embedded AI-driven assistance that adapts to user performance.",
    src: IMAGES.VIRTUAL_SECOND_IMAGE,
    srcMeta: IMAGES_META.VIRTUAL_SECOND_IMAGE,
  },
  {
    step: "03",
    title: "3. Secure Collaboration",
    description:
      "Use a branded client portal to invite stakeholders, review recorded sessions, share feedback, and track progress in a modern VR interface.",
    src: IMAGES.VIRTUAL_THIRD_IMAGE,
    srcMeta: IMAGES_META.VIRTUAL_THIRD_IMAGE,
  },
  {
    step: "04",
    title: "4. Track & Improve",
    description:
      "Automatically capture performance metrics and user feedback directly from VR sessions, supporting analytics, certification, and continuous improvement.",
    src: IMAGES.VIRTUAL_FOURTH_IMAGE,
    srcMeta: IMAGES_META.VIRTUAL_FOURTH_IMAGE,
  },
] as const;

export const VR_DEVELOPMENT_KEY_BENEFITS = [
  {
    title: "State-of-the-Art VR Workflow Builder",
    description:
      "Create immersive VR environments—from site walkthroughs to equipment training—where users interact with realistic scenarios for enhanced retention.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Immersive Simulation Forecasting",
    description:
      "Use real-time analytics within VR sessions to monitor trainee progress, identify bottlenecks, and forecast readiness for deployment.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "AI-Guided VR Prompts",
    description:
      "Automatically analyse user actions and deliver contextual guidance—highlighting errors and recommending optimal steps.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Automated VR Deployment Triggers",
    description:
      "Automatically launch VR simulations when milestones are reached—such as module completion or project phase transitions.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Instant VR Briefing Links",
    description:
      "Send sharable invites that launch specific VR sessions—eliminating setup delays and enabling instantaneous engagement.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Smart Scenario Generation",
    description:
      "Generate personalized VR training scenarios based on user roles, performance metrics, or project data, without manual configuration.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
] as const;
