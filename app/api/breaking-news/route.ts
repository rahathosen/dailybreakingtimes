import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch breaking news articles
    const breakingNews = await prisma.article.findMany({
      where: {
        is_breaking: true,
        // published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: {
          select: {
            slug: true,
          },
        },
        published_at: true,
      },
      orderBy: {
        published_at: "desc",
      },
      take: 5,
    });

    // Format the response
    const formattedNews = breakingNews.map((article) => ({
      id: article.id,
      title: article.title,
      url: `/${article.category.slug}/${article.slug}`,
      publishedAt: article.published_at,
    }));

    return NextResponse.json(formattedNews);
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    return NextResponse.json(
      { error: "Failed to fetch breaking news" },
      { status: 500 }
    );
  }
}
