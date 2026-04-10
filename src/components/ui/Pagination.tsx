import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl = "/resources",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl;
    return `${baseUrl}?page=${page}`;
  };

  const renderPageButton = (page: number, isActive: boolean = false) => (
    <Link
      key={page}
      href={getPageUrl(page)}
      className={cn(
        "w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-white border-primary"
          : "bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary"
      )}
    >
      {page}
    </Link>
  );

  const pages = [];

  // Always show first page
  if (currentPage > 3) {
    pages.push(renderPageButton(1));
    if (currentPage > 4) {
      pages.push(
        <span key="ellipsis1" className="px-2 text-gray-400">
          ...
        </span>
      );
    }
  }

  // Show pages around current page
  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    pages.push(renderPageButton(i, i === currentPage));
  }

  // Always show last page
  if (currentPage < totalPages - 2) {
    if (currentPage < totalPages - 3) {
      pages.push(
        <span key="ellipsis2" className="px-2 text-gray-400">
          ...
        </span>
      );
    }
    pages.push(renderPageButton(totalPages));
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-16">{pages}</div>
  );
}
