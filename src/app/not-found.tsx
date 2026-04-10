import FONTS from "@/assets/fonts";
import { FadeInOnLoad } from "@/components/shared/motion/GsapMotion";
import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-none flex flex-col gap-8 items-center justify-center">
      <FadeInOnLoad delay={0}>
        <h1
          className={`${FONTS.microgrammaBold.className} text-8xl sm:text-9xl md:text-[12rem] lg:text-[14rem] text-primary/20 select-none text-center`}
        >
          404
        </h1>
        <h2
          className={`${FONTS.microgrammaBold.className} mt-6 text-3xl sm:text-4xl text-center`}
        >
          We can’t find that page
        </h2>

        <p className="mt-3 text-sm text-center max-w-xl mx-auto">
          The page you’re looking for might have been removed, had its name
          changed, or is temporarily unavailable.
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
