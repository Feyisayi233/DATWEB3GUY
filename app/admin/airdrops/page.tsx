import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { Plus, Edit, Trash2, Gift, ArrowRight } from "lucide-react";
import { DeleteAirdropButton } from "@/components/admin/DeleteAirdropButton";

async function getAirdrops() {
  return await prisma.airdrop.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminAirdropsPage() {
  const airdrops = await getAirdrops();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Manage Airdrops
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Create and manage your airdrop content
          </p>
        </div>
        <Link href="/admin/airdrops/new" className="w-full sm:w-auto flex-shrink-0">
          <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl text-sm sm:text-base">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            New Airdrop
          </Button>
        </Link>
      </div>

      {airdrops.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
              <Gift className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No airdrops yet
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first airdrop to get started!
            </p>
            <Link href="/admin/airdrops/new">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Airdrop
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {airdrops.map((airdrop) => (
            <Card 
              key={airdrop.id} 
              className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white break-words group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {airdrop.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={airdrop.published ? "success" : "default"}
                        size="sm"
                      >
                        {airdrop.published ? "Published" : "Draft"}
                      </Badge>
                      <Badge
                        variant={
                          airdrop.status === "reward available" ? "success" :
                          airdrop.status === "confirmed" ? "info" :
                          airdrop.status === "verification" ? "info" :
                          "default"
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {airdrop.status}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {airdrop.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(airdrop.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 lg:ml-4 w-full lg:w-auto flex-shrink-0">
                    <Link href={`/admin/airdrops/${airdrop.id}/edit`} className="flex-1 lg:flex-initial">
                      <Button variant="outline" size="sm" className="w-full lg:w-auto text-xs sm:text-sm group-hover:border-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20">
                        <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </Link>
                    <div className="flex-1 lg:flex-initial">
                      <DeleteAirdropButton id={airdrop.id} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

