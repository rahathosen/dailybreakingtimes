import { notFound } from "next/navigation";
import { ArticleHeader } from "@/components/article/article-header";
import { ArticleContent } from "@/components/article/article-content";
import { ArticleFooter } from "@/components/article/article-footer";
import { RelatedArticles } from "@/components/article/related-articles";
import { MostViewedArticles } from "@/components/article/most-viewed-articles";
import { RecentArticles } from "@/components/article/recent-articles";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";

interface ArticleData {
  title: string;
  category: {
    name: string;
    slug: string;
  };
  subcategory: {
    name: string;
    slug: string;
  } | null;
  published_at: Date;
  content: string;
  excerpt: string;
  featured_image: string | null;
  tags: {
    tag: {
      name: string;
      slug: string;
    };
  }[];
  viewCount: number;
}

async function getArticleData(category: string, slug: string) {
  try {
    // Find the category by slug
    const categoryData = await prisma.category.findFirst({
      where: {
        slug: category,
      },
    });

    if (!categoryData) {
      return null;
    }

    // Find the article by slug and category
    const article = await prisma.article.findFirst({
      where: {
        slug: slug,
        categoryId: categoryData.id,
        published_at: {
          lte: new Date(),
        },
      },
      include: {
        category: true,
        subcategory: true,
        tags: {
          include: {
            tag: true,
          },
        },
        news_type: true,
      },
    });

    if (!article) {
      return null;
    }

    // Get related articles
    const relatedArticles = await prisma.article.findMany({
      where: {
        OR: [
          { categoryId: article.categoryId },
          { subcategoryId: article.subcategoryId },
        ],
        NOT: {
          id: article.id,
        },
        published_at: {
          lte: new Date(),
        },
      },
      include: {
        category: true,
        subcategory: true,
      },
      orderBy: {
        published_at: "desc",
      },
      take: 4,
    });

    // Get most viewed articles
    const mostViewedArticles = await prisma.article.findMany({
      where: {
        published_at: {
          lte: new Date(),
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        viewCount: "desc",
      },
      take: 5,
    });

    // Get recent articles
    const recentArticles = await prisma.article.findMany({
      where: {
        published_at: {
          lte: new Date(),
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        published_at: "desc",
      },
      take: 4,
    });

    // Increment view count
    await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return {
      article: {
        title: article.title,
        category: article.category,
        subcategory: article.subcategory,
        published_at: article.published_at,
        content: article.content,
        excerpt: article.excerpt,
        featured_image: article.featured_image,
        tags: article.tags,
        viewCount: article.viewCount + 1, // Incremented count
      },
      relatedArticles: relatedArticles.map((related) => ({
        id: related.id,
        title: related.title,
        excerpt: related.excerpt || "",
        image:
          related.featured_image ||
          `/placeholder.svg?height=300&width=600&text=${related.category.name}`,
        category: related.category.name,
        published_at: related.published_at,
        slug: related.slug,
      })),
      mostViewedArticles: mostViewedArticles.map((viewed) => ({
        id: viewed.id,
        title: viewed.title,
        image:
          viewed.featured_image ||
          `/placeholder.svg?height=200&width=200&text=${viewed.category.name}`,
        category: viewed.category.name,
        published_at: viewed.published_at,
        slug: viewed.slug,
        viewCount: viewed.viewCount,
      })),
      recentArticles: recentArticles.map((recent) => ({
        id: recent.id,
        title: recent.title,
        image:
          recent.featured_image ||
          `/placeholder.svg?height=200&width=200&text=${recent.category.name}`,
        category: recent.category.name,
        published_at: recent.published_at,
        slug: recent.slug,
      })),
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
}

export default async function ArticlePage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const { category, slug } = params;
  const data = await getArticleData(category, slug);

  if (!data) {
    notFound();
  }

  const { article, relatedArticles, mostViewedArticles, recentArticles } = data;

  return (
    <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <article className="space-y-8">
            <ArticleHeader
              title={article.title}
              category={article.category}
              subcategory={article.subcategory}
              publishedAt={formatDate(article.published_at)}
              readTime={`${Math.ceil(article.content.length / 1000)} min`}
              tags={article.tags.map((t) => t.tag.name)}
              featuredImage={article.featured_image || "/placeholder.svg"}
            />

            <ArticleContent content={article.content} />

            <ArticleFooter />
          </article>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <MostViewedArticles
            articles={mostViewedArticles.map((article) => ({
              ...article,
              published_at: formatTimeAgo(article.published_at),
            }))}
          />
          <RecentArticles
            articles={recentArticles.map((article) => ({
              ...article,
              published_at: formatTimeAgo(article.published_at),
            }))}
          />
        </div>
      </div>

      <Separator className="my-12" />

      <RelatedArticles
        articles={relatedArticles.map((article) => ({
          ...article,
          published_at: formatTimeAgo(article.published_at),
        }))}
      />
    </main>
  );
}
