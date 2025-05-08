import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated

    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Fetch poll with options
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    return NextResponse.json(poll);
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json(
      { error: "Failed to fetch poll" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated

    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

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

    // Get existing poll
    const existingPoll = await prisma.poll.findUnique({
      where: { id },
      include: { options: true },
    });

    if (!existingPoll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // Update poll
    const updatedPoll = await prisma.$transaction(async (tx) => {
      // Delete options that are not in the new options list
      const existingOptionIds = existingPoll.options.map((o) => o.id);
      const newOptionIds = options
        .filter((o: any) => o.id)
        .map((o: any) => o.id);

      const optionsToDelete = existingOptionIds.filter(
        (id) => !newOptionIds.includes(id)
      );

      if (optionsToDelete.length > 0) {
        await tx.pollOption.deleteMany({
          where: {
            id: {
              in: optionsToDelete,
            },
          },
        });
      }

      // Update existing options
      for (const option of options) {
        if (option.id) {
          await tx.pollOption.update({
            where: { id: option.id },
            data: { text: option.text },
          });
        } else {
          // Create new options
          await tx.pollOption.create({
            data: {
              text: option.text,
              votes: 0,
              pollId: id,
            },
          });
        }
      }

      // Update poll
      return tx.poll.update({
        where: { id },
        data: {
          question,
          category,
          status: status || "draft",
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          featured: featured || false,
        },
        include: {
          options: {
            orderBy: {
              id: "asc",
            },
          },
        },
      });
    });

    return NextResponse.json(updatedPoll);
  } catch (error) {
    console.error("Error updating poll:", error);
    return NextResponse.json(
      { error: "Failed to update poll" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated

    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Delete poll and its options (cascade delete should handle options)
    await prisma.poll.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting poll:", error);
    return NextResponse.json(
      { error: "Failed to delete poll" },
      { status: 500 }
    );
  }
}
