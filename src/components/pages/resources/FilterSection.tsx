"use client";

import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import { Button } from "@/components/ui/button";
import { filters } from "@/constants/pages/resources/filters";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const FilterSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "All";

  const handleFilterChange = useCallback(
    (filter: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (filter === "All") {
        params.delete("filter");
      } else {
        params.set("filter", filter);
      }

      // reset to page 1 when filter changes
      params.delete("page");

      const queryString = params.toString();
      const url = queryString ? `/resources?${queryString}` : "/resources";
      router.push(url);
    },
    [router, searchParams]
  );

  return (
    <section className="flex items-center justify-center gap-4 border-y-2 border-secondary/40 my-8 py-8">
      <FullWidthSection backgroundColor="none">
        <div className="flex items-center gap-4">
          <h4 className="text-secondary text-sm uppercase">Filter:</h4>
          <div className="flex flex-wrap gap-4">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={currentFilter === filter ? "default" : "outline"}
                className={`uppercase text-secondary text-[10px] cursor-pointer rounded-full ${
                  currentFilter === filter ? "bg-primary text-white" : ""
                }`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </FullWidthSection>
    </section>
  );
};

export default FilterSection;
