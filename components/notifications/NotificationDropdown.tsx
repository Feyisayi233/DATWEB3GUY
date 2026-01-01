"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  sentAt: string;
  readAt: string | null;
  airdrop: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

interface NotificationDropdownProps {
  onClose: () => void;
  onNotificationRead?: () => void;
}

export function NotificationDropdown({
  onClose,
  onNotificationRead,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=10");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      onNotificationRead?.();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${
                    !notification.readAt ? "bg-indigo-50 dark:bg-indigo-950/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(new Date(notification.sentAt))}
                        </span>
                        {notification.airdrop && (
                          <Link
                            href={`/airdrops/${notification.airdrop.slug}`}
                            onClick={onClose}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            View →
                          </Link>
                        )}
                      </div>
                    </div>
                    {!notification.readAt && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/dashboard/notifications"
            onClick={onClose}
            className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all notifications
          </Link>
        </div>
      </div>
    </>
  );
}
