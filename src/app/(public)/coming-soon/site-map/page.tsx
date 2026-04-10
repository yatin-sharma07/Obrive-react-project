import FONTS from "@/assets/fonts";
import { FadeInOnLoad } from "@/components/shared/motion/GsapMotion";
import { buttonVariants } from "@/components/ui/button";
import { HomeIcon, Sparkles } from "lucide-react";
import Link from "next/link";

export default function siteMapComingSoon() {
  return (
    <div className="min-h-screen bg-none flex flex-col gap-8 items-center justify-center px-4">
      <FadeInOnLoad delay={0}>
        <h1
          className={`${FONTS.microgrammaBold.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary text-center`}
        >
          Coming Soon
        </h1>
        <h2
          className={`${FONTS.microgrammaBold.className} mt-6 text-2xl sm:text-3xl text-center text-primary`}
        >
          Site-Map is on the way
        </h2>

        <p className="mt-3 text-sm text-center max-w-xl mx-auto">
          We're developing enterprise-grade AR/VR/MR platforms that combine
          spatial computing, AI-driven automation, and extensible SDKs to
          deliver high-fidelity simulations, scalable training pipelines,
          and secure API integrations with your existing systems. Sign up
          for early access to pilot programs, technical briefings, sample
          integrations, and priority support.
        </p>
      </FadeInOnLoad>
      <Link
        href="/"
        className={buttonVariants({ variant: "default", size: "lg" })}
      >
        <HomeIcon className="size-4" />
        Back to Home
      </Link>
    </div>
  );
}
