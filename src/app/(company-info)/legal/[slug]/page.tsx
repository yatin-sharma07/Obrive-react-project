import { getCompanyInfoBySlug, getAllCompanyInfoSlugs } from "@/lib/mdx";
import CompanyInfoTemplate from "@/components/pages/company-info/CompanyInfoTemplate";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createCompanyInfoMDXComponents } from "@/components/pages/company-info/CompanyInfoMDXComponents";
import { Metadata } from "next";
import Script from "next/script";

interface LegalPageProps {
  params: { slug: string };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllCompanyInfoSlugs("legal");
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: LegalPageProps): Promise<Metadata> {
  const { slug } =  params;
  const legalDoc = await getCompanyInfoBySlug(slug, "legal");

  if (!legalDoc) {
    return {
      title: "Legal Document Not Found | Obrive",
    };
  }

  // Specific metadata for each legal page
  if (slug === "accessibility") {
    return {
      title: "Accessibility | Making AR/VR Experiences Inclusive for Everyone",
      description:
        "At Obrive, we design AR, VR, and spatial solutions that empower people of all abilities. Innovation should be accessible to everyone, everywhere.",
      keywords:
        "accessibility AR VR, inclusive immersive technology, accessible spatial computing, AR VR accessibility standards, inclusive XR design, accessible 3D visualization",
      alternates: {
        canonical: "https://obrive.com/legal/accessibility",
      },
      openGraph: {
        type: "website",
        url: "https://obrive.com/legal/accessibility",
        title: "Accessibility | Making AR/VR Experiences Inclusive for Everyone",
        description:
          "At Obrive, we design AR, VR, and spatial solutions that empower people of all abilities. Innovation should be accessible to everyone, everywhere.",
        siteName: "Obrive",
        locale: "en_US",
      },
      twitter: {
        card: "summary",
        title: "Accessibility | Making AR/VR Experiences Inclusive for Everyone",
        description:
          "Obrive designs AR, VR, and spatial solutions that empower people of all abilities. Learn about our commitment to accessible immersive technology.",
      },
    } satisfies Metadata;
  }

  if (slug === "privacy-policy") {
    return {
      title: "Privacy Policy | Obrive Data Protection & Security",
      description:
        "Learn how Obrive collects, uses, and protects your personal data. Transparent, secure, and compliant with global privacy laws.",
      keywords:
        "privacy policy AR VR, data protection immersive technology, GDPR compliance XR, privacy security spatial computing, data privacy AR VR company",
      alternates: {
        canonical: "https://obrive.com/legal/privacy-policy",
      },
      openGraph: {
        type: "website",
        url: "https://obrive.com/legal/privacy-policy",
        title: "Privacy Policy | Obrive Data Protection & Security",
        description:
          "Learn how Obrive collects, uses, and protects your personal data. Transparent, secure, and compliant with global privacy laws.",
        siteName: "Obrive",
        locale: "en_US",
      },
      twitter: {
        card: "summary",
        title: "Privacy Policy | Obrive Data Protection & Security",
        description:
          "Read Obrive's privacy policy. Learn how we collect, use, and protect your personal data with transparent, secure practices compliant with global privacy laws.",
      },
    } satisfies Metadata;
  }

  if (slug === "terms-of-product-agreement") {
    return {
      title: "Terms of Product Agreement | Obrive Usage & Policies",
      description:
        "Review the terms and conditions for using Obrive's products. Clear guidelines for secure, fair, and reliable use.",
      keywords:
        "product terms AR VR, usage agreement immersive technology, product policies XR, terms conditions spatial computing",
      alternates: {
        canonical: "https://obrive.com/legal/terms-of-product-agreement",
      },
      openGraph: {
        type: "website",
        url: "https://obrive.com/legal/terms-of-product-agreement",
        title: "Terms of Product Agreement | Obrive Usage & Policies",
        description:
          "Review the terms and conditions for using Obrive's products. Clear guidelines for secure, fair, and reliable use.",
        siteName: "Obrive",
        locale: "en_US",
      },
      twitter: {
        card: "summary",
        title: "Terms of Product Agreement | Obrive Usage & Policies",
        description:
          "Review Obrive's product terms and conditions for secure, fair, and reliable use of our immersive technology solutions.",
      },
    } satisfies Metadata;
  }

  if (slug === "terms-of-service") {
    return {
      title: "Terms of Service | Obrive Platform Rules & Usage",
      description:
        "Understand Obrive's Terms of Service covering platform usage, responsibilities, and user rights.",
      keywords:
        "terms of service AR VR, platform rules immersive technology, service agreement XR, user rights spatial computing",
      alternates: {
        canonical: "https://obrive.com/legal/terms-of-service",
      },
      openGraph: {
        type: "website",
        url: "https://obrive.com/legal/terms-of-service",
        title: "Terms of Service | Obrive Platform Rules & Usage",
        description:
          "Understand Obrive's Terms of Service covering platform usage, responsibilities, and user rights.",
        siteName: "Obrive",
        locale: "en_US",
      },
      twitter: {
        card: "summary",
        title: "Terms of Service | Obrive Platform Rules & Usage",
        description:
          "Review Obrive's Terms of Service covering platform usage, user responsibilities, and rights for immersive technology solutions.",
      },
    } satisfies Metadata;
  }

  if (slug === "master-service-agreement") {
    return {
      title: "Master Service Agreement | Obrive Business Terms",
      description:
        "Detailed terms of Obrive's Master Service Agreement for enterprises and partners. Clear, transparent, and binding.",
      keywords:
        "master service agreement AR VR, business terms immersive technology, enterprise agreement XR, MSA spatial computing",
      alternates: {
        canonical: "https://obrive.com/legal/master-service-agreement",
      },
      openGraph: {
        type: "website",
        url: "https://obrive.com/legal/master-service-agreement",
        title: "Master Service Agreement | Obrive Business Terms",
        description:
          "Detailed terms of Obrive's Master Service Agreement for enterprises and partners. Clear, transparent, and binding.",
        siteName: "Obrive",
        locale: "en_US",
      },
      twitter: {
        card: "summary",
        title: "Master Service Agreement | Obrive Business Terms",
        description:
          "Review Obrive's Master Service Agreement for enterprises and partners. Clear, transparent, and binding business terms.",
      },
    } satisfies Metadata;
  }

  // Fallback metadata
  return {
    title: `${legalDoc.metadata.title} | Obrive`,
    description: legalDoc.metadata.description || "",
    alternates: {
      canonical: `https://obrive.com/legal/${slug}`,
    },
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const legalDoc = await getCompanyInfoBySlug(slug, "legal");

  if (!legalDoc) {
    notFound();
  }

  // Schema markup for legal pages - No GTM duplication
  const getSchemaMarkup = () => {
    const baseSchema = {
      "@context": "https://schema.org/",
      "@type": "WebPage",
      "@id": `https://obrive.com/legal/${slug}`,
      url: `https://obrive.com/legal/${slug}`,
    };

    const schemaNames: Record<string, string> = {
      accessibility: "Accessibility",
      "privacy-policy": "Privacy Policy",
      "terms-of-product-agreement": "Terms of Product Agreement",
      "terms-of-service": "Terms of Service",
      "master-service-agreement": "Master Service Agreement (MSA)",
    };

    return {
      ...baseSchema,
      name: schemaNames[slug] || legalDoc.metadata.title,
    };
  };

  // Breadcrumb schema for specific pages
  const getBreadcrumbSchema = () => {
    if (
      !["privacy-policy", "terms-of-service", "master-service-agreement"].includes(
        slug
      )
    ) {
      return null;
    }

    const breadcrumbNames: Record<string, string> = {
      "privacy-policy": "Privacy Policy",
      "terms-of-service": "Terms of Service",
      "master-service-agreement": "Master Service Agreement (MSA)",
    };

    return {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Obrive Industries — Legal & Compliance",
          item: "https://obrive.com/legal",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: breadcrumbNames[slug],
          item: `https://obrive.com/legal/${slug}`,
        },
      ],
    };
  };

  const schema = getSchemaMarkup();
  const breadcrumbSchema = getBreadcrumbSchema();

  return (
    <>
      {/* WebPage Schema - No GTM since it's in root layout */}
      <Script
        id={`legal-${slug}-schema`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(schema)}
      </Script>

      {/* Breadcrumb Schema for specific pages */}
      {breadcrumbSchema && (
        <Script
          id={`legal-${slug}-breadcrumb`}
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(breadcrumbSchema)}
        </Script>
      )}

      <CompanyInfoTemplate metadata={legalDoc.metadata} type="legal">
        <MDXRemote
          source={legalDoc.content}
          components={createCompanyInfoMDXComponents(legalDoc.metadata)}
        />
      </CompanyInfoTemplate>
    </>
  );
}