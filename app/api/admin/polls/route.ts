import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    // Build where clause
    const where: any = {};

    if (status) {
      if (status === "active") {
        where.status = "active";
      } else if (status === "ended") {
        where.status = "ended";
      } else if (status === "draft") {
        where.status = "draft";
      }
    }

    if (category) {
      where.category = category;
    }

    // Fetch polls
    const polls = await prisma.poll.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        options: {
          select: {
            id: true,
            text: true,
            votes: true,
          },
        },
      },
    });

    // Calculate total votes for each poll
    const pollsWithTotalVotes = polls.map((poll) => {
      const totalVotes = poll.options.reduce(
        (sum, option) => sum + option.votes,
        0
      );
      return {
        ...poll,
        totalVotes,
      };
    });

    return NextResponse.json(pollsWithTotalVotes);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated

    // Get request body
    const body = await request.json();
    const { question, category, options, status, expiresAt, featured } = body;

    // Validate required fields
    if (!question || !category || !options || options.length < 2) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create poll with options
    const poll = await prisma.poll.create({
      data: {
        question,
        category,
        status: status || "draft",
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        featured: featured || false,
        options: {
          create: options.map((option: string) => ({
            text: option,
            votes: 0,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    );
  }
}
