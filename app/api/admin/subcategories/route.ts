import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Check if user is authenticated

    const { name, slug, categoryId, show_in_header, is_highlighted } =
      await request.json();

    // Validate input
    if (!name || !slug || !categoryId) {
      return NextResponse.json(
        { message: "Name, slug, and category are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { slug },
    });

    if (existingSubcategory) {
      return NextResponse.json(
        { message: "A subcategory with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new subcategory
    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        slug,
        show_in_header: show_in_header ?? true,
        is_highlighted: is_highlighted ?? false,
        categoryId: Number.parseInt(categoryId),
      },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("Create subcategory error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the subcategory" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if user is authenticated

    const subcategories = await prisma.subcategory.findMany({
      include: {
        category: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error("Get subcategories error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching subcategories" },
      { status: 500 }
    );
  }
}
