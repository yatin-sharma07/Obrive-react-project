export const NAV_LINKS = [
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "Solutions",
    href: "/solutions",
  },
  {
    title: "Case Studies",
    href: "/casestudies",
  },
  {
    title: "Company",
    href: "/company",
  },
  {
    title: "Resources",
    href: "/resources",
  },
] as const;

export type NavLink = {
  title: string;
  href: string;
};

export const MOBILE_NAV_STRUCTURE = [
  {
    title: "Products",
    mainHref: "/products",
    items: [
      { title: "Obpark", href: "/products/obpark" },
      { title: "Obnest", href: "/products/obnest" },
    ],
  },
  {
    title: "Solutions",
    mainHref: "/solutions",
    items: [
      {
        title: "Augmented Reality Development",
        href: "/solutions/augmented-reality-development",
      },
      {
        title: "Virtual Reality Development",
        href: "/solutions/virtual-reality-development",
      },
      {
        title: "3D Design & Development",
        href: "/solutions/3d-design-development",
      },
      {
        title: "Spatial Computing App Development",
        href: "/solutions/spatial-computing-app-development",
      },
    ],
  },
  {
    title: "Case Studies",
    mainHref: "/casestudies",
    items: [
      {
        title: "Bringing Onboarding to Life with Immersive Spatial Computing",
        href: "/resources/bringing-onboarding-to-life",
      },
      {
        title: "From Field Friction to Spatial Flow",
        href: "/resources/spatial-flow",
      },
      {
        title: "Breaking Onboarding Barriers with Augmented Reality",
        href: "/resources/ar-onboarding",
      },
      {
        title: "Immersive Onboarding Through the eyes of the client",
        href: "/resources/client-immersive-onboarding",
      },
    ],
  },
  {
    title: "Company",
    mainHref: "/company",
    items: [
      { title: "About Obrive", href: "/about" },
      { title: "Join our Team", href: "/career" },
    ],
  },
  {
    title: "Resources",
    mainHref: "/resources",
    items: [
      { title: "Resources", href: "/resources" },
      { title: "OB Help Center", href: "/support/help-center" },
      { title: "OB Products FAQ", href: "/faq/ob-product-faq" },
      { title: "OB Services FAQ", href: "/faq/ob-services-faq" },
      { title: "OBpark FAQ", href: "/faq/obpark-faq" },
      { title: "Change Log", href: "/support/change-log" },
      { title: "Legal", href: "/legal" },
    ],
  },
] as const;
