"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { addToSearchHistory } from "@/lib/search-history";
import { SearchAutocomplete } from "./search/SearchAutocomplete";

interface SearchBarProps {
  onFocus?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ onFocus, autoFocus }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery.trim());
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xs">
      <SearchAutocomplete
        query={query}
        onQueryChange={setQuery}
        onSelect={handleSearch}
        className="flex-1"
      />
      <Button 
        type="submit" 
        size="sm"
        className="px-4"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}

