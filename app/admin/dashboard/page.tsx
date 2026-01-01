import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Gift, Plus, TrendingUp, FileText, Sparkles } from "lucide-react";

async function getStats() {
  const airdrops = await prisma.airdrop.count();
  const publishedAirdrops = await prisma.airdrop.count({ where: { published: true } });

  return {
    airdrops: { total: airdrops, published: publishedAirdrops },
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const totalContent = stats.airdrops.total;
  const totalPublished = stats.airdrops.published;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Dashboard
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your content.
          </p>
        </div>
        <Badge variant="info" size="lg" className="hidden sm:flex flex-shrink-0">
          <Sparkles className="h-4 w-4 mr-1" />
          Admin Portal
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-800 dark:to-indigo-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Total Content
              </CardTitle>
              <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex-shrink-0">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {totalContent}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {totalPublished} published
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Airdrops
              </CardTitle>
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 group-hover:scale-110 transition-transform shadow-lg flex-shrink-0">
                <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.airdrops.total}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
              {stats.airdrops.published} published
            </p>
            <Link href="/admin/airdrops/new">
              <Button size="sm" variant="outline" className="w-full text-xs sm:text-sm group-hover:border-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20">
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
                New Airdrop
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link href="/admin/airdrops">
              <Button variant="outline" className="w-full justify-start group hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20">
                <Gift className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Manage Airdrops
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

