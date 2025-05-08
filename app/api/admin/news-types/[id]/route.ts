import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated

    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const newsType = await prisma.newsType.findUnique({
      where: { id },
    });

    if (!newsType) {
      return NextResponse.json(
        { message: "News type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(newsType);
  } catch (error) {
    console.error("Get news type error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the news type" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated

    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const { name, slug } = await request.json();

    // Validate input
    if (!name || !slug) {
      return NextResponse.json(
        { message: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists for another news type
    const existingNewsType = await prisma.newsType.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (existingNewsType) {
      return NextResponse.json(
        { message: "A news type with this slug already exists" },
        { status: 400 }
      );
    }

    // Update news type
    const newsType = await prisma.newsType.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(newsType);
  } catch (error) {
    console.error("Update news type error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the news type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated

    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // Check if news type has articles
    const articlesCount = await prisma.article.count({
      where: { newsTypeId: id },
    });

    if (articlesCount > 0) {
      return NextResponse.json(
        {
          message:
            "Cannot delete news type with articles. Remove articles first.",
        },
        { status: 400 }
      );
    }

    // Delete news type
    await prisma.newsType.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete news type error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the news type" },
      { status: 500 }
    );
  }
}
