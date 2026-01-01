import { Badge } from "@/components/ui/Badge";
import { RefreshCw } from "lucide-react";
import { getTimeAgo } from "@/lib/airdrop-changes";

interface UpdateIndicatorProps {
  lastUpdatedAt: Date | null;
  hasRecentUpdates: boolean;
}

export function UpdateIndicator({ lastUpdatedAt, hasRecentUpdates }: UpdateIndicatorProps) {
  if (!hasRecentUpdates || !lastUpdatedAt) {
    return null;
  }

  const timeAgo = getTimeAgo(lastUpdatedAt);
  const hoursAgo = Math.floor((Date.now() - lastUpdatedAt.getTime()) / (1000 * 60 * 60));
  
  // Determine badge color based on recency
  let badgeVariant: "info" | "default" = "default";
  const shouldAnimate = hoursAgo < 24;
  if (hoursAgo < 24) {
    badgeVariant = "info"; // Blue for very recent (< 24h)
  }

  return (
    <Badge
      variant={badgeVariant}
      size="sm"
      className={`flex items-center gap-1.5 ${shouldAnimate ? "animate-pulse" : ""}`}
    >
      <RefreshCw className="h-3.5 w-3.5" />
      <span>Updated {timeAgo}</span>
    </Badge>
  );
}
