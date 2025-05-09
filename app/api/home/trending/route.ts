import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch the most recent articles
    const trendingArticles = await prisma.article.findMany({
      //   where: {
      //     is_published: true,
      //   },
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        published_at: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ viewCount: "desc" }, { published_at: "desc" }],
      take: 4,
    });

    // Format the response
    const formattedArticles = trendingArticles.map((article) => {
      // Calculate time difference
      const now = new Date();
      const published_at = article.published_at
        ? new Date(article.published_at)
        : new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - published_at.getTime()) / (1000 * 60)
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
        title: article.title,
        category: article.category.name,
        categorySlug: article.category.slug,
        url: `/${article.category.slug}/${article.slug}`,
        time: timeAgo,
        reads: `${(article.viewCount || 0).toLocaleString()}`,
      };
    });

    return NextResponse.json(formattedArticles);
  } catch (error) {
    console.error("Error fetching trending articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending articles" },
      { status: 500 }
    );
  }
}
