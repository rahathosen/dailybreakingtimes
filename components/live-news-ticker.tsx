"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
interface LiveNewsItem {
  id: number;
  text: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  url: string;
  time: string;
  isBreaking?: boolean;
}

export function LiveNewsTicker() {
  const [news, setNews] = useState<LiveNewsItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Check if should be visible based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch live news
  useEffect(() => {
    const fetchLiveNews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/live-news");

        if (!response.ok) {
          throw new Error("Failed to fetch live news");
        }

        const data = await response.json();

        if (data.length > 0) {
          setNews(data);
        } else {
          // Fallback data if no news
          setNews([
            {
              id: 0,
              text: "No recent news available",
              excerpt: "Check back later for updates",
              category: "General",
              categorySlug: "general",
              url: "#",
              time: "Now",
              isBreaking: false,
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching live news:", err);
        setError("Failed to load live news");
        // Set fallback data
        setNews([
          {
            id: 0,
            text: "Unable to load news updates",
            excerpt: "Please try again later",
            category: "Error",
            categorySlug: "",
            url: "#",
            time: "Now",
            isBreaking: false,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveNews();

    // Refresh live news every 2 minutes
    const intervalId = setInterval(fetchLiveNews, 2 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Auto-rotate news items
  useEffect(() => {
    if (isPaused || news.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isPaused, news.length]);

  // Simulate breaking news (for demo purposes)
  useEffect(() => {
    // This would be replaced by real-time updates in production
    const breakingNewsTimeout = setTimeout(() => {
      // Check if we already have this breaking news
      const hasBreakingNews = news.some((item) =>
        item.text.includes("Major earthquake reported")
      );

      if (!hasBreakingNews && news.length > 0) {
        const newBreakingNews: LiveNewsItem = {
          id: Date.now(),
          text: "BREAKING: Major earthquake reported off the coast, tsunami warnings issued",
          excerpt:
            "Authorities have issued evacuation orders for coastal areas. Stay tuned for updates.",
          category: "Weather",
          categorySlug: "weather",
          url: "#",
          time: "Just now",
          isBreaking: true,
        };

        setNews([newBreakingNews, ...news]);
        setCurrentIndex(0);

        // Play sound effect if not muted
        if (!isMuted) {
          const audio = new Audio("/notification.mp3"); // This would be a real sound file in production
          audio.play().catch((e) => console.log("Audio play failed:", e));
        }
      }
    }, 30000); // Add breaking news after 30 seconds

    return () => clearTimeout(breakingNewsTimeout);
  }, [news, isMuted]);

  if (!isVisible) return null;

  const currentNews = news[currentIndex] || {
    id: 0,
    text: "Loading...",
    excerpt: "",
    category: "",
    categorySlug: "",
    url: "#",
    time: "",
    isBreaking: false,
  };

  return (
    <div
      ref={tickerRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background border-t transition-all duration-300",
        isExpanded ? "h-[300px]" : "h-12"
      )}
    >
      <div className="container mx-auto h-full">
        {/* Collapsed view */}
        <div className="h-12 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="font-medium text-sm">LIVE UPDATES</span>
            {currentNews.isBreaking && (
              <Badge variant="destructive" className="text-[10px] h-5">
                BREAKING
              </Badge>
            )}
          </div>

          <div className="flex-1 mx-4 overflow-hidden">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : error ? (
              <div className="text-sm text-destructive">{error}</div>
            ) : (
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="text-sm font-medium">
                  {currentNews.category}:{" "}
                </span>
                <span className="text-sm">{currentNews.text}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded view */}
        {isExpanded && (
          <div className="h-[calc(300px-3rem)] overflow-y-auto p-4">
            <h3 className="font-serif text-xl font-bold mb-4">
              Live News Updates
            </h3>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mt-2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                {news.map((item, index) => (
                  <Link
                    href={item.url}
                    key={item.id}
                    className={cn(
                      "p-3 border rounded-md block hover:bg-accent/50 transition-colors",
                      item.isBreaking
                        ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                        : "",
                      currentIndex === index ? "ring-2 ring-primary" : ""
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] h-5">
                          {item.category}
                        </Badge>
                        {item.isBreaking && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] h-5"
                          >
                            BREAKING
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{item.text}</p>
                    {item.excerpt && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
