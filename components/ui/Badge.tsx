import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, Zap } from "lucide-react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  className?: string;
}

const variantStyles = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
};

const iconMap = {
  default: null,
  success: CheckCircle2,
  warning: Clock,
  error: XCircle,
  info: Zap,
};

const sizeStyles = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  icon = false,
  className,
}: BadgeProps) {
  const Icon = icon ? iconMap[variant] : null;
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full border",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {Icon && <Icon className={iconSize} />}
      {children}
    </span>
  );
}

