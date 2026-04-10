"use client";

import { motion } from "framer-motion";
import BlogGridCard from "@/components/pages/resources/card/BlogGridCard";
import RoundedBallIcon from "@/components/shared/icons/RoundedBallIcon";
import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import { BlogCardContent } from "@/constants/pages/resources/blog-card";

interface ArticlesGridProps {
  currentBlogs: (typeof BlogCardContent)[number][];
  currentFilter: string;
  currentPage: number;
}

const ArticlesGrid = ({
  currentBlogs,
  currentFilter,
  currentPage,
}: ArticlesGridProps) => {
  return (
    <section className="py-6 px-3 sm:px-6 lg:px-8">
      <FullWidthSection backgroundColor="none">
        <div className="px-2 sm:px-4 lg:px-0">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <RoundedBallIcon />
            <h3 className="uppercase text-xs sm:text-sm font-medium text-center">
              All Articles
            </h3>
          </div>

          {/* Articles Grid with Smooth Transitions */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16 mt-6 sm:mt-8 lg:mt-10"
            key={`${currentFilter}-${currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {currentBlogs.map((item, index) => (
              <motion.div
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="w-full"
              >
                <BlogGridCard {...item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </FullWidthSection>
    </section>
  );
};

export default ArticlesGrid;
