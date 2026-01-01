import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const airdropSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(["potential", "confirmed", "verification", "reward available"]),
  socialLinks: z.string().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  rewardType: z.string().optional(),
  cost: z.string().optional(),
  taskType: z.string().optional(),
  verificationLink: z.string().nullable().optional(),
  rewardAvailableLink: z.string().nullable().optional(),
  rewardDate: z.string().optional(),
  instructions: z.string().optional(),
  eligibilityCriteria: z.string().optional(),
  participationSteps: z.string().optional(),
  tokenDetails: z.string().optional(),
  affiliateLinks: z.string().optional(),
  featuredImage: z.string().nullable().optional(),
  tags: z.string().optional(),
  published: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get("published");
    const status = searchParams.get("status");

    const where: any = {};
    if (published === "true") {
      where.published = true;
    }
    if (status) {
      where.status = status;
    }

    const airdrops = await prisma.airdrop.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(airdrops);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch airdrops" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = airdropSchema.parse(body);

    const slug = slugify(data.title);
    const existing = await prisma.airdrop.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "An airdrop with this title already exists" },
        { status: 400 }
      );
    }

    const airdrop = await prisma.airdrop.create({
      data: {
        ...data,
        slug,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        publishedAt: data.published ? new Date() : null,
      },
    });

    return NextResponse.json(airdrop, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create airdrop" },
      { status: 500 }
    );
  }
}

