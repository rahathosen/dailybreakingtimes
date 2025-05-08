import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { pollId, optionId } = await request.json();

    if (!pollId || !optionId) {
      return NextResponse.json(
        { error: "Poll ID and option ID are required" },
        { status: 400 }
      );
    }

    // Check if poll exists and is active
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
        status: "active",
      },
      include: {
        options: true,
      },
    });

    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found or not active" },
        { status: 404 }
      );
    }

    // Check if option exists for this poll
    const option = poll.options.find((opt) => opt.id === optionId);
    if (!option) {
      return NextResponse.json(
        { error: "Option not found for this poll" },
        { status: 404 }
      );
    }

    // Just increment the vote count
    const updatedOption = await prisma.pollOption.update({
      where: { id: optionId },
      data: { votes: { increment: 1 } },
    });

    // Get all options with updated vote counts
    const updatedOptions = await prisma.pollOption.findMany({
      where: { pollId },
    });

    // Calculate percentages
    const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);
    const results = updatedOptions.map((opt) => ({
      id: opt.id,
      text: opt.text,
      votes: opt.votes,
      percentage:
        totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
    }));

    return NextResponse.json({
      success: true,
      results,
      totalVotes,
    });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}
