import { prisma } from "@/lib/prisma";

type AirdropData = {
  participationSteps?: string;
  instructions?: string;
  eligibilityCriteria?: string;
  status?: string;
  verificationLink?: string | null;
  rewardAvailableLink?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  rewardDate?: string;
  rewardType?: string;
  cost?: string;
  taskType?: string;
};

type ChangeType = "updated" | "added" | "removed";

interface FieldChange {
  fieldName: string;
  oldValue: string | null;
  newValue: string;
  changeType: ChangeType;
}

/**
 * Normalize HTML content for comparison (remove extra whitespace, normalize formatting)
 */
function normalizeHTML(html: string | null | undefined): string {
  if (!html) return "";
  // Remove extra whitespace and normalize
  return html.trim().replace(/\s+/g, " ");
}

/**
 * Normalize text content for comparison
 */
function normalizeText(text: string | null | undefined): string {
  if (!text) return "";
  return text.trim();
}

/**
 * Format date for comparison
 */
function formatDateForComparison(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString();
}

/**
 * Compare two values and determine if they're different
 */
function valuesDiffer(
  oldValue: string | null | undefined,
  newValue: string | null | undefined,
  isHTML: boolean = false
): boolean {
  const normalizedOld = isHTML ? normalizeHTML(oldValue) : normalizeText(oldValue);
  const normalizedNew = isHTML ? normalizeHTML(newValue) : normalizeText(newValue);
  return normalizedOld !== normalizedNew;
}

/**
 * Determine change type based on old and new values
 */
function getChangeType(
  oldValue: string | null | undefined,
  newValue: string | null | undefined
): ChangeType {
  const hasOld = oldValue && oldValue.trim().length > 0;
  const hasNew = newValue && newValue.trim().length > 0;

  if (!hasOld && hasNew) return "added";
  if (hasOld && !hasNew) return "removed";
  return "updated";
}

/**
 * Track changes between old and new airdrop data
 */
export async function trackAirdropChanges(
  airdropId: string,
  oldData: AirdropData,
  newData: AirdropData,
  changedBy?: string
): Promise<void> {
  const changes: FieldChange[] = [];

  // Fields to track
  const fieldsToTrack: Array<{
    key: keyof AirdropData;
    isHTML?: boolean;
  }> = [
    { key: "participationSteps", isHTML: true },
    { key: "instructions" },
    { key: "eligibilityCriteria" },
    { key: "status" },
    { key: "verificationLink" },
    { key: "rewardAvailableLink" },
    { key: "startDate" },
    { key: "endDate" },
    { key: "rewardDate" },
    { key: "rewardType" },
    { key: "cost" },
    { key: "taskType" },
  ];

  for (const { key, isHTML } of fieldsToTrack) {
    const oldValue = oldData[key];
    const newValue = newData[key];

    // Handle date fields specially
    if (key === "startDate" || key === "endDate") {
      const oldDateStr = formatDateForComparison(oldValue as Date | null | undefined);
      const newDateStr = formatDateForComparison(newValue as Date | null | undefined);
      if (oldDateStr !== newDateStr) {
        changes.push({
          fieldName: key,
          oldValue: oldDateStr || null,
          newValue: newDateStr,
          changeType: getChangeType(oldDateStr, newDateStr),
        });
      }
      continue;
    }

    // Handle other fields
    if (valuesDiffer(oldValue, newValue, isHTML)) {
      const oldStr = oldValue?.toString() || null;
      const newStr = newValue?.toString() || "";
      changes.push({
        fieldName: key,
        oldValue: oldStr,
        newValue: newStr,
        changeType: getChangeType(oldStr, newStr),
      });
    }
  }

  // Store changes in database
  if (changes.length > 0) {
    await prisma.airdropChange.createMany({
      data: changes.map((change) => ({
        airdropId,
        fieldName: change.fieldName,
        oldValue: change.oldValue,
        newValue: change.newValue,
        changeType: change.changeType,
        changedBy: changedBy || null,
      })),
    });

    // Update airdrop's lastUpdatedAt and hasRecentUpdates
    // hasRecentUpdates is true if updated within last 7 days
    const now = new Date();
    await prisma.airdrop.update({
      where: { id: airdropId },
      data: {
        lastUpdatedAt: now,
        hasRecentUpdates: true, // Will be true since we just updated it
      },
    });
  }
}

/**
 * Get airdrop changes
 */
export async function getAirdropChanges(airdropId: string, limit?: number) {
  return await prisma.airdropChange.findMany({
    where: { airdropId },
    orderBy: { changedAt: "desc" },
    take: limit,
  });
}

/**
 * Get recent changes within a timeframe
 */
export async function getRecentChanges(airdropId: string, days: number = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return await prisma.airdropChange.findMany({
    where: {
      airdropId,
      changedAt: {
        gte: cutoffDate,
      },
    },
    orderBy: { changedAt: "desc" },
  });
}

/**
 * Format change for display
 */
export function formatChangeForDisplay(change: {
  fieldName: string;
  changeType: string;
  oldValue: string | null;
  newValue: string;
  changedAt: Date;
}): string {
  const fieldDisplayName = formatFieldName(change.fieldName);
  const timeAgo = getTimeAgo(change.changedAt);

  if (change.changeType === "added") {
    return `${fieldDisplayName} added ${timeAgo}`;
  } else if (change.changeType === "removed") {
    return `${fieldDisplayName} removed ${timeAgo}`;
  } else {
    // For status changes, show old -> new
    if (change.fieldName === "status" && change.oldValue) {
      return `${fieldDisplayName} changed from '${change.oldValue}' to '${change.newValue}' ${timeAgo}`;
    }
    return `${fieldDisplayName} updated ${timeAgo}`;
  }
}

/**
 * Format field name to human-readable
 */
export function formatFieldName(field: string): string {
  const fieldMap: Record<string, string> = {
    participationSteps: "Participation Steps",
    instructions: "Instructions",
    eligibilityCriteria: "Eligibility Criteria",
    status: "Status",
    verificationLink: "Verification Link",
    rewardAvailableLink: "Reward Available Link",
    startDate: "Start Date",
    endDate: "End Date",
    rewardDate: "Reward Date",
    rewardType: "Reward Type",
    cost: "Cost",
    taskType: "Task Type",
  };

  return fieldMap[field] || field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Get time ago string
 */
export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
}

/**
 * Truncate text for preview
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
