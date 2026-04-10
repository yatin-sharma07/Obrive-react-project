import { MetadataRoute } from "next";
import {
  getAllCaseStudySlugs,
  getAllFAQSlugs,
  getAllCompanyInfoSlugs,
} from "@/lib/mdx";
import { getSolutionSlugs } from "@/lib/solutions";
import { getProductSlugs } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://obrive.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Product pages
  const productSlugs = getProductSlugs();
  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Solution pages
  const solutionSlugs = getSolutionSlugs();
  const solutionPages: MetadataRoute.Sitemap = solutionSlugs.map((slug) => ({
    url: `${baseUrl}/solutions/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Case study/resource pages
  const caseStudySlugs = await getAllCaseStudySlugs();
  const caseStudyPages: MetadataRoute.Sitemap = caseStudySlugs.map((slug) => ({
    url: `${baseUrl}/resources/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // FAQ pages
  const faqSlugs = await getAllFAQSlugs();
  const faqPages: MetadataRoute.Sitemap = faqSlugs.map((slug) => ({
    url: `${baseUrl}/faq/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Legal pages
  const legalSlugs = await getAllCompanyInfoSlugs("legal");
  const legalPages: MetadataRoute.Sitemap = legalSlugs.map((slug) => ({
    url: `${baseUrl}/legal/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  // Support pages
  const supportSlugs = await getAllCompanyInfoSlugs("support");
  const supportPages: MetadataRoute.Sitemap = supportSlugs.map((slug) => ({
    url: `${baseUrl}/support/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...solutionPages,
    ...caseStudyPages,
    ...faqPages,
    ...legalPages,
    ...supportPages,
  ];
}
