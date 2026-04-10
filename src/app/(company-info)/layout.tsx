import PrimaryLogo from "@/components/shared/logo/PrimaryLogo";
import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import Link from "next/link";

export default function CompanyInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <FullWidthSection backgroundColor="none" className="relative">
        <div className="absolute max-sm:hidden -top-[3.9rem] left-[13.8vw] z-10">
          <Link href="/">
            <PrimaryLogo />
          </Link>
        </div>

        {children}
      </FullWidthSection>
    </div>
  );
}
