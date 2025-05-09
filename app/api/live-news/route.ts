import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch recent news articles
    const recentNews = await prisma.article.findMany({
      //   where: {
      //     is_published: true,
      //   },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        is_breaking: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        published_at: true,
      },
      orderBy: {
        published_at: "desc",
      },
      take: 10,
    });

    // Format the response
    const formattedNews = recentNews.map((article) => {
      // Calculate time difference
      const now = new Date();
      const publishedAt = article.published_at
        ? new Date(article.published_at)
        : new Date(0);
      const diffInMinutes = Math.floor(
        (now.getTime() - publishedAt.getTime()) / (1000 * 60)
      );

      let timeAgo;
      if (diffInMinutes < 1) {
        timeAgo = "Just now";
      } else if (diffInMinutes < 60) {
        timeAgo = `${diffInMinutes} min ago`;
      } else if (diffInMinutes < 1440) {
        timeAgo = `${Math.floor(diffInMinutes / 60)} hours ago`;
      } else {
        timeAgo = `${Math.floor(diffInMinutes / 1440)} days ago`;
      }

      return {
        id: article.id,
        text: article.title,
        excerpt: article.excerpt || "",
        category: article.category.name,
        categorySlug: article.category.slug,
        url: `/${article.category.slug}/${article.slug}`,
        time: timeAgo,
        isBreaking: article.is_breaking,
      };
    });

    return NextResponse.json(formattedNews);
  } catch (error) {
    console.error("Error fetching live news:", error);
    return NextResponse.json(
      { error: "Failed to fetch live news" },
      { status: 500 }
    );
  }
}
