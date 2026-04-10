import { ProductTemplate } from "@/components/pages/products/ProductTemplate";
import { getProductData, getProductSlugs } from "@/lib/products";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getProductSlugs().map((slug: string) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } =  await params;
  

  if (slug === "obpark") {
  return {
    metadataBase: new URL("https://www.obrive.in"),

    title:
      "Obpark – AR Parking Navigation & Smart Parking Solution | Obrive Bangalore",

    description:
      "Obpark by Obrive is an AR-powered smart parking navigation system that helps drivers find, navigate, and reserve parking spaces with augmented reality guidance. Ideal for malls, commercial complexes and city parking in Bangalore & beyond.",

    keywords: [
      "Obpark AR parking solution",
      "smart parking navigation Bangalore",
      "augmented reality parking app India",
      "AR wayfinding parking solution",
      "Obpark smart parking software",
      "Obrive Obpark product"
    ],

    alternates: {
      canonical: "https://www.obrive.in/products/obpark",
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url: "https://www.obrive.in/products/obpark",
      title:
        "Obpark – AR Parking Navigation & Smart Parking Solution | Obrive Bangalore",
      description:
        "AR-powered smart parking navigation system helping drivers find and reserve parking spaces with real-time augmented reality guidance.",
      siteName: "Obrive",
      locale: "en_IN",
      images: [
        {
          url: "https://www.obrive.in/_next/static/media/obpark-hero.webp",
          alt: "Obpark AR Smart Parking Navigation System",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title:
        "Obpark – AR Smart Parking Navigation Solution",
      description:
        "AR-based parking navigation system for malls, commercial complexes & smart cities.",
    },

    other: {
      "geo.region": "IN-KA",
      "geo.placename": "Bangalore, Karnataka, India",
      "ICBM": "12.9716, 77.5946",
      "product:brand": "Obrive",
      "product:category": "AR Smart Parking Solutions",
    },
  } satisfies Metadata;
}

  if (slug === "obnest") {
  return {
    metadataBase: new URL("https://www.obrive.in"),

    title:
      "Obnest – 3D Property Visualization & Immersive Walkthrough | Obrive Bangalore",

    description:
      "Obnest by Obrive is a 3D property visualization and immersive walkthrough solution that enables interactive viewing of real estate, architectural designs, and building layouts. Enhance engagement with photoreal 3D experiences.",

    keywords: [
      "Obnest 3D property visualization",
      "3D architectural walkthrough solution",
      "real estate 3D visualization Bangalore",
      "immersive 3D walkthrough India",
      "Obrive Obnest product",
      "spatial 3D design services"
    ],

    alternates: {
      canonical: "https://www.obrive.in/products/obnest",
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url: "https://www.obrive.in/products/obnest",
      title:
        "Obnest – 3D Property Visualization & Immersive Walkthrough | Obrive Bangalore",
      description:
        "Interactive 3D property visualization and immersive walkthrough solution for real estate and architectural projects.",
      siteName: "Obrive",
      locale: "en_IN",
      images: [
        {
          url: "https://www.obrive.in/_next/static/media/obnest-hero.webp",
          alt: "Obnest 3D Property Visualization & Walkthrough",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title:
        "Obnest – Immersive 3D Property Visualization Solution",
      description:
        "Photoreal 3D property visualization and immersive walkthrough platform by Obrive.",
    },

    other: {
      "geo.region": "IN-KA",
      "geo.placename": "Bangalore, Karnataka, India",
      "ICBM": "12.9716, 77.5946",
      "product:brand": "Obrive",
      "product:category": "3D Property Visualization Solutions",
    },
  } satisfies Metadata;
}

  if (slug === "obnavi") {
  return {
    metadataBase: new URL("https://www.obrive.in"),

    title:
      "Obnavi – AR Spatial Navigation & Immersive Wayfinding | Obrive",

    description:
      "Obnavi by Obrive is an Augmented Reality (AR) spatial navigation and immersive wayfinding solution guiding users through complex environments using AR overlays and 3D spatial cues.",

    keywords: [
      "Obnavi AR navigation",
      "AR wayfinding solution",
      "spatial navigation app",
      "AR indoor navigation India",
      "spatial computing navigation",
      "Obrive Obnavi"
    ],

    alternates: {
      canonical: "https://www.obrive.in/products/obnavi",
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url: "https://www.obrive.in/products/obnavi",
      title:
        "Obnavi – AR Spatial Navigation & Immersive Wayfinding",
      description:
        "Immersive AR navigation and spatial wayfinding solution for malls, campuses, airports and smart environments.",
      siteName: "Obrive",
      locale: "en_IN",
      images: [
        {
          url: "https://www.obrive.in/images/obnavi-hero.webp",
          width: 1200,
          height: 630,
          alt: "Obnavi AR Spatial Navigation Solution",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Obnavi – AR Spatial Navigation Solution",
      description:
        "Immersive AR wayfinding and spatial navigation system.",
      images: ["https://www.obrive.in/images/obnavi-hero.webp"],
    },

    other: {
      "geo.region": "IN-KA",
      "geo.placename": "Bangalore, Karnataka, India",
      "ICBM": "12.9716, 77.5946",
    },
  } satisfies Metadata;
}

  if (slug === "obmove") {
  return {
    metadataBase: new URL("https://www.obrive.in"),

    title:
      "Obmove – AR/VR Car Showroom & Immersive 3D Vehicle Experience | Obrive",

    description:
      "Obmove by Obrive is an immersive AR/VR car showroom and interactive 3D vehicle experience platform. Showcase vehicles with 360° views, AR features, configuration tools and next-gen digital engagement.",

    keywords: [
      "Obmove AR car showroom",
      "immersive 3D vehicle experience",
      "VR car showcase",
      "automotive AR/VR solution",
      "3D car configurator",
      "Obrive Obmove product",
      "interactive vehicle visualization"
    ],

    alternates: {
      canonical: "https://www.obrive.in/products/obmove",
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url: "https://www.obrive.in/products/obmove",
      title:
        "Obmove – AR/VR Car Showroom & Immersive 3D Vehicle Experience | Obrive",
      description:
        "Immersive AR/VR car showroom platform with interactive 3D vehicle configuration and 360° digital experiences.",
      siteName: "Obrive",
      locale: "en_IN",
      images: [
        {
          url: "https://www.obrive.in/_next/static/media/obmove-hero.webp",
          alt: "Obmove AR/VR Car Showroom Experience",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title:
        "Obmove – Immersive AR/VR Car Showroom Experience",
      description:
        "Interactive 3D vehicle showcase platform powered by AR & VR technology.",
    },

    other: {
      "geo.region": "IN-KA",
      "geo.placename": "Bangalore, Karnataka, India",
      "ICBM": "12.9716, 77.5946",
      "product:brand": "Obrive",
      "product:category": "AR/VR Automotive Solutions",
    },
  } satisfies Metadata;
}

const productData = getProductData(slug);

  if (!productData) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${productData.hero.title} | Obrive`,
    description: productData.hero.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const productData = getProductData(slug);

  if (!productData) {
    notFound();
  }

  return (
    <>
      {slug === "obpark" && (
        <>
          <Script
            id="obpark-gtag-loader"
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-C8Z8aCTCLRT"
            strategy="afterInteractive"
          />
          <Script id="obpark-gtag-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
            gtag('config', 'G-C8Z8aCTCLRT');
          `}</Script>
          <Script
            id="obpark-schema"
            type="application/ld+json"
            strategy="afterInteractive"
          >
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "OBPARK",
              description:
                "Make parking effortless for your customers with AR wayfinding. Increase in revenues, visits and customer satisfaction guaranteed with OBPARK | Obrive Products",
              image: [
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobpark-hero.65e28982.webp&w=1920&q=75",
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobpark_3.db8370e2.webp&w=1200&q=75",
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fstep_6.64adc1fc.webp&w=640&q=75",
              ],
              brand: {
                "@type": "Brand",
                name: "Obrive",
              },
            })}
          </Script>
        </>
      )}
      {slug === "obnavi" && (
        <>
          <Script
            id="obnavi-gtag-loader"
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-C8Z8CTCLRT"
            strategy="afterInteractive"
          />
          <Script id="obnavi-gtag-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
            gtag('config', 'G-C8Z8CTCLRT');
          `}</Script>
          <Script
            id="obnavi-schema"
            type="application/ld+json"
            strategy="afterInteractive"
          >
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "OBNAVI",
              description:
                "Shopping just got smarter. Get real-time AR navigation, find products instantly, and get personalized recommendations. OBNAVI guides you everywhere.",
              image: [
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobnavi-hero.e25a129e.webp&w=1920&q=75",
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobnavi_3.df52f4da.webp&w=1200&q=75",
              ],
              brand: {
                "@type": "Brand",
                name: "Obrive",
              },
            })}
          </Script>
        </>
      )}
      {slug === "obmove" && (
        <>
          <Script
            id="obmove-gtag-loader"
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-C8Z8CTCLRT"
            strategy="afterInteractive"
          />
          <Script id="obmove-gtag-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
            gtag('config', 'G-C8Z8CTCLRT');
          `}</Script>
          <Script
            id="obmove-schema"
            type="application/ld+json"
            strategy="afterInteractive"
          >
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "OBMOVE",
              description:
                "Explore, customize, and test drive any vehicle in VR before committing to one product. OBMOVE makes it happen. See how.",
              image: [
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobmove-hero.d1062fdc.webp&w=1920&q=75",
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobmove_3.072acded.webp&w=1200&q=75",
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobmove_1.777137d2.webp&w=1200&q=75",
              ],
              brand: {
                "@type": "Brand",
                name: "Obrive",
              },
            })}
          </Script>
        </>
      )}
      {slug === "obnest" && (
        <>
          <Script
            id="obnest-gtag-loader"
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-C8Z8CTCLRT"
            strategy="afterInteractive"
          />
          <Script id="obnest-gtag-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
            gtag('config', 'G-C8Z8CTCLRT');
          `}</Script>
          <Script
            id="obnest-schema"
            type="application/ld+json"
            strategy="afterInteractive"
          >
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "OBNEST",
              description:
                "Channeling MR/VR technology to deliver the property of your dreams at your doorstep. Get a Demo Now! | OBNEST",
              image: [
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobnest-hero.07df667c.webp&w=1920&q=75",
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobnest_3.acbe931d.webp&w=1200&q=75",
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fauthor.1358b851.webp&w=640&q=75",
              ],
              brand: {
                "@type": "Brand",
                name: "Obrive",
              },
            })}
          </Script>
        </>
      )}
      <ProductTemplate {...productData} />
    </>
  );
}
