"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isTransitioning: boolean;
}

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isTransitioning,
}: CustomPaginationProps) => {
  const getPageNumbers = useMemo(() => {
    const pages: number[] = [];
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const maxVisiblePages = isMobile ? 3 : 5;

    const half = Math.floor(maxVisiblePages / 2);
    const start = Math.max(
      1,
      Math.min(currentPage - half, totalPages - maxVisiblePages + 1)
    );
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <motion.div
      className="flex items-center justify-center gap-1 sm:gap-2 my-8 sm:my-12 lg:my-16 px-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        className="w-11 h-11 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-gray-300 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 text-sm sm:text-base"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isTransitioning}
        aria-label="Previous page"
      >
        ‹
      </Button>

      {/* Page Numbers */}
      {getPageNumbers.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          className={`w-11 h-11 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 text-xs sm:text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary"
          }`}
          onClick={() => onPageChange(page)}
          disabled={isTransitioning}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Button>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        className="w-11 h-11 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-gray-300 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 text-sm sm:text-base"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isTransitioning}
        aria-label="Next page"
      >
        ›
      </Button>
    </motion.div>
  );
};

export default CustomPagination;
