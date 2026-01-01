"use client";

import { useState, useEffect } from "react";

interface ReadingProgressProps {
  contentId: string;
  type: "airdrop";
}

export function ReadingProgress({ contentId, type }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load saved progress
    const savedProgress = localStorage.getItem(`reading_progress_${type}_${contentId}`);
    if (savedProgress) {
      setProgress(parseInt(savedProgress, 10));
    }

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const scrollableHeight = documentHeight - windowHeight;
      const currentProgress = scrollableHeight > 0 
        ? Math.round((scrollTop / scrollableHeight) * 100)
        : 0;
      
      setProgress(currentProgress);
      
      // Save progress to localStorage
      localStorage.setItem(`reading_progress_${type}_${contentId}`, currentProgress.toString());
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [contentId, type]);

  if (progress === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
      <div
        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
