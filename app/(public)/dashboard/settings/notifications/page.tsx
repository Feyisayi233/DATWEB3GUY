import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NotificationSettingsForm } from "@/components/dashboard/NotificationSettingsForm";
import { Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";

async function getPreferences(userId: string) {
  let preferences = await prisma.notificationPreference.findUnique({
    where: { userId },
  });

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

  return preferences;
}

export default async function NotificationSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login?callbackUrl=/dashboard/settings/notifications");
  }

  const userId = (session.user as any).id;
  const preferences = await getPreferences(userId);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Bell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Notification Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage how and when you receive notifications
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Configure your email notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationSettingsForm initialPreferences={preferences} />
        </CardContent>
      </Card>
    </div>
  );
}
