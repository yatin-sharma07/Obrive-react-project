import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CASE_STUDIES_IMAGES, CASE_STUDIES_AVATAR } from "@/assets/images";

const caseStudiesDirectory = path.join(process.cwd(), "src/content/resources");

const legalDirectory = path.join(process.cwd(), "src/content/legal");

const supportDirectory = path.join(process.cwd(), "src/content/support");

const securityDirectory = path.join(process.cwd(), "src/content/security");

const faqDirectory = path.join(process.cwd(), "src/content/faq");

const careerDirectory = path.join(process.cwd(), "src/content/career");

export interface CaseStudyMetadata {
  title: string;
  date: string;
  quote: string;
  author: string;
  postType?: string;
  // seo specific fields here
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  // img fields
  heroImage: keyof typeof CASE_STUDIES_IMAGES;
  avatar: keyof typeof CASE_STUDIES_AVATAR;
  workflowSteps?: string[];
  impactMetrics?: Array<{
    benefit: string;
    description: string;
  }>;
  additionalTables?: Array<{
    title: string;
    metrics: Array<{
      benefit: string;
      description: string;
    }>;
  }>;
  quotes?: string[];
  layout?: {
    showWorkflowSteps?: boolean;
    showImpactTable?: boolean;
    showAdditionalTables?: boolean;
    showQuotes?: boolean;
  };
}

export interface CompanyInfoMetadata {
  title: string;
  description?: string;
  lastUpdated?: string;
  category?: string;
  priority?: "high" | "medium" | "low";
}

export interface FAQMetadata {
  title: string;
  description?: string;
  workflowSteps?: string[];
}

export interface CareerMetadata {
  title: string;
  department?: string;
  location?: string;
  type?: "full-time" | "part-time" | "contract" | "internship";
  experience?: string;
  salary?: string;
  description?: string;
  postedDate?: string;
  applicationDeadline?: string;
  priority?: "high" | "medium" | "low";
}

export interface CaseStudyData {
  metadata: CaseStudyMetadata;
  content: string;
  slug: string;
}

export interface CompanyInfoData {
  metadata: CompanyInfoMetadata;
  content: string;
  slug: string;
}

export interface FAQData {
  metadata: FAQMetadata;
  content: string;
  slug: string;
}

export interface CareerData {
  metadata: CareerMetadata;
  content: string;
  slug: string;
}

export async function getCaseStudyBySlug(
  slug: string
): Promise<CaseStudyData | null> {
  try {
    const fullPath = path.join(caseStudiesDirectory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      metadata: data as CaseStudyMetadata,
      content,
      slug,
    };
  } catch (error) {
    console.error(`Error loading case study ${slug}:`, error);
    return null;
  }
}

export async function getAllCaseStudySlugs(): Promise<string[]> {
  try {
    const files = fs.readdirSync(caseStudiesDirectory);
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error("Error reading case studies directory:", error);
    return [];
  }
}

export async function getAllCaseStudies(): Promise<CaseStudyData[]> {
  const slugs = await getAllCaseStudySlugs();
  const caseStudies = await Promise.all(
    slugs.map(async (slug) => {
      const caseStudy = await getCaseStudyBySlug(slug);
      return caseStudy;
    })
  );

  return caseStudies.filter(
    (caseStudy): caseStudy is CaseStudyData => caseStudy !== null
  );
}

// Company Info functions
export async function getCompanyInfoBySlug(
  slug: string,
  type: "legal" | "support" | "security"
): Promise<CompanyInfoData | null> {
  try {
    const directory =
      type === "legal"
        ? legalDirectory
        : type === "support"
          ? supportDirectory
          : securityDirectory;
    const fullPath = path.join(directory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      metadata: data as CompanyInfoMetadata,
      content,
      slug,
    };
  } catch (error) {
    console.error(`Error loading ${type} document ${slug}:`, error);
    return null;
  }
}

export async function getAllCompanyInfoSlugs(
  type: "legal" | "support" | "security"
): Promise<string[]> {
  try {
    const directory =
      type === "legal"
        ? legalDirectory
        : type === "support"
          ? supportDirectory
          : securityDirectory;

    if (!fs.existsSync(directory)) {
      return [];
    }

    const files = fs.readdirSync(directory);
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error(`Error reading ${type} directory:`, error);
    return [];
  }
}

export async function getAllCompanyInfo(
  type: "legal" | "support" | "security"
): Promise<CompanyInfoData[]> {
  const slugs = await getAllCompanyInfoSlugs(type);
  const companyInfos = await Promise.all(
    slugs.map(async (slug) => {
      const companyInfo = await getCompanyInfoBySlug(slug, type);
      return companyInfo;
    })
  );

  return companyInfos.filter(
    (companyInfo): companyInfo is CompanyInfoData => companyInfo !== null
  );
}

// FAQ functions
export async function getFAQBySlug(slug: string): Promise<FAQData | null> {
  try {
    const fullPath = path.join(faqDirectory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      metadata: data as FAQMetadata,
      content,
      slug,
    };
  } catch (error) {
    console.error(`Error loading FAQ ${slug}:`, error);
    return null;
  }
}

export async function getAllFAQSlugs(): Promise<string[]> {
  try {
    if (!fs.existsSync(faqDirectory)) {
      return [];
    }

    const files = fs.readdirSync(faqDirectory);
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error("Error reading FAQ directory:", error);
    return [];
  }
}

export async function getAllFAQs(): Promise<FAQData[]> {
  const slugs = await getAllFAQSlugs();
  const faqs = await Promise.all(
    slugs.map(async (slug) => {
      const faq = await getFAQBySlug(slug);
      return faq;
    })
  );

  return faqs.filter((faq): faq is FAQData => faq !== null);
}

// Career functions
export async function getCareerBySlug(
  slug: string
): Promise<CareerData | null> {
  try {
    const fullPath = path.join(careerDirectory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      metadata: data as CareerMetadata,
      content,
      slug,
    };
  } catch (error) {
    console.error(`Error loading career ${slug}:`, error);
    return null;
  }
}

export async function getAllCareerSlugs(): Promise<string[]> {
  try {
    if (!fs.existsSync(careerDirectory)) {
      return [];
    }

    const files = fs.readdirSync(careerDirectory);
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error("Error reading career directory:", error);
    return [];
  }
}

export async function getAllCareers(): Promise<CareerData[]> {
  const slugs = await getAllCareerSlugs();
  const careers = await Promise.all(
    slugs.map(async (slug) => {
      const career = await getCareerBySlug(slug);
      return career;
    })
  );

  return careers.filter((career): career is CareerData => career !== null);
}
