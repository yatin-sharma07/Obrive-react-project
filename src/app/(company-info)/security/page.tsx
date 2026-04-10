import { getCompanyInfoBySlug } from "@/lib/mdx";
import CompanyInfoTemplate from "@/components/pages/company-info/CompanyInfoTemplate";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createCompanyInfoMDXComponents } from "@/components/pages/company-info/CompanyInfoMDXComponents";

export default async function SecurityIndexPage() {
  const securityDoc = await getCompanyInfoBySlug("index", "security");

  if (!securityDoc) {
    notFound();
  }

  return (
    <CompanyInfoTemplate metadata={securityDoc.metadata} type="security">
      <MDXRemote
        source={securityDoc.content}
        components={createCompanyInfoMDXComponents(securityDoc.metadata)}
      />
    </CompanyInfoTemplate>
  );
}
