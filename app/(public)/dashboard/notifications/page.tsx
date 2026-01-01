import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

async function getNotifications(userId: string) {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: "desc" },
      include: {
        airdrop: {
          select: {
            id: true,
            title: true,
            slug: true,
            featuredImage: true,
          },
        },
      },
      take: 50,
    }),
    prisma.notification.count({
      where: {
        userId,
        readAt: null,
      },
    }),
  ]);

  return { notifications, unreadCount };
}

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login?callbackUrl=/dashboard/notifications");
  }

  const userId = (session.user as any).id;
  const { notifications, unreadCount } = await getNotifications(userId);

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Bell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You'll see notifications here when airdrops you're tracking have updates or deadlines approaching.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-2 transition-all ${
                !notification.readAt
                  ? "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {notification.airdrop?.featuredImage?.trim() && (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={notification.airdrop.featuredImage}
                        alt={notification.airdrop.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.readAt && (
                        <Badge variant="info" size="sm">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(notification.sentAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        {notification.airdrop && (
                          <Link href={`/airdrops/${notification.airdrop.slug}`}>
                            <Button variant="outline" size="sm">
                              View Airdrop
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
