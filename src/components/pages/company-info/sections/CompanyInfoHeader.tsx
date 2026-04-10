import React from "react";
import FONTS from "@/assets/fonts";
import { CalendarMinus2, CircleUserRound } from "lucide-react";

interface CompanyInfoHeaderProps {
  title: string;
  company?: string;
  date?: string;
  lastUpdated?: string;
}

export default function CompanyInfoHeader({
  title,
  company = "Obrive Industries Private Limited",
  date,
  lastUpdated,
}: CompanyInfoHeaderProps) {
  return (
    <div>
      <div>
        <h1
          className={`${FONTS.microgrammaBold.className} text-2xl sm:text-3xl text-secondary mb-1`}
        >
          {title}
        </h1>
        <div className="text-sm flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span>
              <CircleUserRound className="size-4" />
            </span>
            <span className="max-sm:text-[10px]">{company}</span>
          </div>
          {date && (
            <div className="flex items-center gap-2">
              <span>
                <CalendarMinus2 className="size-4" />{" "}
              </span>
              <span className="max-sm:text-[10px]">{date}</span>
            </div>
          )}
        </div>
      </div>

      {lastUpdated && (
        <div className="text-sm mt-10">
          <span className={`${FONTS.microgrammaBold.className}`}>
            Last updated:
          </span>{" "}
          {lastUpdated}
        </div>
      )}
    </div>
  );
}
