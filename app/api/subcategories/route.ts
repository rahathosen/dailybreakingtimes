import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const subcategories = await prisma.subcategory.findMany({
      //   where: {
      //     is_active: true,
      //   },
      include: {
        category: true,
        _count: {
          select: {
            articles: {
              //   where: {
              //     status: "published",
              //   },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}
