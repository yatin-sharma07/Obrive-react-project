import FONTS from "@/assets/fonts";
import { FadeInOnLoad } from "@/components/shared/motion/GsapMotion";
import { buttonVariants } from "@/components/ui/button";
import { HomeIcon, Sparkles } from "lucide-react";
import Link from "next/link";

export default function MixedRealityComingSoon() {
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
          Mixed-reality is on the way
        </h2>

        <p className="mt-3 text-sm text-center max-w-xl mx-auto">
          We're building immersive mixed‑reality experiences that combine AR,
          VR, and MR with intelligent automation to help teams design, train,
          and present in real-world contexts. Expect interactive demos,
          enterprise-grade tools, and seamless integrations — sign up to be
          first in line for previews and early access.
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
