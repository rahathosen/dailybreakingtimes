"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  viewCount: number;
  featured_image: string | null;
  createdAt: string;
  is_published?: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ApiCategoryResponse {
  category: Category;
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    totalArticles: number;
    totalPages: number;
  };
}

interface CategoryArticleProps {
  category: Category;
  articles: Article[];
}

export function CategorySection({ category, articles }: CategoryArticleProps) {
  // Filter only published articles if needed
  const filteredArticles = articles.filter(
    (article) => article.is_published !== false
  );
  const mainArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1, 3);

  if (!category) return null;

  return (
    <div>
      <h2 className="premium-heading text-2xl font-serif">
        <Link
          href={`/${category.slug}`}
          className="hover:text-primary transition-colors duration-200"
        >
          {category.name}
        </Link>
      </h2>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No articles found in this category
        </div>
      ) : (
        <div className="space-y-6">
          {mainArticle && (
            <Card className="premium-card">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative">
                  <Image
                    src={
                      mainArticle.featured_image ||
                      `/placeholder.svg?height=300&width=600&text=${category.name}1`
                    }
                    width={600}
                    height={300}
                    alt={mainArticle.title}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <CardContent className="p-5">
                  <span className="category-label mb-2 inline-block">
                    {category.name}
                  </span>
                  <h3 className="text-lg font-serif font-bold mb-2 hover:text-primary transition-colors duration-200">
                    <Link href={`/${category.slug}/${mainArticle.slug}`}>
                      {mainArticle.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {mainArticle.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{mainArticle.viewCount} views</span>
                    </div>
                    <span className="mx-2">•</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {mainArticle.createdAt
                        ? formatDistanceToNow(new Date(mainArticle.createdAt), {
                            addSuffix: true,
                          })
                        : "Recently"}
                    </span>
                  </div>
                </CardContent>
              </div>
            </Card>
          )}

          {otherArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherArticles.map((article) => (
                <Card key={article.id} className="premium-card">
                  <CardContent className="p-4">
                    <span className="text-xs text-primary font-medium">
                      {category.name}
                    </span>
                    <h4 className="text-base font-serif font-bold my-2 hover:text-primary transition-colors duration-200">
                      <Link href={`/${category.slug}/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{article.viewCount} views</span>
                      </div>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {article.createdAt
                          ? formatDistanceToNow(new Date(article.createdAt), {
                              addSuffix: true,
                            })
                          : "Recently"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="premium-section">
        <div className="premium-container">
          <div className="premium-divider"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 w-48 bg-muted rounded mb-6"></div>
                <div className="space-y-6">
                  <div className="h-64 bg-muted rounded"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-32 bg-muted rounded"></div>
                    <div className="h-32 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="premium-section">
        <div className="premium-container">
          <div className="text-center py-8 text-destructive">{error}</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="premium-section">
        <div className="premium-container">
          <div className="text-center py-8 text-muted-foreground">
            No categories found
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="premium-section">
      <div className="premium-container">
        <div className="premium-divider"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
          {categories.map((category) => (
            <CategorySectionLoader
              key={category.slug}
              slug={category.slug}
              name={category.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategorySectionLoader({ slug, name }: { slug: string; name: string }) {
  const [categoryData, setCategoryData] = useState<ApiCategoryResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await fetch(`/api/categories/${slug}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Category data:", data); // Debug log
        setCategoryData(data);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Failed to load category articles.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [slug]);

  if (loading) {
    return (
      <div>
        <h2 className="premium-heading text-2xl font-serif">{name}</h2>
        <div className="space-y-6">
          <div className="h-64 bg-muted rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-muted rounded animate-pulse"></div>
            <div className="h-32 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="premium-heading text-2xl font-serif">{name}</h2>
        <div className="text-center py-8 text-destructive">{error}</div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div>
        <h2 className="premium-heading text-2xl font-serif">{name}</h2>
        <div className="text-center py-8 text-muted-foreground">
          No category data available
        </div>
      </div>
    );
  }

  return (
    <CategorySection
      category={categoryData.category}
      articles={categoryData.articles}
    />
  );
}
