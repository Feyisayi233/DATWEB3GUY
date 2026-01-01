"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackButtonProps {
  airdropId: string;
  className?: string;
}

export function TrackButton({ airdropId, className }: TrackButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isTracked, setIsTracked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      checkTrackingStatus();
    } else {
      setChecking(false);
    }
  }, [status, airdropId]);

  const checkTrackingStatus = async () => {
    try {
      const res = await fetch(`/api/airdrops/${airdropId}/track`);
      const data = await res.json();
      setIsTracked(data.isTracked || false);
    } catch (error) {
      console.error("Error checking tracking status:", error);
    } finally {
      setChecking(false);
    }
  };

  const handleTrack = async () => {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);
    try {
      if (isTracked) {
        await fetch(`/api/airdrops/${airdropId}/track`, {
          method: "DELETE",
        });
        setIsTracked(false);
      } else {
        await fetch(`/api/airdrops/${airdropId}/track`, {
          method: "POST",
        });
        setIsTracked(true);
      }
      router.refresh();
    } catch (error) {
      console.error("Error tracking airdrop:", error);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={className}
      >
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <Button
      variant={isTracked ? "default" : "outline"}
      size="sm"
      onClick={handleTrack}
      disabled={loading}
      className={cn(className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isTracked ? (
        <BookmarkCheck className="h-4 w-4 mr-2" />
      ) : (
        <Bookmark className="h-4 w-4 mr-2" />
      )}
      {isTracked ? "Tracked" : "Track Airdrop"}
    </Button>
  );
}
