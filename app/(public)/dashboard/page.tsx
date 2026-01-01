import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { 
  Gift, 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp,
  Calendar,
  ArrowRight,
  Target
} from "lucide-react";
import Image from "next/image";

async function getDashboardData(userId: string) {
  const [trackedAirdrops, stats] = await Promise.all([
    prisma.trackedAirdrop.findMany({
      where: { userId },
      include: {
        airdrop: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            status: true,
            endDate: true,
            featuredImage: true,
            rewardType: true,
            cost: true,
          },
        },
        progress: {
          select: {
            stepIndex: true,
            completed: true,
          },
        },
      },
      orderBy: { trackedAt: "desc" },
    }),
    prisma.trackedAirdrop.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),
  ]);

  // Calculate stats
  const statsMap = stats.reduce((acc, stat) => {
    acc[stat.status] = stat._count;
    return acc;
  }, {} as Record<string, number>);

  const totalTracked = trackedAirdrops.length;
  const inProgress = statsMap["in_progress"] || 0;
  const completed = statsMap["completed"] || 0;
  const missed = statsMap["missed"] || 0;
  const tracking = statsMap["tracking"] || 0;

  // Get upcoming deadlines (next 7 days)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const now = new Date();

  const upcomingDeadlines = trackedAirdrops
    .filter((ta) => {
      if (!ta.airdrop.endDate) return false;
      const endDate = new Date(ta.airdrop.endDate);
      return endDate >= now && endDate <= sevenDaysFromNow;
    })
    .sort((a, b) => {
      const dateA = a.airdrop.endDate ? new Date(a.airdrop.endDate).getTime() : 0;
      const dateB = b.airdrop.endDate ? new Date(b.airdrop.endDate).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 5);

  // Calculate progress for each tracked airdrop
  const trackedWithProgress = trackedAirdrops.map((ta) => {
    const totalSteps = ta.progress.length;
    const completedSteps = ta.progress.filter((p) => p.completed).length;
    const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return {
      ...ta,
      progressPercent,
      completedSteps,
      totalSteps,
    };
  });

  return {
    trackedAirdrops: trackedWithProgress,
    stats: {
      totalTracked,
      inProgress,
      completed,
      missed,
      tracking,
    },
    upcomingDeadlines,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const userId = (session.user as any).id;
  const { trackedAirdrops, stats, upcomingDeadlines } = await getDashboardData(userId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            My Dashboard
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Track your airdrop progress and never miss an opportunity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-12">
        <Card className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 shadow-sm hover:shadow-lg group bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Total Tracked
                </p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
                  {stats.totalTracked}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Airdrops</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Gift className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 shadow-sm hover:shadow-lg group bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  In Progress
                </p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
                  {stats.inProgress}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Active</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 shadow-sm hover:shadow-lg group bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Completed
                </p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
                  {stats.completed}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Finished</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 shadow-sm hover:shadow-lg group bg-gradient-to-br from-white to-red-50/30 dark:from-gray-800 dark:to-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Missed
                </p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
                  {stats.missed}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Expired</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <XCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 shadow-sm hover:shadow-lg group bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Tracking
                </p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
                  {stats.tracking}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Watching</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <Card className="mb-12 border-2 border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50/50 to-orange-50/30 dark:from-yellow-950/20 dark:to-orange-950/10 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-400 dark:bg-yellow-600 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-900 dark:text-yellow-100" />
              </div>
              <div>
                <CardTitle className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription className="text-base font-medium">
                  Next 7 Days - Act Fast!
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((ta) => (
                <Link
                  key={ta.id}
                  href={`/airdrops/${ta.airdrop.slug}`}
                  className="block p-5 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 bg-white dark:bg-gray-800 hover:border-yellow-400 dark:hover:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors">
                        {ta.airdrop.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">Ends:</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {formatDate(ta.airdrop.endDate!)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-yellow-600 dark:text-yellow-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracked Airdrops */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tracked Airdrops
          </h2>
          <Link href="/airdrops">
            <Button variant="outline" size="sm">
              Browse More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {trackedAirdrops.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No tracked airdrops yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start tracking airdrops to see them here
              </p>
              <Link href="/airdrops">
                <Button>
                  Browse Airdrops
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {trackedAirdrops.map((ta) => (
              <Card
                key={ta.id}
                className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 group shadow-sm hover:shadow-xl overflow-hidden"
              >
                {ta.airdrop.featuredImage?.trim() && (
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={ta.airdrop.featuredImage}
                      alt={ta.airdrop.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant={
                          ta.status === "completed" ? "success" :
                          ta.status === "in_progress" ? "info" :
                          ta.status === "missed" ? "default" :
                          "info"
                        }
                        size="sm"
                        className="capitalize font-semibold backdrop-blur-sm"
                      >
                        {ta.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                )}
                <CardHeader className={ta.airdrop.featuredImage?.trim() ? "" : "pb-4"}>
                  {!ta.airdrop.featuredImage?.trim() && (
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant={
                          ta.status === "completed" ? "success" :
                          ta.status === "in_progress" ? "info" :
                          ta.status === "missed" ? "default" :
                          "info"
                        }
                        size="sm"
                        className="capitalize font-semibold"
                      >
                        {ta.status.replace("_", " ")}
                      </Badge>
                      {ta.totalSteps > 0 && (
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
                          {ta.completedSteps}/{ta.totalSteps} steps
                        </span>
                      )}
                    </div>
                  )}
                  <CardTitle className={`text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${ta.airdrop.featuredImage?.trim() ? 'text-white' : ''}`}>
                    {ta.airdrop.title}
                  </CardTitle>
                  <CardDescription className={`line-clamp-2 ${ta.airdrop.featuredImage?.trim() ? 'text-white/90' : ''}`}>
                    {ta.airdrop.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ta.totalSteps > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <span>Progress</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{Math.round(ta.progressPercent)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${ta.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Tracked {formatDate(ta.trackedAt)}
                    </span>
                    <Link href={`/airdrops/${ta.airdrop.slug}`}>
                      <Button variant="outline" size="sm" className="group-hover:border-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all font-semibold">
                        View Details
                        <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
