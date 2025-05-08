import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(request: Request) {
  try {
    const { name, slug, is_highlighted } = await request.json();

    // Validate input
    if (!name || !slug) {
      return NextResponse.json(
        { message: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return NextResponse.json(
        { message: "A tag with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new tag
    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        is_highlighted: is_highlighted ?? false,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Create tag error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the tag" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Get tags error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching tags" },
      { status: 500 }
    );
  }
}
