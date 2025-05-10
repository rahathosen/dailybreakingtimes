import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/settings - Fetch current settings
export async function GET() {
  try {
    // Get settings (create default if doesn't exist)
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          newspaperName: "DailyBreakingTimes",
          tagline: "Your Source for Breaking News",
          description:
            "DailyBreakingTimes is your premier source for the latest news, in-depth analysis, and expert opinions on current events around the world.",
          contactEmail: "contact@dailybreakingtimes.com",
          facebookUrl: "https://facebook.com/dailybreakingtimes",
          twitterUrl: "https://twitter.com/dailybreakingtimes",
          instagramUrl: "https://instagram.com/dailybreakingtimes",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (
      !data.newspaperName ||
      !data.tagline ||
      !data.description ||
      !data.contactEmail
    ) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Get current settings
    let settings = await prisma.settings.findFirst();

    if (settings) {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          newspaperName: data.newspaperName,
          tagline: data.tagline,
          description: data.description,
          contactEmail: data.contactEmail,
          facebookUrl: data.facebookUrl,
          twitterUrl: data.twitterUrl,
          instagramUrl: data.instagramUrl,
        },
      });
    } else {
      // Create new settings if none exist
      settings = await prisma.settings.create({
        data: {
          newspaperName: data.newspaperName,
          tagline: data.tagline,
          description: data.description,
          contactEmail: data.contactEmail,
          facebookUrl: data.facebookUrl,
          twitterUrl: data.twitterUrl,
          instagramUrl: data.instagramUrl,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
