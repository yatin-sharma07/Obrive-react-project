import type { Metadata } from "next";
import { Michroma } from "next/font/google";
import "./globals.css";
import Script from "next/script";

export const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title:
    "Obrive | Global Leader in AR · VR · MR & 3D Design – Enterprise-Grade Immersive Solutions",
  description:
    "Obrive Industries delivers cutting-edge AR, VR, MR and spatial computing solutions across industries. From immersive 3D visualisation to bespoke XR applications, we turn ideas into interactive realities.",
  keywords:
    "AR development global, VR development global, MR solutions enterprise, spatial computing studio, 3D design services international, immersive technology company, enterprise XR applications global, mixed reality development services, 3D visualization design studio, virtual showroom solutions global, digital twin services, immersive business solutions worldwide",
  alternates: {
    canonical: "https://obrive.com",
  },
  openGraph: {
    type: "website",
    url: "https://obrive.com",
    title:
      "Obrive | AR · VR · MR & 3D Design – Enterprise-Grade Immersive Solutions",
    description:
      "Join Obrive in leading the immersive revolution: global solutions in AR, VR, MR, spatial computing and 3D design for enterprises across training, retail, real-estate, manufacturing and more.",
    images: [
      {
        url: "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Faugmented_first.f8b128f2.webp&w=1200&q=75",
        alt: "Obrive AR/VR/MR immersive technology solutions",
      },
    ],
    siteName: "Obrive",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical external domains only (max 3-4) */}
        {/*
          We set a global before loading the ai script so it can pick up the correct agent id
          without having to edit the file. Replace process.env.NEXT_PUBLIC_ELEVEN_AGENT_ID
          in your environment, or set a literal string here for testing.
        */}
        <Script id="eleven-agent-global" strategy="beforeInteractive">
          {`window.ELEVENLABS_AGENT_ID = "${
            process.env.NEXT_PUBLIC_ELEVEN_AGENT_ID || ""
          }";`}
        </Script>

        {/* Load the local ai loader; include data-agent-id as another override option. */}
        <script
          id="eleven-ai"
          src="/ai/ai.js"
          data-agent-id={process.env.NEXT_PUBLIC_ELEVEN_AGENT_ID || ""}
        ></script>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
        <script dangerouslySetInnerHTML={{ __html: `function initApollo(){var cacheBuster=Math.random().toString(36).substring(7);var trackerScript=document.createElement("script");trackerScript.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+cacheBuster;trackerScript.async=true;trackerScript.defer=true;trackerScript.onload=function(){if(window.trackingFunctions&&typeof window.trackingFunctions.onLoad==="function"){window.trackingFunctions.onLoad({appId:"68f8c36bb512bf0015c5fffd"});}};document.head.appendChild(trackerScript);}initApollo();` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Organization",
              "@id": "#Organization",
              url: "https://www.obrive.com",
              legalName: "Obrive Industries",
              name: "Obrive",
              description:
                "Obrive Industries delivers cutting-edge AR, VR, MR and spatial computing solutions across industries. From immersive 3D visualisation to bespoke XR applications, we turn ideas into interactive realities.",
              image:
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobrive-intro-poster.8a0a1b5d.webp&w=1920&q=75",
              logo:
                "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobrive-logo.fb3eb1d9.svg&w=256&q=75",
              telephone: "+91 888-477-4300",
              email: "info@obrive.com",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "Sree Gururaya Mansion, 3rd Floor, 759, 8th main road KSRTC Layout, JP Nagar III Phase",
                addressLocality: "Bangalore",
                addressRegion: "Karnataka",
                addressCountry: "India",
                postalCode: "560078",
              },
              sameAs: [
                "https://www.youtube.com/@ObriveInc",
                "https://www.linkedin.com/in/obrive-industries/",
                "https://x.com/obriveinc",
                "https://www.instagram.com/obrive.inc/",
              ],
            }),
          }}
        />
      </head>
      <body className={`${michroma.className} antialiased bg-white`}>
      {children}

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-C8Z8CTCLRT"
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-C8Z8CTCLRT');
        `}
      </Script>
    </body>
    </html>
  );
}
