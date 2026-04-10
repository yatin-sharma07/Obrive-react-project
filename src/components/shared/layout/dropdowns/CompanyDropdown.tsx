"use client";
import { useState } from "react";
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

export function CompanyDropdown() {
  const [isJoinHovered, setIsJoinHovered] = useState(false);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        showChevron={false}
        className="text-[10px] hover:bg-transparent! focus:bg-transparent! active:bg-transparent! hover:font-extrabold transition-all duration-200 ease-in-out uppercase cursor-pointer hover:text-primary bg-transparent"
      >
        Company
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-primary! border-none p-6 min-w-[450px] min-h-[300px] md:w-[400px] absolute left-0 top-full mt-2 z-[60] rounded-md shadow-lg">
        <div>
          <h3 className="text-white text-xs mb-2 w-2xl">COMPANY</h3>
          <p className="text-accent text-[10px] pr-24 mb-4 uppercase">
            Bringing Transparency and Efficiency to the World of Immersive
            Technologies.
          </p>

          <div className="flex gap-4">
            <div className="relative text-accent/60 rounded-xl overflow-hidden min-w-[200px] h-52 text-xs pointer-events-none">
              <Image
                src={NAV_ICONS.OCTOPUS_IMAGE}
                alt={NAV_ICONS_META.OCTOPUS_IMAGE.alt}
                width={NAV_ICONS_META.OCTOPUS_IMAGE.width}
                height={NAV_ICONS_META.OCTOPUS_IMAGE.height}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ease-out ${
                  isJoinHovered
                    ? "translate-y-6 scale-95 opacity-0"
                    : "translate-y-0 scale-100 opacity-100"
                }`}
                priority={true}
              />
              <Image
                src={NAV_ICONS.COMPANY_DROPDOWN}
                alt={NAV_ICONS_META.COMPANY_DROPDOWN.alt}
                width={NAV_ICONS_META.COMPANY_DROPDOWN.width}
                height={NAV_ICONS_META.COMPANY_DROPDOWN.height}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ease-out ${
                  isJoinHovered
                    ? "translate-y-0 scale-100 opacity-100"
                    : "-translate-y-6 scale-95 opacity-0"
                }`}
                priority={true}
              />
            </div>

            <div className="w-full pr-6">
              <div className="flex items-center gap-3  border-y border-white/20">
                <AnimatedNavLabel iconSize={14} gap={0} shiftDirection="right">
                  <Link
                    href={"/about"}
                    className={`${buttonVariants({
                      variant: "link",
                    })} text-white text-xs !py-6 !px-2`}
                  >
                    About Obrive
                  </Link>
                </AnimatedNavLabel>
              </div>
              <div className="flex items-center gap-3 border-b border-white/20">
                <AnimatedNavLabel iconSize={14} gap={0} shiftDirection="right">
                  <Link
                    href={"/career"}
                    className={`${buttonVariants({
                      variant: "link",
                    })} text-white text-xs !py-6 !px-2`}
                    onMouseEnter={() => setIsJoinHovered(true)}
                    onMouseLeave={() => setIsJoinHovered(false)}
                    onFocus={() => setIsJoinHovered(true)}
                    onBlur={() => setIsJoinHovered(false)}
                  >
                    Join our Team
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
