"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { isBookmarked, addBookmark, removeBookmark, type Bookmark, type BookmarkType } from "@/lib/bookmarks";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  id: string;
  type: BookmarkType;
  title: string;
  slug: string;
  description?: string;
  className?: string;
}

export function BookmarkButton({ id, type, title, slug, description, className }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBookmarked(isBookmarked(id, type));
    setLoading(false);
  }, [id, type]);

  const handleToggle = () => {
    if (bookmarked) {
      removeBookmark(id, type);
      setBookmarked(false);
    } else {
      const bookmark: Bookmark = {
        id,
        type,
        title,
        slug,
        description,
        createdAt: new Date().toISOString(),
      };
      if (addBookmark(bookmark)) {
        setBookmarked(true);
      }
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-2",
        bookmarked && "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
        className
      )}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Heart className={cn("h-4 w-4", bookmarked && "fill-current")} />
      {bookmarked ? "Saved" : "Save"}
    </Button>
  );
}
