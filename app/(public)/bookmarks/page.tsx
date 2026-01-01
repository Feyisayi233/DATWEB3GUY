"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { getBookmarks, type Bookmark } from "@/lib/bookmarks";
import { ArrowRight, Heart, Gift } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBookmarks(getBookmarks());
    setLoading(false);
    
    // Listen for storage changes (from other tabs)
    const handleStorageChange = () => {
      setBookmarks(getBookmarks());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleRemove = (id: string, type: Bookmark["type"]) => {
    const bookmark: Bookmark = {
      id,
      type,
      title: "",
      slug: "",
      createdAt: "",
    };
    // Trigger re-render by removing from state
    setBookmarks(getBookmarks());
  };

  const airdropBookmarks = bookmarks.filter(b => b.type === "airdrop");

  const getTypePath = () => "/airdrops";

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
          <CardContent className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/30 dark:to-red-900/30 mb-6">
              <Heart className="h-12 w-12 text-pink-500 dark:text-pink-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
              No Bookmarks Yet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start saving your favorite airdrops to access them quickly later!
            </p>
            <Link href="/airdrops">
              <Button size="lg" className="shadow-lg hover:shadow-xl">
                Browse Airdrops
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl shadow-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
              My Bookmarks
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {airdropBookmarks.length} saved {airdropBookmarks.length === 1 ? "airdrop" : "airdrops"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {airdropBookmarks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Gift className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Airdrops ({airdropBookmarks.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {airdropBookmarks.map((bookmark) => (
                <Card key={`${bookmark.type}-${bookmark.id}`} className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 group shadow-sm hover:shadow-xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:scale-110 transition-transform">
                        <Gift className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <BookmarkButton
                        id={bookmark.id}
                        type={bookmark.type}
                        title={bookmark.title}
                        slug={bookmark.slug}
                        description={bookmark.description}
                      />
                    </div>
                    <CardTitle className="text-xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {bookmark.title}
                    </CardTitle>
                    {bookmark.description && (
                      <CardDescription className="line-clamp-3 text-base leading-relaxed">
                        {bookmark.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Saved {formatDate(new Date(bookmark.createdAt))}</span>
                    </div>
                    <Link href={`${getTypePath()}/${bookmark.slug}`}>
                      <Button variant="outline" size="sm" className="w-full group-hover:border-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all font-semibold">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
