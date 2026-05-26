import { Poppins } from "next/font/google";
import type { ReactNode } from "react";
import "../../COMMUNITY/css/community.css";

const communityFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-community",
});

export default function CommunityLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={communityFont.className}>
      {children}
    </div>
  );
}