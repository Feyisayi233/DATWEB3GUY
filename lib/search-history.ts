const STORAGE_KEY = "web3_creator_search_history";
const MAX_HISTORY = 10;

export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addToSearchHistory(query: string): void {
  if (!query.trim()) return;
  
  try {
    const history = getSearchHistory();
    // Remove if already exists
    const filtered = history.filter(q => q.toLowerCase() !== query.toLowerCase());
    // Add to beginning
    filtered.unshift(query.trim());
    // Keep only last MAX_HISTORY items
    const limited = filtered.slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch {
    // Ignore errors
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

export function removeFromSearchHistory(query: string): void {
  try {
    const history = getSearchHistory();
    const filtered = history.filter(q => q.toLowerCase() !== query.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Ignore errors
  }
}
