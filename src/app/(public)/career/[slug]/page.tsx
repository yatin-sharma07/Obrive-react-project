import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCareerBySlug, getAllCareerSlugs } from "@/lib/mdx";
import CareerTemplate from "@/components/pages/career/CareerTemplate";
import { createCareerMDXComponents } from "@/components/pages/career/CareerMDXComponents";

export async function generateStaticParams() {
  const slugs = await getAllCareerSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const career = await getCareerBySlug(slug);

  if (!career) {
    return {
      title: "Career Not Found",
    };
  }

  return {
    title: `${career.metadata.title} | Careers at Obrive`,
    description:
      career.metadata.description ||
      `Apply for ${career.metadata.title} role at Obrive — AR, VR & spatial computing company in Bangalore.`,

    alternates: {
      canonical: `https://www.obrive.in/career/${slug}`,
    },

    openGraph: {
      type: "article",
      url: `https://www.obrive.in/career/${slug}`,
      title: `${career.metadata.title} | Obrive Careers`,
      description:
        career.metadata.description ||
        `Join Obrive as ${career.metadata.title}.`,
      siteName: "Obrive",
      locale: "en_IN",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CareerPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const career = await getCareerBySlug(slug);

  if (!career) {
    notFound();
  }

  const components = createCareerMDXComponents(career.metadata);

  return (
    <CareerTemplate metadata={career.metadata}>
      <MDXRemote source={career.content} components={components} />
    </CareerTemplate>
  );
}