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

    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Get tag error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the tag" },
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

    const { name, slug, is_highlighted } = await request.json();

    // Validate input
    if (!name || !slug) {
      return NextResponse.json(
        { message: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists for another tag
    const existingTag = await prisma.tag.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { message: "A tag with this slug already exists" },
        { status: 400 }
      );
    }

    // Update tag
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
        is_highlighted: is_highlighted ?? false,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Update tag error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the tag" },
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

    // Check if tag has articles
    const articlesCount = await prisma.articlesOnTags.count({
      where: { tagId: id },
    });

    if (articlesCount > 0) {
      return NextResponse.json(
        {
          message:
            "Cannot delete tag with articles. Remove tag from articles first.",
        },
        { status: 400 }
      );
    }

    // Delete tag
    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete tag error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the tag" },
      { status: 500 }
    );
  }
}
