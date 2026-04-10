"use client";
import React, { useState } from "react";

const options = [
  "Strongly Disagree",
  "Somewhat Disagree",
  "Neutral Unsure",
  "Somewhat Agree",
  "Strongly Agree",
];

export default function MoreDetails({
  props,
  setStage,
}: {
  props: { title: string };
  setStage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleChange = async (e: number) => {
    if (loading) return; // Prevent duplicate clicks
    
    setSelected(e);
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay

    setLoading(false);
    // Advance to the next stage; completion handling is managed by the parent page via useEffect
    setStage((prev) => prev + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      {/* Question */}
      <h2 className="mb-12 text-center text-lg font-bold text-[#074139]">
        {props.title}
      </h2>

      {/* Scale */}
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between">
          {options.map((label, index) => (
            <div key={label} className="flex flex-col items-center flex-1">
              {/* Circle */}
              <button
                onClick={() => handleChange(index)}
                disabled={loading}
                className={`h-8 w-8 rounded-full border-2 transition z-50 ${
                  selected !== null && index <= selected
                    ? "bg-[#CAEDE5] border-[#CAEDE5]"
                    : "bg-gray-200 border-[#D9D9D9] hover:bg-[#D9D9D9]"
                } ${
                  loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
              />
              {/* Label */}
              <span className="mt-3 text-xs text-gray-700 text-center w-16">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress line */}
        <div className="relative mt-[-18px]  w-full sm:ml-10 sm:w-11/12 md:ml-16 md:w-5/6">
          <div className="absolute left-0 right-0 top-1/2 h-3 -translate-y-12 bg-[#D9D9D9] rounded-full" />
          {selected !== null && (
            <div
              className="absolute left-0 top-1/2 h-3 -translate-y-12 bg-[#CAEDE5] transition-all rounded-full"
              style={{
                width: `${(selected / (options.length - 1)) * 100}%`,
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
