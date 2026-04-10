import BlogsHero from "@/components/pages/resources/BlogsHero";
import ResourcesContent from "@/components/pages/resources/ResourcesContent";
import Script from "next/script";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.obrive.in"),

  title:
    "Immersive Tech Resources & Insights | AR/VR, Spatial Computing Articles | Obrive",

  description:
    "Explore the Obrive Resources hub for articles, case studies, knowledge guides, and insights on augmented reality (AR), virtual reality (VR), spatial computing, 3D visualization, onboarding experiences and immersive technology trends.",

  keywords: [
    "immersive tech articles",
    "AR VR insights",
    "spatial computing resources",
    "3D visualization guides",
    "onboarding with immersive tech",
    "Obrive blog resources",
    "augmented reality case studies",
    "virtual reality articles",
  ],

  alternates: {
    canonical: "https://www.obrive.in/resources",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://www.obrive.in/resources",
    title:
      "Immersive Tech Resources & Insights | AR/VR, Spatial Computing Articles | Obrive",
    description:
      "Explore articles, case studies and insights on AR, VR, spatial computing and immersive technology trends.",
    siteName: "Obrive",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Immersive Tech Resources & Insights | Obrive",
    description:
      "Expert blogs and immersive technology insights covering AR, VR and spatial computing.",
  },

  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bangalore, Karnataka, India",
    ICBM: "12.9716, 77.5946",
  },
};

export default function Blogs() {
  return (
    <main>

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-C8Z8CTCLRT"
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
      >{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-C8Z8CTCLRT');
      `}</Script>
      
      {/* hero section */}
      <BlogsHero />
      
      {/* main content with client-side filtering */}
      <ResourcesContent />
    </main>
  );
}
