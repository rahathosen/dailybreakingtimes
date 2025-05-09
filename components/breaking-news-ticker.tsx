"use client";

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function BreakingNewsTicker() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const breakingNews = [
    "Supreme Court Rules on Landmark Privacy Case",
    "Major Breakthrough in Cancer Treatment Announced",
    "Stock Markets Reach Record Highs Amid Economic Data",
    "Olympic Committee Announces Host City for 2036 Games",
    "Tech Giants Unveil New AI Ethics Guidelines",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) =>
        prevIndex === breakingNews.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNews.length]);

  return (
    <div className="bg-primary text-primary-foreground py-1 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex items-center gap-2 font-bold mr-4 whitespace-nowrap">
            <AlertTriangle className="h-4 w-4" />
            <span>BREAKING:</span>
          </div>
          <div className="overflow-hidden relative h-6 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNewsIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute whitespace-nowrap"
              >
                <Link href="#" className="hover:underline">
                  {breakingNews[currentNewsIndex]}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
