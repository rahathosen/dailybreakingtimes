"use client";

import { useState, useEffect, useRef } from "react";
import { Expand, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LiveNewsItem {
  id: number;
  text: string;
  category: string;
  time: string;
  isBreaking?: boolean;
}

export function LiveNewsTicker() {
  const [news, setNews] = useState<LiveNewsItem[]>([
    {
      id: 1,
      text: "Supreme Court rules on landmark privacy case, setting new precedent for digital data",
      category: "Politics",
      time: "2 min ago",
      isBreaking: true,
    },
    {
      id: 2,
      text: "Major tech company announces revolutionary AI product at annual conference",
      category: "Technology",
      time: "5 min ago",
    },
    {
      id: 3,
      text: "Stock markets reach record highs following positive economic data",
      category: "Business",
      time: "12 min ago",
    },
    {
      id: 4,
      text: "Scientists discover potential breakthrough in cancer treatment research",
      category: "Health",
      time: "18 min ago",
      isBreaking: true,
    },
    {
      id: 5,
      text: "Olympic committee announces host city for 2036 Summer Games",
      category: "Sports",
      time: "25 min ago",
    },
  ]);

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Auto-rotate news items
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isPaused, news.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const breakingNewsTimeout = setTimeout(() => {
      const newBreakingNews: LiveNewsItem = {
        id: Date.now(),
        text: "BREAKING: Major earthquake reported off the coast, tsunami warnings issued",
        category: "Weather",
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
    }, 30000); // Add breaking news after 30 seconds

    return () => clearTimeout(breakingNewsTimeout);
  }, [news, isMuted]);

  const currentNews = news[currentIndex];

  if (!isVisible) return null;

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
            <div className="whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-sm font-medium">
                {currentNews.category}:{" "}
              </span>
              <span className="text-sm">{currentNews.text}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expanded view */}
        {isExpanded && (
          <div className="h-[calc(300px-3rem)] overflow-y-auto p-4">
            <h3 className="font-serif text-xl font-bold mb-4">
              Live News Updates
            </h3>
            <div className="space-y-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-3 border rounded-md",
                    item.isBreaking
                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                      : "",
                    currentIndex === news.findIndex((n) => n.id === item.id)
                      ? "ring-2 ring-primary"
                      : ""
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
                  <p className="text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
