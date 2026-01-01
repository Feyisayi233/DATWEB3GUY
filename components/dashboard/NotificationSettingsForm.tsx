"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save, Loader2 } from "lucide-react";

interface NotificationPreference {
  id: string;
  emailEnabled: boolean;
  deadlineReminders: boolean;
  daysBeforeDeadline: string;
  statusChangeNotifications: boolean;
  newAirdropNotifications: boolean;
  updateNotifications: boolean;
}

interface NotificationSettingsFormProps {
  initialPreferences: NotificationPreference;
}

export function NotificationSettingsForm({
  initialPreferences,
}: NotificationSettingsFormProps) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/users/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (!res.ok) {
        throw new Error("Failed to save preferences");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer">
          <div>
            <div className="font-semibold text-gray-900 dark:text-white mb-1">
              Enable Email Notifications
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Receive notifications via email
            </div>
          </div>
          <input
            type="checkbox"
            checked={preferences.emailEnabled}
            onChange={(e) =>
              setPreferences({ ...preferences, emailEnabled: e.target.checked })
            }
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </label>

        <label className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer">
          <div>
            <div className="font-semibold text-gray-900 dark:text-white mb-1">
              Deadline Reminders
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Get reminded before airdrop deadlines
            </div>
          </div>
          <input
            type="checkbox"
            checked={preferences.deadlineReminders}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                deadlineReminders: e.target.checked,
              })
            }
            disabled={!preferences.emailEnabled}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
          />
        </label>

        {preferences.deadlineReminders && (
          <div className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Remind me (days before deadline)
            </label>
            <Input
              type="text"
              value={preferences.daysBeforeDeadline}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  daysBeforeDeadline: e.target.value,
                })
              }
              placeholder="7,3,1"
              disabled={!preferences.emailEnabled}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Comma-separated list (e.g., "7,3,1" for 7 days, 3 days, and 1 day before)
            </p>
          </div>
        )}

        <label className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer">
          <div>
            <div className="font-semibold text-gray-900 dark:text-white mb-1">
              Status Change Notifications
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Notify when airdrop status changes (e.g., verification available, reward ready)
            </div>
          </div>
          <input
            type="checkbox"
            checked={preferences.statusChangeNotifications}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                statusChangeNotifications: e.target.checked,
              })
            }
            disabled={!preferences.emailEnabled}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
          />
        </label>

        <label className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer">
          <div>
            <div className="font-semibold text-gray-900 dark:text-white mb-1">
              Update Notifications
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Notify when tracked airdrops are updated
            </div>
          </div>
          <input
            type="checkbox"
            checked={preferences.updateNotifications}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                updateNotifications: e.target.checked,
              })
            }
            disabled={!preferences.emailEnabled}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
          />
        </label>

        <label className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer">
          <div>
            <div className="font-semibold text-gray-900 dark:text-white mb-1">
              New Airdrop Notifications
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Notify when new airdrops are published
            </div>
          </div>
          <input
            type="checkbox"
            checked={preferences.newAirdropNotifications}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                newAirdropNotifications: e.target.checked,
              })
            }
            disabled={!preferences.emailEnabled}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
          />
        </label>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400">
              ✓ Preferences saved
            </span>
          )}
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
