export type BookmarkType = "airdrop";

export interface Bookmark {
  id: string;
  type: BookmarkType;
  title: string;
  slug: string;
  description?: string;
  createdAt: string;
}

const STORAGE_KEY = "web3_creator_bookmarks";

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addBookmark(bookmark: Bookmark): boolean {
  try {
    const bookmarks = getBookmarks();
    // Check if already bookmarked
    if (bookmarks.some(b => b.id === bookmark.id && b.type === bookmark.type)) {
      return false;
    }
    bookmarks.push(bookmark);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return true;
  } catch {
    return false;
  }
}

export function removeBookmark(id: string, type: BookmarkType): boolean {
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(b => !(b.id === id && b.type === type));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function isBookmarked(id: string, type: BookmarkType): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.id === id && b.type === type);
}

export function getBookmarksByType(type: BookmarkType): Bookmark[] {
  const bookmarks = getBookmarks();
  return bookmarks.filter(b => b.type === type);
}
