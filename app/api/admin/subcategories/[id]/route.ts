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

    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
    });

    if (!subcategory) {
      return NextResponse.json(
        { message: "Subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("Get subcategory error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the subcategory" },
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

    const { name, slug, categoryId, show_in_header, is_highlighted } =
      await request.json();

    // Validate input
    if (!name || !slug || !categoryId) {
      return NextResponse.json(
        { message: "Name, slug, and category are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists for another subcategory
    const existingSubcategory = await prisma.subcategory.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (existingSubcategory) {
      return NextResponse.json(
        { message: "A subcategory with this slug already exists" },
        { status: 400 }
      );
    }

    // Update subcategory
    const subcategory = await prisma.subcategory.update({
      where: { id },
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
    console.error("Update subcategory error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the subcategory" },
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

    // Check if subcategory has articles
    const articlesCount = await prisma.article.count({
      where: { subcategoryId: id },
    });

    if (articlesCount > 0) {
      return NextResponse.json(
        {
          message:
            "Cannot delete subcategory with articles. Remove articles first.",
        },
        { status: 400 }
      );
    }

    // Delete subcategory
    await prisma.subcategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete subcategory error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the subcategory" },
      { status: 500 }
    );
  }
}
