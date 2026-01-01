import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { Search, ArrowRight } from "lucide-react";
import { SearchHistory } from "@/components/search/SearchHistory";
import { SearchFilters } from "@/components/search/SearchFilters";

async function searchContent(query: string) {
  const searchTerm = query.toLowerCase();

  const airdrops = await prisma.airdrop.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        { tags: { contains: searchTerm } },
      ],
    },
    take: 10,
  });

  return { airdrops };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    q?: string;
    type?: string;
    status?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const results = query 
    ? await searchContent(query)
    : { airdrops: [] };

  const totalResults = results.airdrops.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-12">
        {!query && <SearchHistory />}
        {query && <SearchFilters />}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Search
              </span>
            </h1>
            {query && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {totalResults > 0 ? (
                  <>
                    Found <span className="font-bold text-indigo-600 dark:text-indigo-400">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for{" "}
                    <span className="font-semibold">"{query}"</span>
                  </>
                ) : (
                  <>No results found for <span className="font-semibold">"{query}"</span></>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {!query ? (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
          <CardContent className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mb-6">
              <Search className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Start Your Search
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Enter a search query above to find airdrops that match your interests.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {totalResults === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
              <CardContent className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-6">
                  <Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Results Found
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  No airdrops found for <span className="font-semibold">"{query}"</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Try different keywords or check back later for new content.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {results.airdrops.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Search Results
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Found {results.airdrops.length} airdrop{results.airdrops.length !== 1 ? 's' : ''} matching your search
                      </p>
                    </div>
                    <Badge variant="info" size="lg" className="hidden sm:flex">
                      {results.airdrops.length} result{results.airdrops.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {results.airdrops.map((airdrop) => (
                      <Card key={airdrop.id} className="group border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 shadow-sm hover:shadow-xl">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3">
                            {airdrop.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-3 text-base leading-relaxed">
                            {airdrop.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Link href={`/airdrops/${airdrop.slug}`}>
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
          )}
        </>
      )}
    </div>
  );
}

