"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, TrendingUp, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

interface TrendingArticle {
  id: number;
  title: string;
  category: string;
  categorySlug: string;
  url: string;
  time: string;
  reads: string;
}

export function TrendingSection() {
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/home/trending");

        if (!response.ok) {
          throw new Error("Failed to fetch trending articles");
        }

        const data = await response.json();
        setTrendingArticles(data);
      } catch (err) {
        console.error("Error fetching trending articles:", err);
        setError("Failed to load trending articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingArticles();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <section className="premium-section">
        <div className="premium-container">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            <h2 className="premium-heading text-2xl font-serif">
              Trending Now
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="premium-card">
                <CardContent className="p-5">
                  <div className="h-4 bg-muted animate-pulse rounded mb-3 w-1/3"></div>
                  <div className="h-16 bg-muted animate-pulse rounded mb-3"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="premium-section">
        <div className="premium-container">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            <h2 className="premium-heading text-2xl font-serif">
              Trending Now
            </h2>
          </div>

          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // No articles state
  if (trendingArticles.length === 0) {
    return (
      <section className="premium-section">
        <div className="premium-container">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            <h2 className="premium-heading text-2xl font-serif">
              Trending Now
            </h2>
          </div>

          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No trending articles available yet
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="premium-section">
      <div className="premium-container">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          <h2 className="premium-heading text-2xl font-serif">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingArticles.map((article) => (
            <Card
              key={article.id}
              className="premium-card hover:border-primary"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="category-label">{article.category}</span>
                  <span className="text-xs font-medium flex items-center text-muted-foreground">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {article.reads}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold mb-3 line-clamp-2 hover:text-primary transition-colors duration-200">
                  <Link href={article.url}>{article.title}</Link>
                </h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{article.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
