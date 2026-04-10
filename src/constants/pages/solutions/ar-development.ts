import { IMAGES, IMAGES_META, ICONS, ICONS_META } from "@/assets/images";

export const AR_DEVELOPMENT_HERO = {
  title: "Augmented Reality Development Across Industries in Bangalore, India.",
  description:
    "Traditional workflows across industries—from manufacturing to healthcare to training—often rely on physical prototyping, manuals, and static visuals. These methods can be slow, error-prone, and lack engagement.",
  description2: "Obrive Industries transforms this with immersive Augmented Reality solutions that boost operational efficiency, enhance user engagement, and accelerate training and adoption. Our tailored AR tools provide intuitive, real-time guidance, seamlessly overlaying digital insights onto the physical world—right where you need them.",
  ctaButtons: {
    primary: "Get Started with AR",
    secondary: "SCHEDULE A CONSULTATION",
  },
};

export const AR_DEVELOPMENT_WORKFLOW_STEPS_SIDEBAR = [
  "Step 1: Structure Your Spatial App Workflow",
  "Step 2: Share Interactive Previews",
  "Step 3: Automate Iteration & Launch",
  "Step 4: Approve & Integrate"
];

export const AR_DEVELOPMENT_HOW_IT_WORKS = [
  {
    step: "01",
    title: "1. Precise Visualization",
    description:
      "Overlay contextual 3D models or step-by-step instructions directly onto physical workspaces—eliminating guesswork and improving accuracy.",
    src: IMAGES.AUGMENTED_FIRST_IMAGE,
    srcMeta: IMAGES_META.AUGMENTED_FIRST_IMAGE,
  },
  {
    step: "02",
    title: "2. Guided Support",
    description:
      "Enable field technicians, trainees, or remote collaborators to receive live AR annotations, voice prompts, and interactive cues in real time.",
    src: IMAGES.AUGMENTED_SECOND_IMAGE,
    srcMeta: IMAGES_META.AUGMENTED_SECOND_IMAGE,
  },
  {
    step: "03",
    title: "3. Visual Collaboration",
    description:
      "Utilize a branded AR portal for secure sharing of AR projects—allowing clients and team members to view, interact, and provide feedback within a modern, intuitive interface.",
    src: IMAGES.AUGMENTED_THIRD_IMAGE,
    srcMeta: IMAGES_META.AUGMENTED_THIRD_IMAGE,
  },
  {
    step: "04",
    title: "4. Monitor Approvals",
    description:
      "Embed digital sign-off options and usage tracking within AR experiences, ensuring accountability, compliance, and seamless project handoffs.",
    src: IMAGES.AUGMENTED_FOURTH_IMAGE,
    srcMeta: IMAGES_META.AUGMENTED_FOURTH_IMAGE,
  },
] as const;

export const AR_DEVELOPMENT_KEY_BENEFITS = [
  {
    title: "Dynamic AR Visualizations",
    description:
      "Project 3D models, annotations, and contextual overlays directly onto work environments, equipment, or training scenarios.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Smart Engagement Insights",
    description:
      "Monitor user interaction patterns to deliver adaptive guidance and improve performance based on real-time behavior.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Automated Workflow Triggers",
    description:
      "Automatically launch AR overlays or support sequences when specific triggers—like sensor data or user input—are detected.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Instant AR Briefs & Instructions",
    description:
      "Share interactive AR-enabled briefing links with stakeholders, eliminating manual orientation and documentation.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Frictionless AR Action",
    description:
      "Integrate intuitive control gestures or voice commands within the AR interface for seamless user interaction.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
  {
    title: "Seamless System Integration",
    description:
      "Connect to your existing ERP, IoT, or document management systems to power AR experiences with real-time data feeds.",
    src: ICONS.BOX_CHECK_ICON,
    srcMeta: ICONS_META.BOX_CHECK_ICON,
  },
] as const;
