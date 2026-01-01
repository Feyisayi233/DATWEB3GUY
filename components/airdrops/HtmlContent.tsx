"use client";

import { useEffect, useRef } from "react";

interface HtmlContentProps {
  content: string;
  className?: string;
}

export function HtmlContent({ content, className = "" }: HtmlContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    // Find all img tags and enhance them
    const images = containerRef.current.querySelectorAll("img");
    
    if (images.length === 0 && content.includes("<img")) {
      // If content has img tags but they're not in the DOM, the HTML might not have been parsed correctly
      console.log("Images found in content but not in DOM. Content:", content.substring(0, 200));
    }
    
    images.forEach((img) => {
      // Skip if image has no src or empty src
      const src = img.getAttribute("src");
      if (!src || src.trim() === "") {
        img.style.display = "none";
        return;
      }

      // Ensure images are visible and responsive
      img.style.maxWidth = "100%";
      img.style.width = "auto";
      img.style.height = "auto";
      img.style.borderRadius = "0.5rem";
      img.style.margin = "1rem 0";
      img.style.display = "block";
      img.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
      img.style.objectFit = "contain";
      
      // Add loading attribute for better performance
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
      
      // Add alt text if missing
      if (!img.alt) {
        img.alt = "Step image";
      }

      // Handle image errors - show a placeholder instead of hiding
      img.onerror = () => {
        console.warn("Failed to load image:", src);
        img.style.opacity = "0.5";
        img.style.border = "2px dashed #ccc";
      };
      
      // Log successful image detection
      console.log("Image found and styled:", src);
    });
  }, [content]);

  if (!content) return null;

  // Use dangerouslySetInnerHTML to render HTML content including images
  return (
    <div
      ref={containerRef}
      className={`prose dark:prose-invert max-w-none prose-lg ${className}`}
      style={{
        wordBreak: "break-word",
      }}
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning
    />
  );
}
