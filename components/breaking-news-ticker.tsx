"use client";

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface BreakingNewsItem {
  id: number;
  title: string;
  url: string;
}

export function BreakingNewsTicker() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch breaking news
  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/breaking-news");

        if (!response.ok) {
          throw new Error("Failed to fetch breaking news");
        }

        const data = await response.json();

        if (data.length > 0) {
          setBreakingNews(data);
        } else {
          // Fallback data if no breaking news
          setBreakingNews([
            {
              id: 0,
              title: "No breaking news at the moment",
              url: "#",
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching breaking news:", err);
        setError("Failed to load breaking news");
        // Set fallback data
        setBreakingNews([
          {
            id: 0,
            title: "Unable to load breaking news",
            url: "#",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreakingNews();

    // Refresh breaking news every 5 minutes
    const intervalId = setInterval(fetchBreakingNews, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Rotate through breaking news
  useEffect(() => {
    if (breakingNews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) =>
        prevIndex === breakingNews.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNews.length]);

  // If there's no breaking news, don't show the ticker
  if (breakingNews.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-foreground py-1 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex items-center gap-2 font-bold mr-4 whitespace-nowrap">
            <AlertTriangle className="h-4 w-4" />
            <span>BREAKING:</span>
          </div>
          <div className="overflow-hidden relative h-6 flex-1">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : error ? (
              <div className="text-sm">{error}</div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNewsIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute whitespace-nowrap"
                >
                  <Link
                    href={breakingNews[currentNewsIndex]?.url || "#"}
                    className="hover:underline"
                  >
                    {breakingNews[currentNewsIndex]?.title || "Loading..."}
                  </Link>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
