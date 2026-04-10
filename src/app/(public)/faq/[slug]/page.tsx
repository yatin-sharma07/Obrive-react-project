import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getFAQBySlug, getAllFAQSlugs } from '@/lib/mdx';
import { createFAQMDXComponents } from '@/components/pages/faq/FAQMDXComponents';
import FAQTemplate from '@/components/pages/faq/FAQTemplate';
import { Metadata } from 'next';
import Script from 'next/script';
import { faqMetadata } from './metadata';

interface FaqSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllFAQSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: FaqSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const faqData = await getFAQBySlug(slug);

  if (!faqData) {
    return {
      title: 'FAQ Not Found | Obrive',
    };
  }

  // Return predefined metadata or fallback
  return (
    faqMetadata[slug] || {
      title: `${faqData.metadata.title} | Obrive`,
      description: faqData.metadata.description || '',
      alternates: {
        canonical: `https://obrive.com/faq/${slug}`,
      },
    }
  );
}

const FaqSlugPage = async ({ params }: FaqSlugPageProps) => {
  const { slug } = await params;
  const faqData = await getFAQBySlug(slug);

  if (!faqData) {
    notFound();
  }

  // Extract headings for table of contents
  const headingRegex = /^#{2,3}\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;
  
  while ((match = headingRegex.exec(faqData.content)) !== null) {
    const level = match[0].split('#').length - 1;
    const text = match[1].trim();
    const id = text.toLowerCase().replace(/\s+/g, '-');
    headings.push({ level, text, id });
  }

  // Generate FAQPage schema - No GTM since it's in root layout
  const getFAQSchema = () => {
    // Extract FAQ items from MDX content
    const faqItemRegex = /question:\s*"([^"]+)",\s*answer:\s*"([^"]+)"/g;
    const mainEntity: any[] = [];
    let faqMatch;

    while ((faqMatch = faqItemRegex.exec(faqData.content)) !== null) {
      mainEntity.push({
        "@type": "Question",
        name: faqMatch[1],
        acceptedAnswer: {
          "@type": "Answer",
          text: faqMatch[2],
        },
      });
    }

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    };
  };

  const faqSchema = getFAQSchema();

  return (
    <>
      {/* FAQPage Schema - No GTM since it's in root layout */}
      {faqSchema.mainEntity.length > 0 && (
        <Script
          id={`faq-${slug}-schema`}
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(faqSchema)}
        </Script>
      )}

      <FAQTemplate metadata={faqData.metadata}>
        <MDXRemote
          source={faqData.content}
          components={createFAQMDXComponents(faqData.metadata)}
        />
      </FAQTemplate>
    </>
  );
};

export default FaqSlugPage;