import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Find the category by slug
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Get all articles for this category
    const articles = await prisma.article.findMany({
      where: {
        categoryId: category.id,
        // is_published: true,
      },
      include: {
        category: true,
        subcategory: true,
        tags: true,
        // newsType: true,
      },
      orderBy: {
        published_at: "desc",
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalArticles = await prisma.article.count({
      where: {
        categoryId: category.id,
        // is_published: true,
      },
    });

    const totalPages = Math.ceil(totalArticles / limit);

    return NextResponse.json({
      category,
      articles,
      pagination: {
        page,
        limit,
        totalArticles,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch category articles" },
      { status: 500 }
    );
  }
}
