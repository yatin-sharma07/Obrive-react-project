import { getCaseStudyBySlug, getAllCaseStudySlugs } from "@/lib/mdx";
import ResourceTemplate from "@/components/pages/resources/ResourceTemplate";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createResourceMDXComponents } from "@/components/pages/resources/ResourceMDXComponents";
import { Metadata } from "next";
import { CASE_STUDIES_IMAGES } from "@/assets/images";
import Script from "next/script";

interface ResourcePageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = params;
  const resource = await getCaseStudyBySlug(slug);

  if (!resource) {
    return {
      title: "Resource Not Found | Obrive",
      description:
        "The requested resource could not be found. Explore our other case studies and resources.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const heroImage = CASE_STUDIES_IMAGES[resource.metadata.heroImage];
  // ensure absolute URL for social media images
  const imageUrl = heroImage?.src.startsWith("http")
    ? heroImage.src
    : `https://www.obrive.com${heroImage?.src || "/images/default-hero.png"}`;

  // extract tags from postType for better SEO
  const tags = resource.metadata.postType?.split(" ").filter(Boolean) || [];

  // custom seo field if provided
  const pageTitle = resource.metadata.seoTitle || resource.metadata.title;
  const pageDescription =
    resource.metadata.seoDescription || resource.metadata.quote;


  return {
    title: `${pageTitle} | Obrive`,
    description: pageDescription,
    keywords: resource.metadata.seoKeywords,
    authors: [{ name: resource.metadata.author }],
    creator: resource.metadata.author,
    publisher: "Obrive",
    metadataBase: new URL("https://obrive.com"),
    alternates: {
      canonical: `https://obrive.com/resources/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://obrive.com/resources/${slug}`,
      siteName: "Obrive",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: resource.metadata.title,
        },
      ],
      locale: "en_IN",
      type: "article",
      publishedTime: resource.metadata.date,
      authors: [resource.metadata.author],
      tags: tags,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
      site: "@Obrive",
    },
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = await getCaseStudyBySlug(slug);

  if (!resource) {
    notFound();
  }

  // Generate Article schema for case studies - No duplicate GTM since it's in root layout
  const getArticleSchema = () => {
    const heroImage = CASE_STUDIES_IMAGES[resource.metadata.heroImage];
    const imageUrl = heroImage?.src.startsWith("http")
      ? heroImage.src
      : `https://obrive.com${heroImage?.src || "/images/default-hero.png"}`;

    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `https://obrive.com/resources/${slug}`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://obrive.com/resources/${slug}`,
        url: `https://obrive.com/resources/${slug}`,
      },
      datePublished: resource.metadata.date,
      author: resource.metadata.author,
      publisher: {
        "@type": "Organization",
        name: "Obrive",
        logo: {
          "@type": "ImageObject",
          url: "https://obrive.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobrive-logo.fb3eb1d9.svg&w=256&q=75",
        },
      },
    };

    // Only generate schema for the 4 specific case studies
    const caseStudySchemas = {
      "bringing-onboarding-to-life": {
        name: "Bringing Onboarding to Life with Immersive Spatial Computing",
        headline: "What used to take weeks now happens in days. Trainees recall protocols more reliably, and trainers stay in control from anywhere. What Obrive delivered isn't just technology it's transformation.",
        description: "From weeks to days: Learn how one company revolutionized onboarding with virtual reality and spatial computing. Measurable results from immersive training.",
      },
      "spatial-flow": {
        name: "Case Study",
        headline: "See how spatial computing replaced outdated field training methods with immersive 3D workflows. Real results: faster learning, fewer errors, seamless operations.",
        description: "See how spatial computing replaced outdated field training methods with immersive 3D workflows. Real results: faster learning, fewer errors, seamless operations.",
      },
      "ar-onboarding": {
        name: "AR Onboarding Success: How Augmented Reality Broke Training Barriers",
        headline: "Breaking Onboarding Barriers with Augmented Reality A First - Person Success Story In Their Own Words",
        description: "Discover how AR technology eliminated onboarding challenges and accelerated employee training. A real case study in augmented reality workplace transformation.",
      },
      "client-immersive-onboarding": {
        name: "Immersive Onboarding Case Study: Training That Feels Real",
        headline: "Immersive Onboarding That Feels Like Reality - Through the eyes of the client",
        description: "Learn how immersive 3D onboarding created realistic training experiences without real-world risks. See the results: better engagement and retention rates.",
      },
    };

    const schemaData = caseStudySchemas[slug as keyof typeof caseStudySchemas];
    if (!schemaData) return null;

    return {
      ...baseSchema,
      name: schemaData.name,
      headline: schemaData.headline,
      description: schemaData.description,
      image: imageUrl,
    };
  };

  const articleSchema = getArticleSchema();

  return (
    <>
      {/* GTM Script for all blogs and case studies */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-C8Z8CTCLRT"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-C8Z8CTCLRT');
        `}
      </Script>
      
      {/* Article Schema Markup for case studies */}
      {articleSchema && (
        <Script
          id={`${slug}-article-schema`}
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(articleSchema)}
        </Script>
      )}
      <ResourceTemplate metadata={resource.metadata} slug={slug}>
        <MDXRemote
          source={resource.content}
          components={createResourceMDXComponents(resource.metadata)}
        />
      </ResourceTemplate>
    </>
  );
}
