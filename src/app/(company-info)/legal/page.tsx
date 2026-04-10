import { getCompanyInfoBySlug } from "@/lib/mdx";
import CompanyInfoTemplate from "@/components/pages/company-info/CompanyInfoTemplate";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createCompanyInfoMDXComponents } from "@/components/pages/company-info/CompanyInfoMDXComponents";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Obrive Industries — Legal & Compliance | Terms, Privacy & Policies",
  description:
    "Review Obrive's legal documents, terms of service, privacy policy, and compliance information. Learn about our commitment to data security and regulatory standards.",
  keywords:
    "legal compliance AR VR, privacy policy immersive technology, terms of service XR, data security spatial computing, regulatory compliance AR VR company",
  alternates: {
    canonical: "https://obrive.com/legal",
  },
  openGraph: {
    type: "website",
    url: "https://obrive.com/legal",
    title: "Obrive Industries — Legal & Compliance",
    description:
      "Review Obrive's legal documents, terms of service, privacy policy, and compliance information for our immersive technology platform.",
    siteName: "Obrive",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Obrive Industries — Legal & Compliance",
    description:
      "Access Obrive's legal documents, privacy policy, terms of service, and compliance information.",
  },
};

export default async function LegalPage() {
  const legalDoc = await getCompanyInfoBySlug("index", "legal");

  if (!legalDoc) {
    notFound();
  }

  return (
    <>
      {/* WebPage Schema - No GTM since it's in root layout */}
      <Script
        id="legal-index-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "WebPage",
          "@id": "https://obrive.com/legal",
          url: "https://obrive.com/legal",
          name: "Obrive Industries — Legal & Compliance",
        })}
      </Script>

      <CompanyInfoTemplate metadata={legalDoc.metadata} type="legal">
        <MDXRemote
          source={legalDoc.content}
          components={createCompanyInfoMDXComponents(legalDoc.metadata)}
        />
      </CompanyInfoTemplate>
    </>
  );
}