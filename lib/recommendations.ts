import { prisma } from "@/lib/prisma";

export type ContentType = "airdrop";

interface RecommendationOptions {
  currentId: string;
  type: ContentType;
  tags?: string;
  status?: string;
  limit?: number;
}

export async function getRecommendations(options: RecommendationOptions) {
  const { currentId, type, tags, status, limit = 4 } = options;

  if (type !== "airdrop") {
    return [];
  }

  // Parse tags
  const tagArray = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];

  const where: any = {
    published: true,
    id: { not: currentId },
  };

  // Try to find by tags first
  if (tagArray.length > 0) {
    where.OR = [
      { tags: { contains: tagArray[0] } },
      { status: status },
    ];
  } else if (status) {
    where.status = status;
  }

  const recommendations = await prisma.airdrop.findMany({
    where,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  // If we don't have enough, fill with any published airdrops
  if (recommendations.length < limit) {
    const additional = await prisma.airdrop.findMany({
      where: {
        published: true,
        id: { notIn: [currentId, ...recommendations.map(r => r.id)] },
      },
      take: limit - recommendations.length,
      orderBy: { createdAt: "desc" },
    });
    return [...recommendations, ...additional];
  }

  return recommendations;
}
