"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  categorySlug: string;
  url: string;
  published_at: string;
}

export function HomeHeroSection() {
  const [heroData, setHeroData] = useState<{
    breakingNews: Article | null;
    is_highlightedArticles: Article[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/home/hero");

        if (!response.ok) {
          throw new Error("Failed to fetch hero data");
        }

        const data = await response.json();
        setHeroData(data);
      } catch (err) {
        console.error("Error fetching hero data:", err);
        setError("Failed to load featured articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (isLoading) {
    return (
      <section className="bg-gradient-to-b from-secondary to-background py-8 md:py-12">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 h-[300px] md:h-[400px] bg-muted animate-pulse rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-[300px] bg-muted animate-pulse rounded-lg"></div>
              <div className="h-[300px] bg-muted animate-pulse rounded-lg"></div>
              <div className="h-[300px] bg-muted animate-pulse rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-b from-secondary to-background py-8 md:py-12">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center py-8 md:py-12 max-w-md">
              <h3 className="text-xl font-medium mb-3 text-foreground">
                Something went wrong
              </h3>
              <p className="text-red-500 mb-6">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!heroData) {
    return (
      <section className="bg-gradient-to-b from-secondary to-background py-8 md:py-12">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center py-8 md:py-12">
              <p className="text-muted-foreground text-lg">
                No featured articles available at this time
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-secondary to-background py-8 md:py-12">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          {/* Breaking News - Full Width with Image Left and Content Right */}
          {heroData.breakingNews && (
            <Card className="w-full overflow-hidden border-0 shadow-lg">
              <div className="flex flex-col md:flex-row">
                {/* Image on Left */}
                <div className="md:w-1/2">
                  <div className="relative h-full min-h-[300px] md:min-h-[400px]">
                    <Image
                      src={heroData.breakingNews.image || "/thumbnail.jpg"}
                      fill
                      alt={heroData.breakingNews.title}
                      className="object-cover"
                      priority
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded">
                        {heroData.breakingNews.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content on Right */}
                <div className="md:w-1/2 p-6 bg-background flex flex-col justify-center">
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4 mr-1.5" />
                    <span>
                      {formatTimeAgo(heroData.breakingNews.published_at)}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="font-medium text-primary">
                      Breaking News
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 hover:text-primary transition-colors duration-200">
                    <Link href={heroData.breakingNews.url}>
                      {heroData.breakingNews.title}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground mb-6 text-base lg:text-lg">
                    {heroData.breakingNews.excerpt}
                  </p>
                  <Button variant="default" size="lg" className="w-fit" asChild>
                    <Link href={heroData.breakingNews.url}>
                      Read Full Story
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Highlighted Articles - Grid Below */}
          {heroData.is_highlightedArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {heroData.is_highlightedArticles.map((article) => (
                <Card
                  key={article.id}
                  className="overflow-hidden border-0 shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <div className="relative">
                    <Image
                      src={article.image || "/thumbnail.jpg"}
                      width={600}
                      height={300}
                      alt={article.title}
                      className="w-full object-cover aspect-[16/9]"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTimeAgo(article.published_at)}</span>
                    </div>
                    <h3 className="text-base md:text-lg font-serif font-bold mb-1.5 hover:text-primary transition-colors duration-200">
                      <Link href={article.url}>{article.title}</Link>
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State for Highlighted Articles */}
          {heroData.is_highlightedArticles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No highlighted articles available
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
