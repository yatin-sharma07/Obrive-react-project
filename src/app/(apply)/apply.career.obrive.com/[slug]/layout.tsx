import PrimaryLogo from "@/components/shared/logo/PrimaryLogo";
import Link from "next/link";
import { ReactNode } from "react";

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="absolute top-6 left-24 hidden sm:block">
        <Link href="/">
          <PrimaryLogo />
        </Link>
      </div>
      {children}
    </>
  );
}
