import { SolutionTemplate } from "@/components/pages/solutions/SolutionTemplate";
import { getSolutionData, getSolutionSlugs } from "@/lib/solutions";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Script from "next/script";

interface SolutionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getSolutionSlugs().map((slug: string) => ({ slug }));
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const solutionData = getSolutionData(slug);

  if (!solutionData) {
    return {
      title: "Solution Not Found",
    };
  }

  if (slug === "augmented-reality-development") {
  return {
    metadataBase: new URL("https://www.obrive.in"),

    title:
      "Augmented Reality (AR) Development Services in India | AR App Solutions | Obrive",

    description:
      "Obrive offers professional Augmented Reality (AR) development services in India including AR apps, AR solutions for enterprise, retail, real estate & industrial use cases. Build engaging AR experiences with spatial computing expertise.",

    keywords: [
      "augmented reality development India",
      "AR app development Bangalore",
      "AR solutions for enterprise",
      "augmented reality for retail",
      "industrial AR services",
      "spatial computing apps",
      "Obrive AR development services"
    ],

    alternates: {
      canonical: "https://www.obrive.in/solutions/augmented-reality-development",
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url: "https://www.obrive.in/solutions/augmented-reality-development",
      title:
        "Augmented Reality (AR) Development Services in India | Obrive",
      description:
        "Professional AR app development and enterprise augmented reality solutions built with spatial computing expertise.",
      siteName: "Obrive",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title:
        "Augmented Reality (AR) Development Services | Obrive",
      description:
        "Custom AR app development and enterprise AR solutions for retail, real estate and industrial use cases.",
    },

    other: {
      "geo.region": "IN-KA",
      "geo.placename": "Bangalore, Karnataka, India",
      "ICBM": "12.9716, 77.5946",
    },
  } satisfies Metadata;
}

  if (slug === "virtual-reality-development") {
  return {
    metadataBase: new URL("https://www.obrive.in"),

    title:
      "Virtual Reality (VR) Development Services in India | Immersive VR Apps | Obrive",

    description:
      "Obrive offers professional Virtual Reality (VR) development services in India including VR apps, enterprise VR solutions, 360° immersive experiences and interactive 3D simulations for training, marketing, education & industrial use cases.",

    keywords: [
      "virtual reality development India",
      "VR app development Bangalore",
      "immersive VR solutions",
      "enterprise VR experiences",
      "3D VR training apps",
      "VR simulation services",
      "Obrive VR development"
    ],

    alternates: {
      canonical: "https://www.obrive.in/solutions/virtual-reality-development",
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url: "https://www.obrive.in/solutions/virtual-reality-development",
      title:
        "Virtual Reality (VR) Development Services in India | Obrive",
      description:
        "Professional VR app development and immersive simulation solutions for enterprise, training and marketing.",
      siteName: "Obrive",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title:
        "Virtual Reality (VR) Development Services | Obrive",
      description:
        "Immersive VR applications and enterprise VR solutions built for training and engagement.",
    },

    other: {
      "geo.region": "IN-KA",
      "geo.placename": "Bangalore, Karnataka, India",
      "ICBM": "12.9716, 77.5946",
    },
  } satisfies Metadata;
}

  if (slug === "3d-design-development") {
  return {
    metadataBase: new URL("https://www.obrive.in"),

    title:
      "3D Design & Visualization Services | Architectural & Product 3D Development | Obrive",

    description:
      "Obrive provides professional 3D design and visualization services including architectural modeling, product 3D rendering, digital twin creation, and immersive 3D experiences for real estate, manufacturing & enterprise projects.",

    keywords: [
      "3D design services India",
      "3D visualization Bangalore",
      "architectural 3D modeling",
      "product 3D rendering",
      "digital twin services",
      "immersive 3D visualization solutions",
      "Obrive 3D design"
    ],

    alternates: {
      canonical: "https://www.obrive.in/solutions/3d-design-development",
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url: "https://www.obrive.in/solutions/3d-design-development",
      title:
        "3D Design & Visualization Services | Obrive",
      description:
        "Professional architectural 3D modeling, product rendering and immersive visualization services.",
      siteName: "Obrive",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title:
        "3D Design & Visualization Services | Obrive",
      description:
        "Architectural modeling, product rendering and immersive 3D visualization solutions.",
    },

    other: {
      "geo.region": "IN-KA",
      "geo.placename": "Bangalore, Karnataka, India",
      "ICBM": "12.9716, 77.5946",
    },
  } satisfies Metadata;
}

  if (slug === "spatial-computing-app-development") {
  return {
    metadataBase: new URL("https://www.obrive.in"),

    title:
      "Spatial Computing App Development Services | AR/VR & Immersive Experiences | Obrive",

    description:
      "Obrive offers spatial computing app development services to build immersive applications using AR/VR, 3D spatial interactions and mixed reality for enterprise, retail, real estate, healthcare and industrial solutions.",

    keywords: [
      "spatial computing app development",
      "AR app development",
      "VR immersive app solutions",
      "mixed reality spatial development",
      "immersive experiences design Bangalore",
      "spatial UX apps India",
      "Obrive spatial computing services"
    ],

    alternates: {
      canonical:
        "https://www.obrive.in/solutions/spatial-computing-app-development",
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url: "https://www.obrive.in/solutions/spatial-computing-app-development",
      title:
        "Spatial Computing App Development Services | Obrive",
      description:
        "Build immersive AR, VR and mixed reality applications with spatial computing expertise from Obrive.",
      siteName: "Obrive",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title:
        "Spatial Computing App Development Services | Obrive",
      description:
        "AR, VR and immersive spatial applications for enterprise and industry.",
    },

    other: {
      "geo.region": "IN-KA",
      "geo.placename": "Bangalore, Karnataka, India",
      "ICBM": "12.9716, 77.5946",
    },
  } satisfies Metadata;
}

  return {
    title: `${solutionData.hero.title} | Obrive`,
    description: solutionData.hero.description,
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const solutionData = getSolutionData(slug);

  if (!solutionData) {
    notFound();
  }

  return (
    <>
      {/* WebPage Schema Markup - No duplicate GTM since it's in root layout */}
      <Script
        id={`${slug}-schema`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "WebPage",
          "@id": `https://www.obrive.in/solutions/${slug}`,
          url: `https://www.obrive.in/solutions/${slug}`,
          name: (() => {
            switch (slug) {
              case "augmented-reality-development":
                return "Augmented Reality Development Across Industries";
              case "virtual-reality-development":
                return "Virtual Reality Development Across Industries";
              case "3d-design-development":
                return "3D Design & Development Across Industries";
              case "spatial-computing-app-development":
                return "Spatial Computing App Development Across Industries";
              default:
                return solutionData.hero.title;
            }
          })(),
        })}
      </Script>
      <SolutionTemplate
        hero={solutionData.hero}
        keyBenefits={solutionData.keyBenefits}
        howItWorks={solutionData.howItWorks}
        workflowStepsSidebar={solutionData.workflowStepsSidebar}
      />
    </>
  );
}
