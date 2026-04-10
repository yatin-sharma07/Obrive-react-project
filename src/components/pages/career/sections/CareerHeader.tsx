import FONTS from "@/assets/fonts";
import React from "react";

interface CareerHeaderProps {
  title: string;
  location: string;
  postedOn: string;
  employmentType: string;
  salaryRange: string;
}

export default function CareerHeader({
  title,
  location,
  postedOn,
  employmentType,
  salaryRange,
}: CareerHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className={`${FONTS.microgrammaBold.className} text-primary text-4xl mb-4`}>
        {title}
      </h1>
      <div className="flex flex-col gap-2">
        <p className="text-sm leading-relaxed text-gray-700 max-w-3xl">
          Location: {location}
        </p>
        <p className="text-sm leading-relaxed text-gray-700 max-w-3xl">
          Posted On: {postedOn}
        </p>
        <p className="text-sm leading-relaxed text-gray-700 max-w-3xl">
          Employment Type: {employmentType}
        </p>
        <p className="text-sm leading-relaxed text-gray-700 max-w-3xl">
          Salary Range: {salaryRange}
        </p>
      </div>
    </div>
  );
}
