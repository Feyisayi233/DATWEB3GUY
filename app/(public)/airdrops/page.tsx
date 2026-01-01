import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { Search, ArrowRight, RefreshCw } from "lucide-react";
import { AirdropFilters } from "@/components/airdrops/AirdropFilters";
import { Pagination } from "@/components/ui/Pagination";
import { SortSelect } from "@/components/ui/SortSelect";

const ITEMS_PER_PAGE = 12;

async function getAirdrops(
  status?: string,
  rewardType?: string,
  taskType?: string,
  cost?: string,
  sort?: string,
  order: "asc" | "desc" = "desc",
  page: number = 1
) {
  const where: any = { published: true };
  
  if (status && status !== "all") {
    where.status = status;
  }
  if (rewardType) {
    where.rewardType = { contains: rewardType };
  }
  if (taskType) {
    where.taskType = { contains: taskType };
  }
  if (cost) {
    if (cost === "Free") {
      where.cost = { contains: "Free" };
    } else if (cost === "Paid") {
      where.cost = { not: { contains: "Free" } };
    }
  }

  // Determine orderBy based on sort parameter
  let orderBy: any = { createdAt: order };
  if (sort === "updated") {
    orderBy = { lastUpdatedAt: order };
  } else if (sort === "status") {
    orderBy = { status: order };
  } else if (sort === "rewardType") {
    orderBy = { rewardType: order };
  }

  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [airdrops, totalCount] = await Promise.all([
    prisma.airdrop.findMany({
      where,
      orderBy,
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.airdrop.count({ where }),
  ]);

  // Update hasRecentUpdates flag for airdrops that are older than 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  for (const airdrop of airdrops) {
    if (airdrop.hasRecentUpdates && airdrop.lastUpdatedAt) {
      if (airdrop.lastUpdatedAt < sevenDaysAgo) {
        await prisma.airdrop.update({
          where: { id: airdrop.id },
          data: { hasRecentUpdates: false },
        });
        airdrop.hasRecentUpdates = false;
      }
    }
  }

  return {
    airdrops,
    totalCount,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
  };
}

export default async function AirdropsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    status?: string;
    rewardType?: string;
    taskType?: string;
    cost?: string;
    sort?: string;
    order?: "asc" | "desc";
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const sort = params.sort || "date";
  const order = params.order || "desc";
  
  const { airdrops, totalPages } = await getAirdrops(
    params.status,
    params.rewardType,
    params.taskType,
    params.cost,
    sort,
    order,
    page
  );

  const sortOptions = [
    { value: "date", label: "Date (Newest)", order: "desc" as const },
    { value: "date", label: "Date (Oldest)", order: "asc" as const },
    { value: "updated", label: "Recently Updated", order: "desc" as const },
    { value: "status", label: "Status", order: "asc" as const },
    { value: "rewardType", label: "Reward Type", order: "asc" as const },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Page Header */}
      <div className="mb-16 text-center md:text-left">
        <Badge variant="info" size="md" className="mb-4">
          Airdrop Opportunities
        </Badge>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Airdrop Tracker
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
          Discover and track the latest airdrop opportunities in the Web3 space. Never miss a chance to earn free tokens.
        </p>
      </div>

      <AirdropFilters />

      {/* Sort and Results Count */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {airdrops.length > 0 ? `Showing ${(page - 1) * ITEMS_PER_PAGE + 1}-${Math.min(page * ITEMS_PER_PAGE, airdrops.length + (page - 1) * ITEMS_PER_PAGE)} of results` : "No results found"}
        </p>
        <SortSelect 
          options={sortOptions}
          defaultSort="date"
          defaultOrder="desc"
        />
      </div>

      {airdrops.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
          <CardContent className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-6">
              <Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Airdrops Found
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your filters or check back soon for new opportunities!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {airdrops.map((airdrop, index) => (
            <Card 
              key={airdrop.id} 
              className="animate-slide-up group border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-xl"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:opacity-75 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        airdrop.status === "reward available" ? "success" :
                        airdrop.status === "confirmed" ? "info" :
                        airdrop.status === "verification" ? "info" :
                        "default"
                      }
                      icon
                      size="sm"
                      className="capitalize font-semibold"
                    >
                      {airdrop.status}
                    </Badge>
                    {airdrop.hasRecentUpdates && (
                      <Badge
                        variant="info"
                        size="sm"
                        className="flex items-center gap-1 animate-pulse font-semibold"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Updated
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="mb-3 text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-bold">
                  {airdrop.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 text-base leading-relaxed">
                  {airdrop.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  {(airdrop.rewardType || airdrop.cost) && (
                    <div className="flex flex-wrap gap-3 text-sm">
                      {airdrop.rewardType && (
                        <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Reward:</span>
                          <span className="ml-1.5 text-gray-900 dark:text-white font-medium">{airdrop.rewardType}</span>
                        </div>
                      )}
                      {airdrop.cost && (
                        <div className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Cost:</span>
                          <span className="ml-1.5 text-gray-900 dark:text-white font-medium">{airdrop.cost}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {formatDate(airdrop.createdAt)}
                    </span>
                    <Link href={`/airdrops/${airdrop.slug}`}>
                      <Button variant="outline" size="sm" className="group-hover:border-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all font-semibold">
                        View Details
                        <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/airdrops"
          />
        </div>
      )}
    </div>
  );
}

