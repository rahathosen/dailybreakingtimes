import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch the latest breaking news article
    const latestBreakingNews = await prisma.article.findFirst({
      where: {
        is_breaking: true,
        // is_published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featured_image: true,
        published_at: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        published_at: "desc",
      },
    });

    // Fetch is_highlighted articles (excluding the breaking news article)
    const is_highlightedArticles = await prisma.article.findMany({
      where: {
        is_highlighted: true,
        // is_published: true,
        id: latestBreakingNews ? { not: latestBreakingNews.id } : undefined,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featured_image: true,
        published_at: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        published_at: "desc",
      },
      take: 2,
    });

    // Format the response
    const response = {
      breakingNews: latestBreakingNews
        ? {
            id: latestBreakingNews.id,
            title: latestBreakingNews.title,
            excerpt: latestBreakingNews.excerpt || "",
            image:
              latestBreakingNews.featured_image ||
              "/placeholder.svg?height=600&width=1200",
            category: latestBreakingNews.category.name,
            categorySlug: latestBreakingNews.category.slug,
            url: `/${latestBreakingNews.category.slug}/${latestBreakingNews.slug}`,
            published_at: latestBreakingNews.published_at,
          }
        : null,
      is_highlightedArticles: is_highlightedArticles.map((article) => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || "",
        image:
          article.featured_image || "/placeholder.svg?height=300&width=600",
        category: article.category.name,
        categorySlug: article.category.slug,
        url: `/${article.category.slug}/${article.slug}`,
        published_at: article.published_at,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching hero section data:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero section data" },
      { status: 500 }
    );
  }
}
