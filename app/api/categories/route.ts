import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      //   where: {
      //     visible: true,
      //   },
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            articles: {
              //   where: {
              //     published: true,
              //   },
            },
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
