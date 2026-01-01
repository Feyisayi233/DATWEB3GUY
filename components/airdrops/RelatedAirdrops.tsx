import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

interface RelatedAirdropsProps {
  currentAirdropId: string;
  currentTags: string;
  currentStatus: string;
}

export async function RelatedAirdrops({ currentAirdropId, currentTags, currentStatus }: RelatedAirdropsProps) {
  // Parse tags
  const tags = currentTags ? currentTags.split(",").map(t => t.trim()).filter(Boolean) : [];
  
  // Find related airdrops by tags first, then by status
  let relatedAirdrops = await prisma.airdrop.findMany({
    where: {
      published: true,
      id: { not: currentAirdropId },
      OR: tags.length > 0 ? [
        { tags: { contains: tags[0] } },
        { status: currentStatus },
      ] : [
        { status: currentStatus },
      ],
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  // If we don't have enough, fill with any published airdrops
  if (relatedAirdrops.length < 3) {
    const additional = await prisma.airdrop.findMany({
      where: {
        published: true,
        id: { 
          notIn: [currentAirdropId, ...relatedAirdrops.map(a => a.id)]
        },
      },
      take: 4 - relatedAirdrops.length,
      orderBy: { createdAt: "desc" },
    });
    relatedAirdrops = [...relatedAirdrops, ...additional];
  }

  if (relatedAirdrops.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedAirdrops.map((airdrop) => (
          <Card 
            key={airdrop.id}
            className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 group"
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
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
              <CardTitle className="text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {airdrop.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-2">
                {airdrop.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/airdrops/${airdrop.slug}`}>
                <Button variant="outline" size="sm" className="w-full group-hover:border-indigo-400">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
