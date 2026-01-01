import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: {
          userId,
          emailEnabled: true,
          deadlineReminders: true,
          daysBeforeDeadline: "7,3,1",
          statusChangeNotifications: true,
          newAirdropNotifications: false,
          updateNotifications: true,
        },
      });
    }

    return NextResponse.json(preferences);
  } catch (error: any) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    const preferences = await prisma.notificationPreference.upsert({
      where: { userId },
      update: {
        emailEnabled: body.emailEnabled,
        deadlineReminders: body.deadlineReminders,
        daysBeforeDeadline: body.daysBeforeDeadline,
        statusChangeNotifications: body.statusChangeNotifications,
        newAirdropNotifications: body.newAirdropNotifications,
        updateNotifications: body.updateNotifications,
      },
      create: {
        userId,
        emailEnabled: body.emailEnabled ?? true,
        deadlineReminders: body.deadlineReminders ?? true,
        daysBeforeDeadline: body.daysBeforeDeadline ?? "7,3,1",
        statusChangeNotifications: body.statusChangeNotifications ?? true,
        newAirdropNotifications: body.newAirdropNotifications ?? false,
        updateNotifications: body.updateNotifications ?? true,
      },
    });

    return NextResponse.json(preferences);
  } catch (error: any) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update preferences" },
      { status: 500 }
    );
  }
}
