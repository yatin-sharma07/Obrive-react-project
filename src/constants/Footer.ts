import { SOCIAL_ICONS, SOCIAL_ICONS_META } from "@/assets/images";

export const GROUPS = [
  {
    title: "Products",
    items: [
      { label: "Obpark", href: "/products/obpark" },
      { label: "Obnest", href: "/products/obnest" },
      { label: "Obnavi", href: "/products/obnavi" },
      { label: "Obmove", href: "/products/obmove" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About Obrive", href: "/about" },
      { label: "Join The Otters", href: "/career" },
      { label: "Obrive partners", href: "/about#featured-in" },
      { label: "Site Map", href: "/coming-soon/site-map" },
    ],
  },
  {
    title: "Our Services",
    items: [
      { label: "AR Development", href: "/solutions/augmented-reality-development" },
      { label: "VR Development", href: "/solutions/virtual-reality-development" },
      { label: "3D Modelling", href: "/solutions/3d-design-development" },
      { label: "Spatial Computing", href: "/solutions/spatial-computing-app-development" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Obrive Resources", href: "/resources" },
      { label: "Obrive Help Desk", href: "/support/help-center" },
      { label: "Community Forum", href: "/coming-soon/community-form" },
      { label: "Obrive Legal", href: "/legal" },
    ],
  },
] as const;

export const SOCIAL_LINKS = [
  {
    href: "https://www.linkedin.com/company/obrive-industries",
    icon: SOCIAL_ICONS.SOCIAL_LINKEDIN,
    meta: SOCIAL_ICONS_META.SOCIAL_LINKEDIN,
  },
  {
    href: "https://www.instagram.com/obrive.inc",
    icon: SOCIAL_ICONS.SOCIAL_INSTAGRAM,
    meta: SOCIAL_ICONS_META.SOCIAL_INSTAGRAM,
  },
  {
    href: "https://www.facebook.com/obriveindustries/",
    icon: SOCIAL_ICONS.SOCIAL_FACEBOOK,
    meta: SOCIAL_ICONS_META.SOCIAL_FACEBOOK,
  },
  {
    href: "https://x.com/obriveinc",
    icon: SOCIAL_ICONS.SOCIAL_TWITTER,
    meta: SOCIAL_ICONS_META.SOCIAL_TWITTER,
  },
  {
    href: "https://medium.com/@obrive.inc",
    icon: SOCIAL_ICONS.SOCIAL_MEDIUM,
    meta: SOCIAL_ICONS_META.SOCIAL_MEDIUM,
  },
] as const;


export const PRIMARY_FOOTER_CARD = {
  title: "Automate Your Immersive Workflow",
  description:
    "Simplify the creation and deployment of Augmented Reality, Virtual Reality, Mixed Reality, 3D design, and Spatial Computing projects through automated asset integration, real-time rendering, and seamless collaboration—all designed to bring your vision to life faster and smarter.",
} as const;
