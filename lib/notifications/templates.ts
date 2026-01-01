/**
 * Notification message templates
 */

export interface NotificationTemplate {
  title: string;
  message: string;
}

export function getDeadlineReminderTemplate(
  days: number,
  airdropTitle: string
): NotificationTemplate {
  return {
    title: `⏰ Airdrop Ending in ${days} Day${days > 1 ? "s" : ""}`,
    message: `The airdrop "${airdropTitle}" is ending in ${days} day${days > 1 ? "s" : ""}. Make sure to complete all participation steps before the deadline!`,
  };
}

export function getStatusChangeTemplate(
  airdropTitle: string,
  oldStatus: string,
  newStatus: string
): NotificationTemplate {
  const statusMessages: Record<string, string> = {
    "reward available": "🎉 Great news! Rewards are now available for this airdrop.",
    "verification": "✅ Verification is now open for this airdrop.",
    "confirmed": "✓ This airdrop has been confirmed.",
  };

  return {
    title: `Status Update: ${airdropTitle}`,
    message: `The status of "${airdropTitle}" has changed from "${oldStatus}" to "${newStatus}". ${statusMessages[newStatus] || ""}`,
  };
}

export function getUpdateTemplate(
  airdropTitle: string,
  changeCount: number
): NotificationTemplate {
  return {
    title: `📝 Update: ${airdropTitle}`,
    message: `The airdrop "${airdropTitle}" has been updated with ${changeCount} new change${changeCount > 1 ? "s" : ""}. Check it out to see what's new!`,
  };
}

export function getNewAirdropTemplate(airdropTitle: string): NotificationTemplate {
  return {
    title: `🆕 New Airdrop: ${airdropTitle}`,
    message: `A new airdrop "${airdropTitle}" has been added. Check it out and start tracking!`,
  };
}
