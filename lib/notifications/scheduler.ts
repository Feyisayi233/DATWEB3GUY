/**
 * Notification scheduler - checks for deadlines and sends reminders
 */

import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "./email";
import { getDeadlineReminderTemplate } from "./templates";

export async function checkDeadlinesAndSendReminders() {
  try {
    const now = new Date();
    
    // Get all users with deadline reminders enabled
    const users = await prisma.user.findMany({
      where: {
        notificationPreference: {
          deadlineReminders: true,
          emailEnabled: true,
        },
      },
      include: {
        notificationPreference: true,
        trackedAirdrops: {
          where: {
            status: {
              in: ["tracking", "in_progress"],
            },
          },
          include: {
            airdrop: {
              select: {
                id: true,
                title: true,
                slug: true,
                endDate: true,
              },
            },
          },
        },
      },
    });

    const notificationsToSend: Array<{
      userId: string;
      email: string;
      airdropId: string;
      airdropTitle: string;
      airdropSlug: string;
      days: number;
      type: string;
    }> = [];

    for (const user of users) {
      if (!user.notificationPreference) continue;

      const reminderDays = user.notificationPreference.daysBeforeDeadline
        .split(",")
        .map((d) => parseInt(d.trim()))
        .filter((d) => !isNaN(d));

      for (const trackedAirdrop of user.trackedAirdrops) {
        if (!trackedAirdrop.airdrop.endDate) continue;

        const endDate = new Date(trackedAirdrop.airdrop.endDate);
        const daysUntilEnd = Math.ceil(
          (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Check if we should send a reminder for this day
        for (const days of reminderDays) {
          if (daysUntilEnd === days) {
            // Check if we already sent this notification
            const existingNotification = await prisma.notification.findFirst({
              where: {
                userId: user.id,
                airdropId: trackedAirdrop.airdropId,
                type: `deadline_${days}d`,
                sentAt: {
                  gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
                },
              },
            });

            if (!existingNotification) {
              notificationsToSend.push({
                userId: user.id,
                email: user.email,
                airdropId: trackedAirdrop.airdropId,
                airdropTitle: trackedAirdrop.airdrop.title,
                airdropSlug: trackedAirdrop.airdrop.slug,
                days,
                type: `deadline_${days}d`,
              });
            }
          }
        }
      }
    }

    // Send notifications
    for (const notif of notificationsToSend) {
      const template = getDeadlineReminderTemplate(notif.days, notif.airdropTitle);

      // Send email
      const emailSent = await sendNotificationEmail(
        notif.email,
        template.title,
        template.message,
        notif.airdropTitle,
        notif.airdropSlug
      );

      // Create notification record
      await prisma.notification.create({
        data: {
          userId: notif.userId,
          airdropId: notif.airdropId,
          type: notif.type,
          title: template.title,
          message: template.message,
          emailSent,
        },
      });
    }

    return {
      sent: notificationsToSend.length,
      users: users.length,
    };
  } catch (error) {
    console.error("Error checking deadlines:", error);
    throw error;
  }
}
