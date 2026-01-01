"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const status = searchParams.get("status") || "all";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const query = params.get("q") || "";
    
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const query = searchParams.get("q");
    if (query) {
      params.set("q", query);
    }
    router.push(`/search?${params.toString()}`);
  };

  const hasActiveFilters = status !== "all";

  return (
    <Card className="border-2 mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Results
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="potential">Potential</option>
              <option value="confirmed">Confirmed</option>
              <option value="verification">Verification</option>
              <option value="reward available">Reward Available</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
