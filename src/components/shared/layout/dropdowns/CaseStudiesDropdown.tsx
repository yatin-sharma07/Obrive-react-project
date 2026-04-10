import { NAV_ICONS, NAV_ICONS_META } from "@/assets/images";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import AnimatedNavLabel from "../AnimatedNavLabel";

export function CaseStudiesDropdown() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        showChevron={false}
        className="text-[10px] hover:bg-transparent! focus:bg-transparent! active:bg-transparent! hover:font-extrabold transition-all duration-200 ease-in-out uppercase cursor-pointer hover:text-primary bg-transparent"
      >
        Case Studies
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-primary! border-none p-6 w-[600px] md:w-[750px] absolute left-0 top-full mt-2 z-[60] rounded-md shadow-lg">
        <div>
          <h3 className="text-white text-xs mb-2 w-2xl">CASE STUDIES</h3>
          <p className="text-accent text-[10px] mb-4 w-xs">
            OUR WORK TAILORED FOR INDUSTRIES. ENGINEERED FOR IMMERSION.
          </p>

          <div className="flex gap-4">
            {/* Placeholder for owl image */}
            <div className="text-accent/60 rounded-xl overflow-hidden min-w-[200px] h-50 text-xs pointer-events-none">
              <Image
                src={NAV_ICONS.OWL_IMAGE}
                alt={NAV_ICONS_META.OWL_IMAGE.alt}
                width={NAV_ICONS_META.OWL_IMAGE.width}
                height={NAV_ICONS_META.OWL_IMAGE.height}
                className="object-cover w-full h-full"
                priority={true}
              />
            </div>

            <div className="">
              <div className="group flex items-center gap-3 py-2 border-y border-white/20">
                <AnimatedNavLabel iconSize={14} gap={0} shiftDirection="right">
                  <Link
                    href="/resources/bringing-onboarding-to-life"
                    className={`text-white text-xs ${buttonVariants({
                      variant: "link",
                    })} !px-1`}
                  >
                    Bringing Onboarding to Life with Immersive Spatial Computing
                  </Link>
                </AnimatedNavLabel>
              </div>

              <div className="group flex items-center gap-3 py-2 border-b border-white/20">
                <AnimatedNavLabel iconSize={14} gap={0} shiftDirection="right">
                  <Link
                    href="/resources/spatial-flow"
                    className={`text-white text-xs ${buttonVariants({
                      variant: "link",
                    })} !px-1`}
                  >
                    From Field Friction to Spatial Flow
                  </Link>
                </AnimatedNavLabel>
              </div>

              <div className="group flex items-center gap-3 py-2 border-b border-white/20">
                <AnimatedNavLabel iconSize={14} gap={0} shiftDirection="right">
                  <Link
                    href="/resources/ar-onboarding"
                    className={`text-white text-xs ${buttonVariants({
                      variant: "link",
                    })} !px-1`}
                  >
                    Breaking Onboarding Barriers with Augmented Reality
                  </Link>
                </AnimatedNavLabel>
              </div>

              <div className="group flex items-center gap-3 py-2 border-b border-white/20">
                <AnimatedNavLabel iconSize={14} gap={0} shiftDirection="right">
                  <Link
                    href="/resources/client-immersive-onboarding"
                    className={`text-white text-xs ${buttonVariants({
                      variant: "link",
                    })} !px-1`}
                  >
                    Immersive Onboarding That Feels Like Reality Through the
                    <br /> eyes of the client
                  </Link>
                </AnimatedNavLabel>
              </div>
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
