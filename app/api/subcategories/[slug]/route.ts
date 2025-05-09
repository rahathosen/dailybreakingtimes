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
    // Get subcategory
    const subcategory = await prisma.subcategory.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!subcategory) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    // Get articles for this subcategory
    const articles = await prisma.article.findMany({
      where: {
        subcategoryId: subcategory.id,
        // status: "published",
      },
      include: {
        category: true,
        subcategory: true,
        // author: true,
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
        subcategoryId: subcategory.id,
        // status: "published",
      },
    });

    const totalPages = Math.ceil(totalArticles / limit);

    return NextResponse.json({
      subcategory,
      articles,
      pagination: {
        page,
        limit,
        totalArticles,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching subcategory articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch subcategory articles" },
      { status: 500 }
    );
  }
}
