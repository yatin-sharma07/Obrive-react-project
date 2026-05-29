import { ReactNode } from "react";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
});

interface CommunityLayoutProps {
  children: ReactNode;
}

export default function CommunityLayout({
  children,
}: CommunityLayoutProps) {
  return (
    <section
      className={`${nunito.className} min-h-screen bg-[#effbf0] text-slate-950`}
    >
      {children}
    </section>
  );
}