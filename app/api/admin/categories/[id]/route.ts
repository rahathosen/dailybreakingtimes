import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Get category error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const { name, slug, show_in_header } = await request.json();

    // Validate input
    if (!name || !slug) {
      return NextResponse.json(
        { message: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists for another category
    const existingCategory = await prisma.category.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "A category with this slug already exists" },
        { status: 400 }
      );
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        show_in_header: show_in_header ?? true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // Check if category has subcategories
    const subcategoriesCount = await prisma.subcategory.count({
      where: { categoryId: id },
    });

    if (subcategoriesCount > 0) {
      return NextResponse.json(
        {
          message:
            "Cannot delete category with subcategories. Remove subcategories first.",
        },
        { status: 400 }
      );
    }

    // Check if category has articles
    const articlesCount = await prisma.article.count({
      where: { categoryId: id },
    });

    if (articlesCount > 0) {
      return NextResponse.json(
        {
          message:
            "Cannot delete category with articles. Remove articles first.",
        },
        { status: 400 }
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the category" },
      { status: 500 }
    );
  }
}
