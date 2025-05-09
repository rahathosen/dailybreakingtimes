"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const breakingNews = [
  "Global Leaders Reach Historic Climate Agreement at Summit",
  "Tech Giants Unveil Revolutionary AI Platform",
  "Markets Surge as Central Bank Announces New Policy",
  "Major Breakthrough in Cancer Research Announced",
  "Historic Peace Deal Signed in Middle East Conflict",
];

export default function BreakingNews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % breakingNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? breakingNews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % breakingNews.length);
  };

  return (
    <div className="bg-primary text-primary-foreground py-2 mb-6">
      <div className="container mx-auto px-4 flex items-center">
        <div className="font-bold mr-4 whitespace-nowrap">BREAKING:</div>
        <div className="flex-1 overflow-hidden">
          <div className="whitespace-nowrap overflow-hidden text-ellipsis">
            {breakingNews[currentIndex]}
          </div>
        </div>
        <div className="flex space-x-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
