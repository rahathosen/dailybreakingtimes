import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Schema for article validation
const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().optional().nullable(),
  featured_image: z
    .string()
    .url("Featured image must be a valid URL")
    .optional()
    .nullable(),
  is_breaking: z.boolean().default(false),
  is_highlighted: z.boolean().default(false),
  published_at: z.string().optional().nullable(),
  categoryId: z.number().int().positive("Category is required"),
  subcategoryId: z.number().int().positive("Subcategory is required"),
  newsTypeId: z.number().int().positive("News type is required"),
  tags: z.array(z.number().int().positive()).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate admin session

    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid article ID" },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true,
        news_type: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate admin session

    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid article ID" },
        { status: 400 }
      );
    }

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = articleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { tags, ...articleData } = validation.data;

    // Convert published_at to Date if provided
    const publishedAt = articleData.published_at
      ? new Date(articleData.published_at)
      : null;

    // Update article in a transaction to handle tags properly
    const article = await prisma.$transaction(async (tx) => {
      // Delete existing tag relationships
      await tx.articlesOnTags.deleteMany({
        where: { articleId: id },
      });

      // Update the article
      const updatedArticle = await tx.article.update({
        where: { id },
        data: {
          ...articleData,
          published_at: publishedAt,
          tags:
            tags && tags.length > 0
              ? {
                  create: tags.map((tagId) => ({
                    tag: { connect: { id: tagId } },
                  })),
                }
              : undefined,
        },
        include: {
          category: true,
          subcategory: true,
          news_type: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return updatedArticle;
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate admin session

    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid article ID" },
        { status: 400 }
      );
    }

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Delete article in a transaction to handle tags properly
    await prisma.$transaction(async (tx) => {
      // Delete tag relationships first
      await tx.articlesOnTags.deleteMany({
        where: { articleId: id },
      });

      // Delete the article
      await tx.article.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article", details: (error as Error).message },
      { status: 500 }
    );
  }
}
