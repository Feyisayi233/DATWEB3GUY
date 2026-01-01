import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const airdrops = await prisma.airdrop.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/airdrops`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  const airdropRoutes = airdrops.map((airdrop) => ({
    url: `${baseUrl}/airdrops/${airdrop.slug}`,
    lastModified: airdrop.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...routes, ...airdropRoutes];
}

