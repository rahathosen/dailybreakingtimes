import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Check if user is authenticated

    const { name, slug, show_in_header } = await request.json();

    // Validate input
    if (!name || !slug) {
      return NextResponse.json(
        { message: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "A category with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        show_in_header: show_in_header ?? true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the category" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if user is authenticated

    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching categories" },
      { status: 500 }
    );
  }
}
