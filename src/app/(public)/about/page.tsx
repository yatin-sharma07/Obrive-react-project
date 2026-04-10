import FONTS from "@/assets/fonts";
import FeaturedIn from "@/components/pages/about/featured/FeaturedIn";
import ObjectiveCarousel from "@/components/pages/about/ObjectiveCarousel";
import { AboutRiveAnimation } from "@/components/pages/about/AboutRiveAnimation";
import EffortlessControl from "@/components/shared/cards/EffortlessControl";
import ImmersiveExperience from "@/components/shared/cards/ImmersiveExperience";
import VideoCardObrive from "@/components/shared/cards/VideoCardObrive";
import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import WhySection from "@/components/shared/layout/WhySection";
import { FadeInOnView } from "@/components/shared/motion/GsapMotion";
import { WHO_WE_ARE_ABOUT } from "@/constants/pages/why-section";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://www.obrive.in"),

  title:
    "About Obrive | AR, VR & Spatial Computing Company in Bangalore, India",

  description:
    "Obrive is a Bangalore-based immersive technology company specializing in Augmented Reality (AR), Virtual Reality (VR), Spatial Computing and 3D Visualization. We build enterprise-grade immersive solutions for retail, real estate, automotive, healthcare and smart city innovation.",

  keywords: [
    "Obrive company",
    "AR VR company Bangalore",
    "Spatial computing company India",
    "Immersive technology company",
    "3D visualization company India",
    "Enterprise AR VR solutions",
    "XR development studio Bangalore"
  ],

  alternates: {
    canonical: "https://www.obrive.in/about",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "https://www.obrive.in/about",
    title:
      "About Obrive | Immersive Technology & Spatial Computing Experts",
    description:
      "Discover Obrive — experts in AR, VR, 3D design and spatial computing delivering enterprise immersive solutions across industries from Bangalore, India.",
    siteName: "Obrive",
    locale: "en_IN",
    images: [
      {
        url: "https://www.obrive.in/_next/static/media/obrive-intro-poster.webp",
        width: 1200,
        height: 630,
        alt: "Obrive AR VR Spatial Computing Company",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "About Obrive | AR, VR & Spatial Computing Company",
    description:
      "Bangalore-based immersive tech company delivering enterprise AR, VR and spatial computing solutions.",
  },

  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bangalore, Karnataka, India",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function Products() {
  return (
    <div>

      {/* LocalBusiness JSON-LD */}
      <Script
        id="localbusiness-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.obrive.in/#organization",
              "name": "Obrive Industries Private Limited",
              "url": "https://www.obrive.in",
              "logo": "https://www.obrive.in/_next/static/media/obrive-logo.svg",
              "description": "Obrive is an immersive technology company specializing in AR, VR, spatial computing and 3D visualization solutions.",
              "email": "info@obrive.com",
              "telephone": "+91 888-477-4300",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Sree Gururaya Mansion, 3rd Floor, 759, 8th main road KSRTC Layout, JP Nagar III Phase",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka",
                "postalCode": "560078",
                "addressCountry": "IN"
              },
              "sameAs": [
                "https://www.linkedin.com/in/obrive-industries/",
                "https://www.instagram.com/obrive.inc/",
                "https://www.youtube.com/@ObriveInc",
                "https://x.com/obriveinc"
              }
            }
          `,
        }}
      />

      {/* BreadcrumbList JSON-LD */}
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            {
              "@context": "https://schema.org/",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.obrive.in/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "About",
                  "item": "https://www.obrive.in/about"
                }
              ]
            }
          `,
        }}
      />
      
      <section className="flex flex-col">
        <FullWidthSection backgroundColor="accent" className="py-10 pt-30">
          <FadeInOnView>
            <div className="text-center flex flex-col items-center gap-8">
              <h1
                className={`${FONTS.microgrammaBold.className} text-secondary sm:leading-20 text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-[90vw] sm:max-w-3xl md:max-w-4xl break-words text-balance`}
              >
                Immersive Tech Redefining Business
              </h1>
              <p className="text-base sm:text-md text-center max-w-3xl px-4 font-medium">
                At Obrive.com, we empower organizations to transform how they
                design, train, and engage—leveraging the full spectrum of AR, VR,
                MR, 3D design, and Spatial Computing.
              </p>
            </div>
          </FadeInOnView>
        </FullWidthSection>
        {/* bg animation */}
        <div className="relative sm:h-[120vh] sm:min-h-[700px] overflow-hidden bg-gradient flex items-center justify-center">
          <div className="absolute inset-0 max-sm:hidden">
            <AboutRiveAnimation />
          </div>
          <div className="relative z-10 text-center px-4">
            <FadeInOnView>
              <div className="bg-gradient relative w-fit -top-40 -left-60 flex max-sm:flex-col gap-4 sm:items-center max-sm:items-start justify-between rounded-lg py-3 px-8 mb-4 border border-primary/80 max-md:static max-md:w-full max-md:justify-center max-md:gap-2 max-md:px-4 max-md:py-2">
                <span className="text-secondary">Mission</span>
                <hr className="w-px max-sm:hidden h-8 max-md:h-6 bg-primary/80" />
                <p className="text-secondary max-sm:text-left max-md:text-sm">
                  Create Immersive Futures That Matter
                </p>
              </div>
            </FadeInOnView>
            <FadeInOnView>
              <div className="bg-gradient relative w-fit -top-40 left-60 flex max-sm:flex-col gap-4 sm:items-center max-sm:items-start justify-between rounded-lg py-3 px-8 mb-4 border border-primary/80 max-md:static max-md:w-full max-md:justify-center max-md:gap-2 max-md:px-4 max-md:py-2">
                <span className="text-secondary">Vision</span>
                <hr className="w-px max-sm:hidden h-8 max-md:h-6 bg-primary/80" />
                <p className="text-secondary max-sm:text-left max-md:text-sm">
                  A World Where Digital and Physical Seamlessly Coexist.
                </p>
              </div>
            </FadeInOnView>
          </div>
        </div>
      </section>
        <section>
          <ObjectiveCarousel />
        </section>

      <FullWidthSection backgroundColor="accent">
        <FadeInOnView>
          <section className="px-10 pb-40 max-md:px-4 max-md:pb-20">
            <WhySection {...WHO_WE_ARE_ABOUT} />
          </section>
        </FadeInOnView>
      </FullWidthSection>
      <FadeInOnView>
        <section className="-mt-20 max-md:-mt-10">
          <VideoCardObrive />
        </section>
      </FadeInOnView>
      {/* immersive experience */}
      <FadeInOnView>
        <section>
          <ImmersiveExperience />
        </section>
      </FadeInOnView>
      {/* effortless control */}
      <FadeInOnView>
        <section>
          <EffortlessControl />
        </section>
      </FadeInOnView>
      <FadeInOnView>
        <section id="featured-in">
          <FeaturedIn />
        </section>
      </FadeInOnView>
    </div>
  );
}
