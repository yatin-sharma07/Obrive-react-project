import { Button } from "@/components/ui/button";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import ImmersiveIcon from "../../icons/ImmersiveIcon";
import Link from "next/link";
import ObIcon from "../../icons/ObIcon";
import AnimatedNavLabel from "../AnimatedNavLabel";

export function ProductsDropdown() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        showChevron={false}
        className="text-[10px] hover:bg-transparent! focus:bg-transparent! active:bg-transparent! hover:font-extrabold transition-all duration-200 ease-in-out uppercase cursor-pointer hover:text-primary bg-transparent"
      >
        Products
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-primary! border-none p-6 w-[600px] md:w-[650px] z-[60] rounded-md shadow-lg">
        <div className="flex h-full">
          {/* OBPARK */}
          <div className="flex-1 pr-6 flex flex-col gap-3">
            <div className="relative flex items-center justify-center w-fit isolate">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 scale-70 rounded-full bg-[#A6F1DF] opacity-90 blur-[30px]"
              />
              <ImmersiveIcon />
            </div>
            <div>
              <h3 className="text-xs text-white mb-2">OBPARK</h3>
              <p className="text-[10px] text-white mb-2">
                SERVICES TAILORED FOR INDUSTRIES. ENGINEERED FOR IMMERSION.
              </p>
              <div className="flex items-center">
                <Button
                  variant="link"
                  className="text-accent text-[10px] !px-0 h-auto"
                >
                  <Link href="/products/obpark">
                    <AnimatedNavLabel
                      iconSize={8}
                      gap={8}
                      shiftDirection="right"
                    >
                      READ MORE
                    </AnimatedNavLabel>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-[.5px] h-[96%] absolute left-1/2 top-33 -translate-x-1/2 -translate-y-1/2 bg-accent/60 mx-0"></div>

          {/* OBNEST */}
          <div className="flex-1 pl-6 flex flex-col gap-3">
            <div className="relative flex items-center justify-center w-fit isolate">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 scale-70 rounded-full bg-[#A6F1DF] opacity-90 blur-[30px]"
              />
              <ObIcon />
            </div>
            <div>
              <h3 className="text-xs text-white mb-2">OBNEST</h3>
              <p className="text-[10px] text-white mb-2">
                SERVICES TAILORED FOR INDUSTRIES. ENGINEERED FOR IMMERSION.
              </p>
              <div className="flex items-center">
                <Button
                  variant="link"
                  className="text-accent text-[10px] !px-0 h-auto"
                >
                  <Link href="/products/obnest">
                    <AnimatedNavLabel
                      iconSize={8}
                      gap={8}
                      shiftDirection="right"
                    >
                      READ MORE
                    </AnimatedNavLabel>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
