"use client";

import FONTS from "@/assets/fonts";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";

const CONSENT_STORAGE_KEY = "cookie_consent";

const hasCookieConsent = () => {
  if (typeof document === "undefined") return false;

  return document.cookie
    .split("; ")
    .some((row) => row.startsWith(`${CONSENT_STORAGE_KEY}=`));
};

export default function CookiePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored || hasCookieConsent()) return;

    setShow(true);
  }, []);

  const handleChoice = useCallback(async (value: "accepted" | "rejected") => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(CONSENT_STORAGE_KEY, value);
      }

      await fetch("/api/cookie-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
        credentials: "same-origin",
      });
    } catch (e) {
      console.error("Failed to persist cookie consent", e);
    } finally {
      setShow(false);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm w-full overflow-hidden drop-shadow-2xl">
      <div className="relative bg-accent rounded-xl shadow-[0_18px_36px_-14px_rgba(7,65,57,0.42)] p-4 sm:p-6 w-full text-left">
        {/* <Image
          src={imga}
          alt="Decoration left"
          className="absolute bottom-0 left-0 w-32 opacity-80"
        /> */}
        {/* <Image
          src={image}
          alt="Decoration right"
          className="absolute top-0 right-0 w-32 rotate-180 opacity-80"
        /> */}
        <p className={`leading-relaxed text-sm z-10 relative`}>
          We use cookies to enhance your browsing experience, analyze site
          traffic, and improve our services. By continuing to use our site, you
          agree to our use of cookies.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-start z-10 relative">
          <Button
            onClick={() => handleChoice("accepted")}
            size={"lg"}
            variant={"outline"}
            className={`${FONTS.microgrammaBold.className} text-primary`}
          >
            ACCEPT
          </Button>
          <Button
            onClick={() => handleChoice("rejected")}
            size={"lg"}
            variant={"outline"}
            className={`${FONTS.microgrammaBold.className} text-primary`}
          >
            DECLINE
          </Button>
        </div>
      </div>
    </div>
  );
}
