"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSearchHistory, removeFromSearchHistory, clearSearchHistory } from "@/lib/search-history";
import { Clock, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SearchHistory() {
  const router = useRouter();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  if (history.length === 0) {
    return null;
  }

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleRemove = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromSearchHistory(query);
    setHistory(getSearchHistory());
  };

  const handleClear = () => {
    clearSearchHistory();
    setHistory([]);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Searches
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((query) => (
          <button
            key={query}
            onClick={() => handleSearch(query)}
            className="group flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span>{query}</span>
            <button
              onClick={(e) => handleRemove(query, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove ${query} from history`}
            >
              <X className="h-3 w-3" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}
