"use client";

import { useState, useEffect } from "react";
import { Button } from "./Button";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={() => scrollToTop()}
      variant="primary"
      size="md"
      className={cn(
        "fixed bottom-8 right-8 z-50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300",
        "animate-fade-in"
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
