"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./Button";

export type SortOption = {
  value: string;
  label: string;
  order?: "asc" | "desc";
};

interface SortSelectProps {
  options: SortOption[];
  defaultSort?: string;
  defaultOrder?: "asc" | "desc";
  className?: string;
}

export function SortSelect({ options, defaultSort, defaultOrder = "desc", className }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || defaultSort || options[0]?.value;
  const currentOrder = (searchParams.get("order") as "asc" | "desc") || defaultOrder;

  const handleSortChange = (value: string, order: "asc" | "desc" = "desc") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("order", order);
    params.delete("page"); // Reset to first page when sorting changes
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentOption = options.find(opt => opt.value === currentSort) || options[0];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Sort by:</span>
      <select
        value={currentSort}
        onChange={(e) => {
          const selectedOption = options.find(opt => opt.value === e.target.value);
          handleSortChange(e.target.value, selectedOption?.order || currentOrder);
        }}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
      >
        {options.map((option, index) => (
          <option key={`${option.value}-${option.order || "desc"}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {currentOrder && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSortChange(currentSort, currentOrder === "asc" ? "desc" : "asc")}
          className="px-2"
          title={`Sort ${currentOrder === "asc" ? "descending" : "ascending"}`}
        >
          {currentOrder === "asc" ? "↑" : "↓"}
        </Button>
      )}
    </div>
  );
}
