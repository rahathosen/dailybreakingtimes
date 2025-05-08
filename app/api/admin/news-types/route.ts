import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Check if user is authenticated

    const { name, slug } = await request.json();

    // Validate input
    if (!name || !slug) {
      return NextResponse.json(
        { message: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingNewsType = await prisma.newsType.findUnique({
      where: { slug },
    });

    if (existingNewsType) {
      return NextResponse.json(
        { message: "A news type with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new news type
    const newsType = await prisma.newsType.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(newsType);
  } catch (error) {
    console.error("Create news type error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the news type" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const newsTypes = await prisma.newsType.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(newsTypes);
  } catch (error) {
    console.error("Get news types error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching news types" },
      { status: 500 }
    );
  }
}
