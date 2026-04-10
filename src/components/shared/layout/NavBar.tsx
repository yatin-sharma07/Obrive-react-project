"use client";
import { MOBILE_NAV_STRUCTURE } from "@/constants/navigation";
import Link from "next/link";
import { FadeInOnLoad } from "@/components/shared/motion/GsapMotion";
import { useState, useEffect, useRef, useMemo } from "react";
import AnimatedButton from "../buttons/AnimatedButton";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ProductsDropdown } from "./dropdowns/ProductsDropdown";
import { SolutionsDropdown } from "./dropdowns/SolutionsDropdown";
import { CaseStudiesDropdown } from "./dropdowns/CaseStudiesDropdown";
import { CompanyDropdown } from "./dropdowns/CompanyDropdown";
import { ResourcesDropdown } from "./dropdowns/ResourcesDropdown";
import PrimaryLogo from "../logo/PrimaryLogo";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Breakpoint constants
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

// Navbar dimension constants
const NAVBAR_DIMENSIONS = {
  mobile: {
    startHeight: 60,
    endHeight: 52,
    startPadding: 16,
    endPadding: 16,
    marginTop: 4,
    borderRadius: 8,
    maxWidthGutter: 8,
  },
  tablet: {
    startHeight: 72,
    endHeight: 64,
    startPadding: 24,
    endPadding: 16,
    marginTop: 16,
    borderRadius: 16,
    maxWidthGutter: 16,
  },
  desktop: {
    startHeight: 80,
    endHeight: 68,
    startPadding: 80,
    endPadding: 24,
    marginTop: 16,
    borderRadius: 16,
    maxWidth: 1152, // max-w-6xl equivalent
  },
  scroll: {
    shrinkStartHeight: 50,
    shrinkEndHeight: 200,
    directionThreshold: 100,
    scrolledThreshold: 10,
    heroSectionMultiplier: 0.6,
  },
} as const;

interface NavBarProps {
  backgroundColor?: "white" | "accent";
}

// Custom hook for device type detection
function useDeviceType(windowWidth: number, isMounted: boolean) {
  return useMemo(() => {
    const isMobile = isMounted && windowWidth < BREAKPOINTS.mobile;
    const isTablet =
      isMounted &&
      windowWidth >= BREAKPOINTS.mobile &&
      windowWidth < BREAKPOINTS.tablet;
    const isDesktop = isMounted && windowWidth >= BREAKPOINTS.tablet;

    return { isMobile, isTablet, isDesktop };
  }, [windowWidth, isMounted]);
}

export default function NavBar({ backgroundColor = "white" }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Use the custom hook for device detection
  const { isMobile, isTablet } = useDeviceType(windowWidth, isMounted);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrollY(currentScrollY);
      setIsScrolled(
        currentScrollY > NAVBAR_DIMENSIONS.scroll.scrolledThreshold
      );

      // Determine scroll direction
      if (
        currentScrollY > lastScrollY &&
        currentScrollY > NAVBAR_DIMENSIONS.scroll.directionThreshold
      ) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial window width and mounted state
    setWindowWidth(window.innerWidth);
    setIsMounted(true);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [lastScrollY]);

  // Click outside handler for mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        // Check if click is not on the menu button using data attribute
        const target = event.target as HTMLElement;
        if (!target.closest('[data-menu-toggle="true"]')) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Calculate progressive shrinking values with mobile/tablet overrides
  const getProgressiveValues = () => {
    const { shrinkStartHeight, shrinkEndHeight } = NAVBAR_DIMENSIONS.scroll;

    // Get device-specific dimensions
    const deviceDimensions = isMobile
      ? NAVBAR_DIMENSIONS.mobile
      : isTablet
      ? NAVBAR_DIMENSIONS.tablet
      : NAVBAR_DIMENSIONS.desktop;

    if (scrollY <= shrinkStartHeight) {
      return {
        progress: 0,
        maxWidth: "100%",
        marginTop: "0px",
        borderRadius: "0px",
        height: `${deviceDimensions.startHeight}px`,
        paddingX: `${deviceDimensions.startPadding}px`,
        showBackground: false,
        showShadow: false,
      };
    }

    if (scrollY >= shrinkEndHeight) {
      return {
        progress: 1,
        maxWidth: isMobile
          ? `calc(100% - ${NAVBAR_DIMENSIONS.mobile.maxWidthGutter}px)`
          : isTablet
          ? `calc(100% - ${NAVBAR_DIMENSIONS.tablet.maxWidthGutter}px)`
          : `${NAVBAR_DIMENSIONS.desktop.maxWidth}px`,
        marginTop: `${deviceDimensions.marginTop}px`,
        borderRadius: `${deviceDimensions.borderRadius}px`,
        height: `${deviceDimensions.endHeight}px`,
        paddingX: `${deviceDimensions.endPadding}px`,
        showBackground: true,
        showShadow: true,
      };
    }

    // Progressive interpolation between start and end
    const progress =
      (scrollY - shrinkStartHeight) / (shrinkEndHeight - shrinkStartHeight);
    const easeProgress = progress * progress * (3 - 2 * progress); // smooth ease curve

    const {
      startHeight,
      endHeight,
      startPadding,
      endPadding,
      marginTop,
      borderRadius,
    } = deviceDimensions;

    return {
      progress: easeProgress,
      maxWidth:
        easeProgress > 0.1
          ? isMobile
            ? `calc(100% - ${NAVBAR_DIMENSIONS.mobile.maxWidthGutter}px)`
            : isTablet
            ? `calc(100% - ${NAVBAR_DIMENSIONS.tablet.maxWidthGutter}px)`
            : `${NAVBAR_DIMENSIONS.desktop.maxWidth}px`
          : "100%",
      marginTop: `${easeProgress * marginTop}px`,
      borderRadius: `${easeProgress * borderRadius}px`,
      height: `${startHeight - easeProgress * (startHeight - endHeight)}px`,
      paddingX: `${
        startPadding - easeProgress * (startPadding - endPadding)
      }px`,
      showBackground: true,
      showShadow: easeProgress > 0.3,
    };
  };

  // Determine navbar visibility and styling
  const heroSectionHeight = isMounted
    ? window.innerHeight * NAVBAR_DIMENSIONS.scroll.heroSectionMultiplier
    : 600;
  const shouldHideNavbar =
    scrollDirection === "down" && scrollY > heroSectionHeight;
  const progressiveValues = getProgressiveValues();
  const borderClass =
    progressiveValues.progress > 0 ? "border-[0.5px] border-primary/30" : "border-[0.5px] border-transparent";

  // Get background color classes
  const getBackgroundColor = () => {
    if (!progressiveValues.showBackground || progressiveValues.progress === 0) {
      return "bg-transparent";
    }
    return backgroundColor === "accent" ? "bg-gradient" : "bg-white";
  };

  return (
    <>
      {/* Mobile Fixed Toggle Button - only render after mount */}
      {isMounted && isMobile && (
        <div className="fixed top-4 right-4 z-[110] md:hidden">
          <button
            className="flex items-center justify-center p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            data-menu-toggle="true"
            data-testid="menu-toggle-fixed"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      )}

      <header
        className={`${
          isMobile
            ? "absolute top-0 left-0 right-0 w-full"
            : `fixed top-0 container mx-auto left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
                shouldHideNavbar ? "-translate-y-full" : "translate-y-0"
              }`
        }`}
      >
        {isMobile ? (
          <div
            className="mx-auto w-full relative bg-transparent"
            style={{
              maxWidth: isMobile ? "100%" : progressiveValues.maxWidth,
              marginTop: isMobile ? "0px" : progressiveValues.marginTop,
              borderRadius: isMobile ? "0px" : progressiveValues.borderRadius,
              transition: isMobile ? "none" : "all 0.6s ease-out",
            }}
          >
            <nav
              className="relative flex items-center justify-between overflow-visible"
              style={{
                height: isMobile ? "70px" : progressiveValues.height,
                paddingLeft: isMobile ? "16px" : progressiveValues.paddingX,
                paddingRight: isMobile ? "56px" : progressiveValues.paddingX,
                zIndex: 20,
              }}
            >
              <Link href="/" className="relative z-30 block">
                <PrimaryLogo />
              </Link>

              {/* desktop navigation */}
              <NavigationMenu viewport={false} className="hidden md:flex">
                <NavigationMenuList className="gap-4">
                  <ProductsDropdown />
                  <SolutionsDropdown />
                  <CaseStudiesDropdown />
                  <CompanyDropdown />
                  <ResourcesDropdown />
                </NavigationMenuList>
              </NavigationMenu>

              <div className="hidden md:flex items-center gap-2 lg:gap-4">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link
                      href="/client-login"
                      className={`${buttonVariants({
                        variant: "ghost",
                        size: "lg",
                      })} uppercase text-xs cursor-pointer`}
                    >
                      Login
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-primary px-8 border-none">
                    <div className="border-y-1 border-accent/40">
                      <Link
                        href="/client-login"
                        className={`${buttonVariants({
                          variant: "link",
                        })} uppercase cursor-pointer text-white`}
                      >
                        Clients
                      </Link>
                    </div>
                    <div className="border-b-1 border-accent/40">
                      <Link
                        href="/employee-login"
                        className={`${buttonVariants({
                          variant: "link",
                        })} uppercase cursor-pointer text-white`}
                      >
                        Employee
                      </Link>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <AnimatedButton
                  asChild
                  className="text-xs hidden sm:flex"
                  size="lg"
                  href="https://calendly.com/obrive-inc/talk-to-ob-experts"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Schedule a call with our experts on Calendly"
                  iconSize={16}
                >
                  Schedule A Call
                </AnimatedButton>
              </div>

              {/* mobile menu button - hidden on mobile since we have fixed button */}
              <button
                className="hidden"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                data-menu-toggle="true"
                data-testid="menu-toggle-nav"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </nav>
          </div>
        ) : (
          <FadeInOnLoad delay={0}>
            <div
              className={`mx-auto w-full relative ${
                isMobile
                  ? backgroundColor === "accent"
                    ? "bg-accent"
                    : "bg-white"
                  : `${getBackgroundColor()} ${
                      progressiveValues.showShadow
                        ? "backdrop-blur-md shadow-lg"
                        : ""
                    }
                    ${borderClass}`
              }`}
              style={{
                maxWidth: isMobile ? "100%" : progressiveValues.maxWidth,
                marginTop: isMobile ? "0px" : progressiveValues.marginTop,
                borderRadius: isMobile ? "0px" : progressiveValues.borderRadius,
                transition: isMobile ? "none" : "all 0.6s ease-out",
              }}
            >
              <nav
                className="relative flex items-center justify-between overflow-visible"
                style={{
                  height: isMobile ? "70px" : progressiveValues.height,
                  paddingLeft: isMobile ? "16px" : progressiveValues.paddingX,
                  paddingRight: isMobile ? "56px" : progressiveValues.paddingX,
                  zIndex: 20,
                }}
              >
                <Link href="/" className="relative z-30 block">
                  <PrimaryLogo />
                </Link>

                {/* desktop navigation */}
                <NavigationMenu viewport={false} className="hidden md:flex">
                  <NavigationMenuList className="gap-4">
                    <ProductsDropdown />
                    <SolutionsDropdown />
                    <CaseStudiesDropdown />
                    <CompanyDropdown />
                    <ResourcesDropdown />
                  </NavigationMenuList>
                </NavigationMenu>

                <div className="hidden md:flex items-center gap-2 lg:gap-4">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Link
                        href="/client-login"
                        className={`${buttonVariants({
                          variant: "ghost",
                          size: "lg",
                        })} uppercase text-xs hover:bg-transparent! hover:font-extrabold cursor-pointer`}
                      >
                        Login
                      </Link>
                    </HoverCardTrigger>
                    <HoverCardContent className="bg-primary px-8 border-none">
                      <div className="border-y-1 border-accent/40">
                        <Link
                          href="/client-login"
                          className={`${buttonVariants({
                            variant: "link",
                          })} uppercase cursor-pointer text-white`}
                        >
                          Clients
                        </Link>
                      </div>
                      <div className="border-b-1 border-accent/40">
                        <Link
                          href="/employee-login"
                          className={`${buttonVariants({
                            variant: "link",
                          })} uppercase cursor-pointer text-white`}
                        >
                          Employee
                        </Link>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <AnimatedButton
                    asChild
                    className="text-xs hidden sm:flex"
                    size="lg"
                    href="https://calendly.com/obrive-inc/talk-to-ob-experts"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Schedule a call with our experts on Calendly"
                    iconSize={16}
                  >
                    Schedule A Call
                  </AnimatedButton>
                </div>

                {/* mobile menu button - hidden on mobile since we have fixed button */}
                <button
                  className="hidden"
                  onClick={toggleMenu}
                  aria-label="Toggle menu"
                  data-menu-toggle="true"
                  data-testid="menu-toggle-nav"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </nav>
            </div>
          </FadeInOnLoad>
        )}
      </header>

      {/* mobile navigation - full screen with accordion - outside header for proper fixed positioning */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 bg-accent z-[100] md:hidden overflow-y-auto"
        >
          <div className="min-h-screen flex flex-col p-6 pt-20">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {MOBILE_NAV_STRUCTURE.map((section) => (
                <AccordionItem
                  key={section.title}
                  value={section.title}
                  className="border-b border-primary/20"
                >
                  <AccordionTrigger className="text-primary uppercase text-sm font-semibold hover:no-underline">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 pl-4">
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="text-primary/80 hover:text-primary text-sm block py-1"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 space-y-4 pt-4 border-t border-primary/20">
              <Link
                href="/client-login"
                className={`${buttonVariants({
                  variant: "default",
                })} uppercase text-xs w-full bg-primary text-white`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="https://calendly.com/obrive-inc/talk-to-ob-experts"
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonVariants({
                  variant: "default",
                })} text-xs w-full bg-primary text-white`}
                onClick={() => setIsMenuOpen(false)}
              >
                Schedule A Call
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
