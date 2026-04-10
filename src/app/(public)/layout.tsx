import CookiePopup from "@/components/shared/cookies/cookies";
import PublicLayout from "@/components/shared/layout/PublicLayout";
import { ReactNode } from "react";

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicLayout>{children}</PublicLayout>
      <CookiePopup />
    </>
  );
}
