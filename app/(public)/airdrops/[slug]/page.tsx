import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { ExternalLink, CheckCircle, Twitter, MessageCircle, Send, Globe, Calendar, Gift, DollarSign, Briefcase, Clock, FileText } from "lucide-react";
import { EligibilityChecker } from "@/components/airdrops/EligibilityChecker";
import { HtmlContent } from "@/components/airdrops/HtmlContent";
import { ParticipationChecklist } from "@/components/airdrops/ParticipationChecklist";
import { UpdateIndicator } from "@/components/airdrops/UpdateIndicator";
import { AirdropChangelog } from "@/components/airdrops/AirdropChangelog";
import { getRecentChanges } from "@/lib/airdrop-changes";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ShareButtons } from "@/components/sharing/ShareButtons";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { TrackButton } from "@/components/airdrops/TrackButton";
import { ReadingProgress } from "@/components/airdrops/ReadingProgress";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { RecommendedContent } from "@/components/recommendations/RecommendedContent";
import Image from "next/image";

async function getAirdrop(slug: string) {
  return await prisma.airdrop.findUnique({
    where: { slug, published: true },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const airdrop = await getAirdrop(slug);
  if (!airdrop) {
    return {};
  }
  
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/airdrops/${slug}`;
  
  return {
    title: `${airdrop.title} - Airdrop Tracker`,
    description: airdrop.description,
    openGraph: {
      title: airdrop.title,
      description: airdrop.description,
      url,
      siteName: "DAT WEB3 GUY",
      images: airdrop.featuredImage?.trim() ? [
        {
          url: airdrop.featuredImage,
          width: 1200,
          height: 630,
          alt: airdrop.title,
        },
      ] : [],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: airdrop.title,
      description: airdrop.description,
      images: airdrop.featuredImage?.trim() ? [airdrop.featuredImage] : [],
    },
  };
}

export default async function AirdropDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const airdrop = await getAirdrop(slug);

  if (!airdrop) {
    notFound();
  }

  // Fetch recent changes
  const changes = await getRecentChanges(airdrop.id, 30); // Get changes from last 30 days

  let affiliateLinks: any = {};
  try {
    affiliateLinks = JSON.parse(airdrop.affiliateLinks || "{}");
  } catch (e) {
    // Invalid JSON, ignore
  }

  let socialLinks: any = {};
  try {
    socialLinks = JSON.parse(airdrop.socialLinks || "{}");
  } catch (e) {
    // Invalid JSON, ignore
  }

  const formatDateTime = (date: Date | null | undefined): string => {
    if (!date) return "Not specified";
    return formatDate(date);
  };

  return (
    <>
      <ReadingProgress contentId={airdrop.id} type="airdrop" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Airdrops", href: "/airdrops" },
          { label: airdrop.title },
        ]}
        className="mb-6"
      />

      {/* Header Section */}
      <div className="mb-12 animate-fade-in">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge
            variant={
              airdrop.status === "reward available" ? "success" :
              airdrop.status === "confirmed" ? "info" :
              airdrop.status === "verification" ? "info" :
              "default"
            }
            icon
            size="md"
            className="capitalize"
          >
            {airdrop.status}
          </Badge>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Published: {formatDate(airdrop.createdAt)}
          </span>
          {airdrop.hasRecentUpdates && airdrop.lastUpdatedAt && (
            <UpdateIndicator
              lastUpdatedAt={airdrop.lastUpdatedAt}
              hasRecentUpdates={airdrop.hasRecentUpdates}
            />
          )}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            {airdrop.title}
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-4xl">
          {airdrop.description}
        </p>
        
        {/* Share, Bookmark, and Track Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <TrackButton airdropId={airdrop.id} />
          <ShareButtons
            url={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/airdrops/${airdrop.slug}`}
            title={airdrop.title}
            description={airdrop.description}
          />
          <BookmarkButton
            id={airdrop.id}
            type="airdrop"
            title={airdrop.title}
            slug={airdrop.slug}
            description={airdrop.description}
          />
        </div>
      </div>

      {airdrop.featuredImage?.trim() && (
        <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl relative h-96">
          <Image
            src={airdrop.featuredImage}
            alt={airdrop.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      )}

      {/* Key Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
        {airdrop.rewardType && (
          <Card className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 shadow-sm hover:shadow-lg group bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-950/20">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Gift className="h-7 w-7 text-white" />
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Reward Type</p>
              <p className="font-bold text-lg text-gray-900 dark:text-white">{airdrop.rewardType}</p>
            </CardContent>
          </Card>
        )}
        {airdrop.cost && (
          <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 shadow-sm hover:shadow-lg group bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-950/20">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Cost</p>
              <p className="font-bold text-lg text-gray-900 dark:text-white">{airdrop.cost}</p>
            </CardContent>
          </Card>
        )}
        {airdrop.taskType && (
          <Card className="border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 shadow-sm hover:shadow-lg group bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-950/20">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Task Type</p>
              <p className="font-bold text-lg text-gray-900 dark:text-white">{airdrop.taskType}</p>
            </CardContent>
          </Card>
        )}
        {airdrop.rewardDate && (
          <Card className="border-2 hover:border-pink-200 dark:hover:border-pink-800 transition-all duration-300 shadow-sm hover:shadow-lg group bg-gradient-to-br from-white to-pink-50/30 dark:from-gray-800 dark:to-pink-950/20">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Reward Date</p>
              <p className="font-bold text-lg text-gray-900 dark:text-white">{airdrop.rewardDate}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dates Section */}
      {(airdrop.startDate || airdrop.endDate) && (
        <Card className="mb-10 border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 shadow-sm hover:shadow-lg bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/20">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {airdrop.startDate && (
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">Start Date</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {formatDateTime(airdrop.startDate)}
                  </p>
                </div>
              )}
              {airdrop.endDate && (
                <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">End Date</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {formatDateTime(airdrop.endDate)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Links */}
      {(airdrop.status === "verification" && airdrop.verificationLink) || 
       (airdrop.status === "reward available" && airdrop.rewardAvailableLink) ? (
        <Card className="mb-10 border-2 border-indigo-400 dark:border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <ExternalLink className="h-6 w-6 text-white" />
              </div>
              {airdrop.status === "verification" ? "Verification Link" : "Claim Your Reward"}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {airdrop.status === "verification" 
                ? "Click below to verify your eligibility and complete the verification process."
                : "Your reward is ready! Click below to claim it now."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href={airdrop.status === "verification" ? airdrop.verificationLink! : airdrop.rewardAvailableLink!}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl font-bold text-base h-14">
                {airdrop.status === "verification" ? "Verify Now" : "Claim Reward"}
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {airdrop.instructions && (
            <Card className="border-2 hover:border-yellow-200 dark:hover:border-yellow-800 transition-all duration-300 shadow-sm hover:shadow-lg bg-gradient-to-br from-white to-yellow-50/30 dark:from-gray-800 dark:to-yellow-950/20">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none prose-lg">
                  <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-800">
                    <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300 text-base">
                      {airdrop.instructions}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {airdrop.eligibilityCriteria && (
            <Card className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 shadow-sm hover:shadow-lg bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-950/20">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Eligibility Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none prose-lg">
                  <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800">
                    <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300 text-base">
                      {airdrop.eligibilityCriteria}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {airdrop.participationSteps && (
            <ParticipationChecklist
              airdropId={airdrop.id}
              participationSteps={airdrop.participationSteps}
            />
          )}

          {airdrop.tokenDetails && (
            <Card className="border-2 hover:border-pink-200 dark:hover:border-pink-800 transition-all duration-300 shadow-sm hover:shadow-lg bg-gradient-to-br from-white to-pink-50/30 dark:from-gray-800 dark:to-pink-950/20">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                    <Gift className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  Token Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none prose-lg">
                  <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-800">
                    <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300 text-base">
                      {airdrop.tokenDetails}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <EligibilityChecker airdrop={airdrop} />

          {changes.length > 0 && (
            <AirdropChangelog changes={changes.map(change => ({
              ...change,
              changedAt: change.changedAt,
            }))} />
          )}
        </div>

        <div className="space-y-6">
          {/* Social Links */}
          {(socialLinks.twitter || socialLinks.discord || socialLinks.telegram || socialLinks.website) && (
            <Card className="border-2 sticky top-24 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Social Links
                </CardTitle>
                <CardDescription className="text-sm mt-2">
                  Connect with the project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <Button variant="outline" className="w-full justify-between group-hover:border-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter/X
                      </div>
                      <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </a>
                )}
                {socialLinks.discord && (
                  <a
                    href={socialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <Button variant="outline" className="w-full justify-between group-hover:border-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Discord
                      </div>
                      <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </a>
                )}
                {socialLinks.telegram && (
                  <a
                    href={socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <Button variant="outline" className="w-full justify-between group-hover:border-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Telegram
                      </div>
                      <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <Button variant="outline" className="w-full justify-between group-hover:border-gray-400 group-hover:bg-gray-50 dark:group-hover:bg-gray-950/20 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-all">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                      </div>
                      <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {Object.keys(affiliateLinks).length > 0 && (
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(affiliateLinks).map(([label, url]) => (
                  <a
                    key={label}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <Button variant="outline" className="w-full justify-between group-hover:border-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                      {label}
                      <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {airdrop.tags && (
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {airdrop.tags.split(",").map((tag) => (
                    <Badge
                      key={tag}
                      variant="default"
                      size="sm"
                      className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                    >
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recommended Content */}
      <RecommendedContent
        currentId={airdrop.id}
        type="airdrop"
        tags={airdrop.tags}
        status={airdrop.status}
      />
      </div>
      <ScrollToTop />
    </>
  );
}

