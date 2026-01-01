import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "circle";
}

export function Skeleton({ className, variant = "default" }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";
  
  const variants = {
    default: "rounded",
    card: "rounded-lg h-64",
    text: "rounded h-4",
    circle: "rounded-full",
  };

  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="border-2 border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden animate-pulse">
      <Skeleton variant="card" className="h-48 w-full" />
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton variant="text" className="w-16 h-5 rounded-full" />
          <Skeleton variant="text" className="w-12 h-5 rounded-full" />
        </div>
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-5/6 h-4" />
        <div className="flex items-center justify-between mt-4">
          <Skeleton variant="text" className="w-24 h-4" />
          <Skeleton variant="text" className="w-20 h-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
