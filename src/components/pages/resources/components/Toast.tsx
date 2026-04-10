"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function CustomToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <div className="bg-[#198450] text-white px-6 py-2 rounded-lg shadow-lg text-sm">
            Link copied
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}