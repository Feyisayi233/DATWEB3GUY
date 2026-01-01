"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function AirdropFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const currentStatus = searchParams.get("status") || "all";
  const currentRewardType = searchParams.get("rewardType") || "";
  const currentTaskType = searchParams.get("taskType") || "";
  const currentCost = searchParams.get("cost") || "";

  const statuses = [
    { value: "all", label: "All" },
    { value: "potential", label: "Potential" },
    { value: "confirmed", label: "Confirmed" },
    { value: "verification", label: "Verification" },
    { value: "reward available", label: "Reward Available" },
  ];

  const rewardTypes = [
    "Tokens",
    "Points",
    "Other",
  ];

  const taskTypes = [
    "Social Media",
    "On-chain",
    "Quiz",
    "Referral",
    "Other",
  ];

  const costOptions = [
    "Free",
    "Paid",
  ];

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // Reset to first page when filter changes
    router.push(`/airdrops?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/airdrops");
  };

  const hasActiveFilters = currentStatus !== "all" || currentRewardType || currentTaskType || currentCost;

  return (
    <div className="mb-8 space-y-4">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Button
            key={status.value}
            variant={currentStatus === status.value ? "primary" : "outline"}
            size="sm"
            onClick={() => updateFilter("status", status.value)}
          >
            {status.label}
          </Button>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Reward Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reward Type
              </label>
              <select
                value={currentRewardType}
                onChange={(e) => updateFilter("rewardType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Reward Types</option>
                {rewardTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Type
              </label>
              <select
                value={currentTaskType}
                onChange={(e) => updateFilter("taskType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Task Types</option>
                {taskTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Cost Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cost
              </label>
              <select
                value={currentCost}
                onChange={(e) => updateFilter("cost", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Costs</option>
                {costOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

