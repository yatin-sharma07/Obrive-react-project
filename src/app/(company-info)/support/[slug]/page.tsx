import { getCompanyInfoBySlug, getAllCompanyInfoSlugs } from "@/lib/mdx";
import CompanyInfoTemplate from "@/components/pages/company-info/CompanyInfoTemplate";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createCompanyInfoMDXComponents } from "@/components/pages/company-info/CompanyInfoMDXComponents";
import { Metadata } from "next";
import Script from "next/script";

interface SupportPageProps {
  params: { slug: string };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllCompanyInfoSlugs("support");
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: SupportPageProps): Promise<Metadata> {
  const { slug } =  params;
  const supportDoc = await getCompanyInfoBySlug(slug, "support");

  if (!supportDoc) {
    return {
      title: "Support Document Not Found | Obrive",
    };
  }

  if (slug === "change-log") {
    return {
      title: "Obrive Industries — Changelog | Product Updates & Release Notes",
      description:
        "Stay updated with the latest features, improvements, and updates to Obrive's immersive technology platform. View our complete product changelog and release notes.",
      keywords:
        "product changelog AR VR, release notes immersive technology, platform updates XR, feature updates spatial computing, version history AR VR",
      alternates: {
        canonical: "https://obrive.com/support/change-log",
      },
      openGraph: {
        type: "website",
        url: "https://obrive.com/support/change-log",
        title: "Obrive Industries — Changelog",
        description:
          "Stay updated with the latest features, improvements, and updates to Obrive's immersive technology platform. View our complete product changelog.",
        siteName: "Obrive",
        locale: "en_US",
      },
      twitter: {
        card: "summary",
        title: "Obrive Industries — Changelog",
        description:
          "Track the latest updates, features, and improvements to Obrive's AR, VR, MR, and immersive technology solutions.",
      },
    } satisfies Metadata;
  }

  return {
    title: `${supportDoc.metadata.title} | Obrive`,
    description: supportDoc.metadata.description || "",
    alternates: {
      canonical: `https://obrive.com/support/${slug}`,
    },
  };
}

export default async function SupportPage({ params }: SupportPageProps) {
  const { slug } = await params;
  const supportDoc = await getCompanyInfoBySlug(slug, "support");

  if (!supportDoc) {
    notFound();
  }

  return (
    <>
      {/* WebPage Schema - No GTM since it's in root layout */}
      <Script
        id={`support-${slug}-schema`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "WebPage",
          "@id": `https://obrive.com/support/${slug}`,
          url: `https://obrive.com/support/${slug}`,
          name:
            slug === "change-log"
              ? "Obrive Industries — Changelog"
              : supportDoc.metadata.title,
        })}
      </Script>

      <CompanyInfoTemplate metadata={supportDoc.metadata} type="support">
        <MDXRemote
          source={supportDoc.content}
          components={createCompanyInfoMDXComponents(supportDoc.metadata)}
        />
      </CompanyInfoTemplate>
    </>
  );
}