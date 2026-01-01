import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Gift, Sparkles, RefreshCw } from "lucide-react";
import Image from "next/image";

async function getFeaturedContent() {
  const [featuredAirdrops, recentlyUpdatedAirdrops] = await Promise.all([
    prisma.airdrop.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.airdrop.findMany({
      where: { 
        published: true,
        hasRecentUpdates: true,
      },
      orderBy: { lastUpdatedAt: "desc" },
      take: 6,
    }),
  ]);

  // Update hasRecentUpdates flag for airdrops that are older than 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  for (const airdrop of recentlyUpdatedAirdrops) {
    if (airdrop.hasRecentUpdates && airdrop.lastUpdatedAt) {
      if (airdrop.lastUpdatedAt < sevenDaysAgo) {
        await prisma.airdrop.update({
          where: { id: airdrop.id },
          data: { hasRecentUpdates: false },
        });
      }
    }
  }

  // Filter out airdrops that are no longer recent
  const filteredRecentlyUpdated = recentlyUpdatedAirdrops.filter(
    (airdrop) => airdrop.lastUpdatedAt && airdrop.lastUpdatedAt >= sevenDaysAgo
  );

  return { featuredAirdrops, recentlyUpdatedAirdrops: filteredRecentlyUpdated };
}

export default async function HomePage() {
  const { featuredAirdrops, recentlyUpdatedAirdrops } = await getFeaturedContent();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20 sm:py-28 lg:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white/90">
              <Sparkles className="h-4 w-4" />
              <span>Your Trusted Web3 Resource</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-100">
                Your Web3
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-white mt-2">
                Airdrop Hub
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-indigo-100/90 font-normal leading-relaxed px-4 mb-10">
              Track airdrops and stay updated with the latest Web3 opportunities.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/airdrops" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="w-full sm:w-auto shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 group"
                >
                  Explore Airdrops
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            {/* Stats or Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 max-w-2xl mx-auto pt-12 border-t border-white/20">
              <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                  {featuredAirdrops.length}+
                </div>
                <div className="text-sm font-medium text-indigo-200/90 uppercase tracking-wide">Active Airdrops</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                  100%
                </div>
                <div className="text-sm font-medium text-indigo-200/90 uppercase tracking-wide">Free Access</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-800/50"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge variant="info" size="md" className="mb-4">
              Our Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Everything You Need to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Succeed in Web3
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools and resources to navigate the Web3 ecosystem with confidence
            </p>
          </div>
          <div className="grid grid-cols-1 place-items-center max-w-2xl mx-auto">
            <Card className="text-center group border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 animate-slide-up w-full">
              <CardHeader className="pb-6">
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-8 shadow-2xl group-hover:scale-110 group-hover:shadow-indigo-500/50 transition-all duration-300 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80"></div>
                  <Gift className="h-14 w-14 text-white relative z-10" />
                </div>
                <CardTitle className="text-3xl mb-4 font-extrabold">Airdrop Tracker</CardTitle>
                <CardDescription className="text-lg leading-relaxed max-w-xl mx-auto">
                  Stay updated with the latest airdrop opportunities and learn how to participate safely. Get real-time alerts, track your progress, and never miss a deadline.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/airdrops">
                  <Button size="lg" className="group-hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
                    Explore Airdrops
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Airdrops */}
      {featuredAirdrops.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16">
              <div className="mb-6 sm:mb-0">
                <Badge variant="info" size="md" className="mb-4">
                  Hot Opportunities
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
                  Featured{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Airdrops
                  </span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Don't miss out on these exciting opportunities. Act fast before they end!
                </p>
              </div>
              <Link href="/airdrops">
                <Button variant="outline" size="lg" className="hidden sm:flex group">
                  View All Airdrops
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredAirdrops.map((airdrop, index) => (
                <Card 
                  key={airdrop.id} 
                  className="animate-slide-up group border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:opacity-75 transition-opacity"></div>
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <Badge
                        variant={
                          airdrop.status === "reward available" ? "success" :
                          airdrop.status === "confirmed" ? "info" :
                          airdrop.status === "verification" ? "info" :
                          "default"
                        }
                        icon
                        size="sm"
                        className="capitalize"
                      >
                        {airdrop.status}
                      </Badge>
                    </div>
                    <CardTitle className="mb-3 text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {airdrop.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-base leading-relaxed">
                      {airdrop.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <Link href={`/airdrops/${airdrop.slug}`}>
                      <Button variant="outline" className="w-full group-hover:border-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center sm:hidden">
              <Link href="/airdrops">
                <Button variant="outline" size="lg" className="group">
                  View All Airdrops
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recently Updated Airdrops */}
      {recentlyUpdatedAirdrops.length > 0 && (
        <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16">
              <div className="mb-6 sm:mb-0">
                <Badge variant="info" size="md" className="mb-4 flex items-center gap-2 w-fit">
                  <RefreshCw className="h-4 w-4" />
                  Fresh Updates
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
                  Recently{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                    Updated
                  </span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Stay in the loop with the latest changes and updates to active airdrops
                </p>
              </div>
              <Link href="/airdrops">
                <Button variant="outline" size="lg" className="hidden sm:flex group">
                  View All Airdrops
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {recentlyUpdatedAirdrops.map((airdrop, index) => (
                <Card 
                  key={airdrop.id} 
                  className="animate-slide-up group border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:opacity-75 transition-opacity"></div>
                  <CardHeader className="relative">
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <Badge
                        variant={
                          airdrop.status === "reward available" ? "success" :
                          airdrop.status === "confirmed" ? "info" :
                          airdrop.status === "verification" ? "info" :
                          "default"
                        }
                        icon
                        size="sm"
                        className="capitalize"
                      >
                        {airdrop.status}
                      </Badge>
                      <Badge
                        variant="info"
                        size="sm"
                        className="flex items-center gap-1 animate-pulse"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Updated
                      </Badge>
                    </div>
                    <CardTitle className="mb-3 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {airdrop.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-base leading-relaxed">
                      {airdrop.description}
                    </CardDescription>
                    {airdrop.lastUpdatedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Updated {formatDate(airdrop.lastUpdatedAt)}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="relative">
                    <Link href={`/airdrops/${airdrop.slug}`}>
                      <Button variant="outline" className="w-full group-hover:border-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                        View Updates
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center sm:hidden">
              <Link href="/airdrops">
                <Button variant="outline" size="lg" className="group">
                  View All Airdrops
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

