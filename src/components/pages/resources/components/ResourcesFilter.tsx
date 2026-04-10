"use client";

import { Button } from "@/components/ui/button";
import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import { filters } from "@/constants/pages/resources/filters";

interface ResourcesFilterProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  isTransitioning: boolean;
}

const ResourcesFilter = ({
  currentFilter,
  onFilterChange,
  isTransitioning,
}: ResourcesFilterProps) => {
  return (
    <section className="border-y border-secondary/20 my-4 sm:my-6 lg:my-8 py-4 sm:py-6 lg:py-8">
      <FullWidthSection backgroundColor="none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <h4 className="text-secondary text-xs sm:text-sm uppercase font-medium whitespace-nowrap">
            Filter:
          </h4>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={currentFilter === filter ? "default" : "outline"}
                className={`uppercase text-secondary text-[10px] sm:text-[11px] cursor-pointer rounded-full transition-all duration-200 px-3 sm:px-4 py-1.5 sm:py-2 h-auto ${
                  currentFilter === filter ? "bg-primary text-white" : ""
                }`}
                onClick={() => onFilterChange(filter)}
                disabled={isTransitioning}
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

export default ResourcesFilter;
