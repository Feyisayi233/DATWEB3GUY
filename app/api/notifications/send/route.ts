import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkDeadlinesAndSendReminders } from "@/lib/notifications/scheduler";

/**
 * Background job endpoint to check deadlines and send reminders
 * Can be called via cron job or manually by admin
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can trigger this
    const role = (session.user as any).role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await checkDeadlinesAndSendReminders();

    return NextResponse.json({
      message: `Processed ${result.sent} notifications for ${result.users} users`,
      ...result,
    });
  } catch (error: any) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send notifications" },
      { status: 500 }
    );
  }
}
