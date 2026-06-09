import { ReactNode } from "react";
import { Michroma } from "next/font/google";

const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
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
      className={`${michroma.className} min-h-screen bg-[#effbf0] text-slate-950`}
    >
      {children}
    </section>
  );
}