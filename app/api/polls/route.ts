import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit")!)
      : undefined;

    // Build where clause
    const where: any = {
      status: "active",
    };

    if (featured === "true") {
      where.featured = true;
    }

    if (category) {
      where.category = category;
    }

    // Check for expired polls and update their status
    const expiredPolls = await prisma.poll.findMany({
      where: {
        status: "active",
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (expiredPolls.length > 0) {
      await prisma.poll.updateMany({
        where: {
          id: {
            in: expiredPolls.map((poll) => poll.id),
          },
        },
        data: {
          status: "ended",
        },
      });
    }

    // Fetch active polls
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
      take: limit,
    });

    // Calculate total votes and percentages for each poll
    const pollsWithStats = polls.map((poll) => {
      const totalVotes = poll.options.reduce(
        (sum, option) => sum + option.votes,
        0
      );
      const optionsWithPercentage = poll.options.map((option) => ({
        ...option,
        percentage:
          totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
      }));

      return {
        ...poll,
        totalVotes,
        options: optionsWithPercentage,
      };
    });

    return NextResponse.json(pollsWithStats);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}
