"use client";

import { motion, AnimatePresence } from "framer-motion";
import FeaturedCard from "@/components/pages/resources/card/FeaturedCard";
import PopularCard from "@/components/pages/resources/card/PopularCard";
import TwoDotIcons from "@/components/shared/icons/TwoDotIcons";
import FullWidthSection from "@/components/shared/layout/FullWidthSection";
import { PopularCardContent } from "@/constants/pages/resources/popular-card";

interface FeaturedPopularSectionProps {
  showFeaturedAndPopular: boolean;
}

const FeaturedPopularSection = ({
  showFeaturedAndPopular,
}: FeaturedPopularSectionProps) => {
  return (
    <AnimatePresence mode="wait">
      {showFeaturedAndPopular && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <FullWidthSection backgroundColor="none">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:flex-1">
                <div className="flex items-center gap-3 pl-8 mb-4">
                  <TwoDotIcons />
                  <h3 className="uppercase text-sm">Featured</h3>
                </div>
                <FeaturedCard />
              </div>
              <div className="w-full lg:max-w-lg xl:max-w-xl">
                <div className="flex items-center gap-3 mb-4 pl-8">
                  <TwoDotIcons />
                  <h3 className="uppercase text-sm">Popular</h3>
                </div>
                <div className="flex flex-col gap-6 lg:gap-8">
                  {PopularCardContent.map((item) => (
                    <PopularCard key={item.title} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </FullWidthSection>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default FeaturedPopularSection;
