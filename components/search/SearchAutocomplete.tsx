"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock } from "lucide-react";
import { getSearchHistory } from "@/lib/search-history";
import { cn } from "@/lib/utils";

interface SearchAutocompleteProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (query: string) => void;
  className?: string;
}

export function SearchAutocomplete({ query, onQueryChange, onSelect, className }: SearchAutocompleteProps) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      // Show search history as suggestions
      const history = getSearchHistory();
      const filtered = history.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      // Show recent searches when input is empty
      const history = getSearchHistory().slice(0, 5);
      setSuggestions(history);
      setShowSuggestions(history.length > 0 && document.activeElement === inputRef.current);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          onSelect(suggestions[selectedIndex]);
        } else {
          onSelect(query);
        }
        setShowSuggestions(false);
        break;
      case "Escape":
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (suggestion: string) => {
    onSelect(suggestion);
    setShowSuggestions(false);
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/30 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search... (⌘K)"
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => {
            // Delay to allow click events on suggestions
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className={cn(
                "w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2",
                index === selectedIndex && "bg-gray-100 dark:bg-gray-700"
              )}
            >
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{highlightMatch(suggestion, query)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
