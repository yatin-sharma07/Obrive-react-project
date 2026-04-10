import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ICONS, NAV_ICONS, NAV_ICONS_META } from "@/assets/images";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AnimatedNavLabel from "../AnimatedNavLabel";

export function SolutionsDropdown() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        showChevron={false}
        className="text-[10px] hover:bg-transparent! focus:bg-transparent! active:bg-transparent! hover:font-extrabold transition-all duration-200 ease-in-out uppercase cursor-pointer hover:text-primary bg-transparent"
      >
        Solutions
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-primary! border-none p-6 w-[400px] md:w-[400px] absolute left-0 top-full mt-2 z-[60] rounded-md shadow-lg">
        <div>
          <h3 className="text-white text-xs mb-2">SOLUTIONS</h3>
          <p className="text-white/80 text-[10px] mb-4">
            SERVICES TAILORED FOR INDUSTRIES. ENGINEERED FOR IMMERSION.
          </p>

          <div className="">
            <div className="flex items-center gap-3 py-4 px-2 border-y border-white/20">
              <AnimatedNavLabel iconSize={16}>
                <div className="flex items-center gap-3">
                  <Image
                    src={NAV_ICONS.ARICON_NAV}
                    width={NAV_ICONS_META.ARICON_NAV.width}
                    height={NAV_ICONS_META.ARICON_NAV.height}
                    alt={NAV_ICONS_META.ARICON_NAV.alt}
                    className="flex-shrink-0"
                  />
                  <Link
                    href="/solutions/augmented-reality-development"
                    className={`${buttonVariants({
                      variant: "link",
                    })} !text-white !p-0 text-xs h-auto relative z-10`}
                  >
                    Augmented Reality Development
                  </Link>
                </div>
              </AnimatedNavLabel>
            </div>
            <div className="flex items-center gap-3 py-4 px-2 border-b border-white/20">
              <AnimatedNavLabel iconSize={16}>
                <div className="flex items-center gap-3">
                  <Image
                    src={NAV_ICONS.VRICON_NAV}
                    width={NAV_ICONS_META.VRICON_NAV.width}
                    height={NAV_ICONS_META.VRICON_NAV.height}
                    alt={NAV_ICONS_META.VRICON_NAV.alt}
                    className="flex-shrink-0"
                  />
                  <Link
                    href="/solutions/virtual-reality-development"
                    className={`${buttonVariants({
                      variant: "link",
                    })} !text-white !p-0 text-xs h-auto relative z-10`}
                  >
                    Virtual Reality Development
                  </Link>
                </div>
              </AnimatedNavLabel>
            </div>
            <div className="flex items-center gap-3 py-4 px-2 border-b border-white/20">
              <AnimatedNavLabel iconSize={16}>
                <div className="flex items-center gap-3">
                  <Image
                    src={NAV_ICONS.THREE_D_ICON_NAV}
                    width={NAV_ICONS_META.THREE_D_ICON_NAV.width}
                    height={NAV_ICONS_META.THREE_D_ICON_NAV.height}
                    alt={NAV_ICONS_META.THREE_D_ICON_NAV.alt}
                    className="flex-shrink-0"
                  />
                  <Link
                    href="/solutions/3d-design-development"
                    className={`${buttonVariants({
                      variant: "link",
                    })} !text-white !p-0 text-xs h-auto relative z-10`}
                  >
                    3D Design & Development
                  </Link>
                </div>
              </AnimatedNavLabel>
            </div>
            <div className="flex items-center gap-3 py-4 px-2 border-b border-white/20">
              <AnimatedNavLabel iconSize={16}>
                <div className="flex items-center gap-3">
                  <Image
                    src={NAV_ICONS.SPATIAL_ICON_NAV}
                    width={NAV_ICONS_META.SPATIAL_ICON_NAV.width}
                    height={NAV_ICONS_META.SPATIAL_ICON_NAV.height}
                    alt={NAV_ICONS_META.SPATIAL_ICON_NAV.alt}
                    className="flex-shrink-0"
                  />
                  <Link
                    href="/solutions/spatial-computing-app-development"
                    className={`${buttonVariants({
                      variant: "link",
                    })} !text-white !p-0 text-xs h-auto relative z-10`}
                  >
                    Spatial Computing App Development
                  </Link>
                </div>
              </AnimatedNavLabel>
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
