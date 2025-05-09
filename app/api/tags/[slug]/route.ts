import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "9");
  const skip = (page - 1) * limit;

  try {
    // Find the tag by slug
    const tag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Fetch articles for the tag
    const articlesWithTag = await prisma.articlesOnTags.findMany({
      where: {
        tagId: tag.id,
        // article: {
        //   is_published: true,
        // },
      },
      include: {
        article: {
          include: {
            category: true,
            subcategory: true,
            news_type: true,
          },
        },
      },
      orderBy: {
        article: {
          published_at: "desc",
        },
      },
      skip,
      take: limit,
    });

    const articles = articlesWithTag.map((at) => at.article);

    // Total count for pagination
    const totalArticlesWithTag = await prisma.articlesOnTags.count({
      where: {
        tagId: tag.id,
        // article: {
        //   is_published: true,
        // },
      },
    });

    const totalPages = Math.ceil(totalArticlesWithTag / limit);

    return NextResponse.json({
      tag,
      articles,
      pagination: {
        page,
        limit,
        totalArticles: totalArticlesWithTag,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching tag articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch tag articles" },
      { status: 500 }
    );
  }
}
