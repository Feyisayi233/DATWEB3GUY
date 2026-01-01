import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { trackAirdropChanges } from "@/lib/airdrop-changes";

const airdropSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["potential", "confirmed", "verification", "reward available"]).optional(),
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const airdrop = await prisma.airdrop.findUnique({
      where: { id },
    });

    if (!airdrop) {
      return NextResponse.json({ error: "Airdrop not found" }, { status: 404 });
    }

    return NextResponse.json(airdrop);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch airdrop" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = airdropSchema.parse(body);

    const existing = await prisma.airdrop.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Airdrop not found" }, { status: 404 });
    }

    const updateData: any = { ...data };
    if (data.title && data.title !== existing.title) {
      updateData.slug = slugify(data.title);
    }

    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    }

    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    }

    if (data.published !== undefined) {
      updateData.publishedAt = data.published ? new Date() : null;
    }

    // Prepare old data for change tracking (only if airdrop is published)
    const shouldTrackChanges = existing.published;
    const oldDataForTracking = shouldTrackChanges
      ? {
          participationSteps: existing.participationSteps || "",
          instructions: existing.instructions || "",
          eligibilityCriteria: existing.eligibilityCriteria || "",
          status: existing.status,
          verificationLink: existing.verificationLink,
          rewardAvailableLink: existing.rewardAvailableLink,
          startDate: existing.startDate,
          endDate: existing.endDate,
          rewardDate: existing.rewardDate || "",
          rewardType: existing.rewardType || "",
          cost: existing.cost || "",
          taskType: existing.taskType || "",
        }
      : null;

    const airdrop = await prisma.airdrop.update({
      where: { id },
      data: updateData,
    });

    // Track changes if airdrop is published
    if (shouldTrackChanges && oldDataForTracking) {
      const newDataForTracking = {
        participationSteps: data.participationSteps ?? existing.participationSteps ?? "",
        instructions: data.instructions ?? existing.instructions ?? "",
        eligibilityCriteria: data.eligibilityCriteria ?? existing.eligibilityCriteria ?? "",
        status: (data.status as string) ?? existing.status,
        verificationLink: data.verificationLink !== undefined ? data.verificationLink : existing.verificationLink,
        rewardAvailableLink: data.rewardAvailableLink !== undefined ? data.rewardAvailableLink : existing.rewardAvailableLink,
        startDate: data.startDate !== undefined ? (data.startDate ? new Date(data.startDate) : null) : existing.startDate,
        endDate: data.endDate !== undefined ? (data.endDate ? new Date(data.endDate) : null) : existing.endDate,
        rewardDate: data.rewardDate ?? existing.rewardDate ?? "",
        rewardType: data.rewardType ?? existing.rewardType ?? "",
        cost: data.cost ?? existing.cost ?? "",
        taskType: data.taskType ?? existing.taskType ?? "",
      };

      try {
        await trackAirdropChanges(
          id,
          oldDataForTracking,
          newDataForTracking,
          session.user?.email || undefined
        );
      } catch (error) {
        // Log error but don't fail the update
        console.error("Failed to track airdrop changes:", error);
      }
    }

    return NextResponse.json(airdrop);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update airdrop" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.airdrop.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete airdrop" },
      { status: 500 }
    );
  }
}

