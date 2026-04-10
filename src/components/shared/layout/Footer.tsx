import Image from "next/image";
import Link from "next/link";
import FONTS from "@/assets/fonts";
import { IMAGES, IMAGES_META } from "@/assets/images";
import { GROUPS, PRIMARY_FOOTER_CARD, SOCIAL_LINKS } from "@/constants/Footer";
import PrimaryFooterCard from "../cards/PrimaryFooterCard";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Footer() {
  const cell =
    "border border-primary/30 rounded-lg text-xs p-3 text-sm text-primary/70 hover:text-white transition-colors duration-500 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-primary before:scale-y-0 before:origin-center hover:before:scale-y-100 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.19,1,0.22,1)] before:-z-10 z-10";

  const contactCellBase =
    "relative overflow-hidden border border-primary/30 rounded-lg text-xs text-primary/80 transition-colors duration-500 hover:text-white before:content-[''] before:absolute before:inset-0 before:bg-primary before:scale-y-0 before:origin-center hover:before:scale-y-100 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.19,1,0.22,1)] before:-z-10 z-10";
  return (
    <footer aria-label="Site footer" className="py-16">
      <div className="flex w-full flex-col gap-12">
        <PrimaryFooterCard {...PRIMARY_FOOTER_CARD} />

        {/* Links Grid */}
        <section className="w-full flex flex-col gap-12">
          {/* Logo */}
          <div>
            <Image
              src={IMAGES.MAIN_LOGO}
              alt={IMAGES_META.MAIN_LOGO.alt}
              width={IMAGES_META.MAIN_LOGO.width}
              height={IMAGES_META.MAIN_LOGO.height}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ">
            {GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col">
                <div
                  className={`border border-primary/40 py-2 px-3 font-semibold text-primary rounded-lg ${FONTS.microgrammaBold.className}`}
                >
                  {group.title}
                </div>
                {group.items.map((item) => (
                  <Link key={item.label} href={item.href} className={cell}>
                    {item.label}
                  </Link>
                ))}
                <div className="border border-primary/30 rounded-lg p-5  text-xs text-primary/80"></div>
                <div className="border border-primary/30 rounded-lg p-5  text-xs text-primary/80"></div>
                <div className="border border-primary/30 rounded-lg p-5  text-xs text-primary/80"></div>
              </div>
            ))}

            {/* Contact column */}
            <div className="flex flex-col">
              <div
                className={`border border-primary/40 py-2 px-3 font-semibold text-primary rounded-lg ${FONTS.microgrammaBold.className}`}
              >
                Contact
              </div>
              <div className={`${contactCellBase} p-3`}>+91-888-477-4300</div>
              <a
                href="mailto:info@obrive.com"
                className={`${contactCellBase} p-3`}
              >
                info@obrive.com
              </a>
              <div className={`${contactCellBase} p-3`}>
                Bangalore, Karnataka, India
              </div>
              <div className={`${contactCellBase} p-3`}>
                Ahmedabad, Gujarat, India
              </div>
              <div className={`${contactCellBase} p-5`}></div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link
                    href="/client-login"
                    className={`${contactCellBase} py-3 px-6 uppercase tracking-wide text-xs`}
                  >
                    Log In
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent
                  side="top"
                  align="start"
                  sideOffset={12}
                  className="bg-primary text-white border-none rounded-2xl p-4 w-[220px] shadow-lg"
                >
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/client-login"
                      className="uppercase text-xs tracking-wide hover:text-accent transition-colors"
                    >
                      Client Login
                    </Link>
                    <Link
                      href="/employee-login"
                      className="uppercase text-xs tracking-wide hover:text-accent transition-colors"
                    >
                      Employee Login
                    </Link>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <div className="border border-primary/30 flex items-center gap-2 justify-between rounded-lg py-3 px-6 text-xs text-primary/80">
                {SOCIAL_LINKS.map(({ href, icon, meta }) => (
                  <Link
                    key={meta.alt}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={icon}
                      alt={meta.alt}
                      width={meta.width}
                      height={meta.height}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary/60">
            <div className="flex gap-6">
              <Link href="/legal" className="hover:text-primary">
                Legal Notice
              </Link>
              <Link href="/legal/accessibility" className="hover:text-primary">
                Terms & Accessibility
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <p>Copyrights Reserved 2025</p>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}
