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
  excerpt: z.string().optional(),
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

export async function POST(request: NextRequest) {
  try {
    // Validate admin session

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

    // Create article
    const article = await prisma.article.create({
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

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId")
      ? Number.parseInt(searchParams.get("categoryId") as string)
      : undefined;
    const isBreaking =
      searchParams.get("isBreaking") === "true" ? true : undefined;
    const isHighlighted =
      searchParams.get("isHighlighted") === "true" ? true : undefined;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isBreaking !== undefined) {
      where.is_breaking = isBreaking;
    }

    if (isHighlighted !== undefined) {
      where.is_highlighted = isHighlighted;
    }

    // Get articles with count
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles", details: (error as Error).message },
      { status: 500 }
    );
  }
}
