"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Twitter, Send, Share2, Copy, Check } from "lucide-react";
import { generateShareUrl, copyToClipboard, isWebShareSupported, shareViaWebAPI } from "@/lib/sharing";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function ShareButtons({ url, title, description, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [webShareSupported, setWebShareSupported] = useState(false);

  // Check for Web Share API support only on client side after hydration
  useEffect(() => {
    setWebShareSupported(isWebShareSupported());
  }, []);

  const handleShare = async (platform: string) => {
    if (platform === "copy") {
      const success = await copyToClipboard(url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else if (platform === "native" && webShareSupported) {
      await shareViaWebAPI({
        title,
        text: description || title,
        url,
      });
    } else {
      const shareUrl = generateShareUrl(platform, url, title, description);
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {webShareSupported && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("native")}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
        className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400"
      >
        <Twitter className="h-4 w-4" />
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("telegram")}
        className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400"
      >
        <Send className="h-4 w-4" />
        Telegram
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("copy")}
        className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  );
}
