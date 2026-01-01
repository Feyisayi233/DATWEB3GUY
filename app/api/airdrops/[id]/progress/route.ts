import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseParticipationSteps } from "@/lib/progress/parser";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;

    // Get tracked airdrop
    const trackedAirdrop = await prisma.trackedAirdrop.findUnique({
      where: {
        userId_airdropId: {
          userId,
          airdropId: id,
        },
      },
      include: {
        progress: {
          orderBy: { stepIndex: "asc" },
        },
        airdrop: {
          select: {
            participationSteps: true,
          },
        },
      },
    });

    if (!trackedAirdrop) {
      return NextResponse.json(
        { error: "Airdrop not tracked" },
        { status: 404 }
      );
    }

    // Parse steps from HTML
    const steps = parseParticipationSteps(trackedAirdrop.airdrop.participationSteps);

    // Map progress to steps
    const progressMap = new Map(
      trackedAirdrop.progress.map((p) => [p.stepIndex, p])
    );

    const stepsWithProgress = steps.map((step) => {
      const progress = progressMap.get(step.index);
      return {
        ...step,
        completed: progress?.completed || false,
        completedAt: progress?.completedAt || null,
        notes: progress?.notes || null,
      };
    });

    return NextResponse.json({
      steps: stepsWithProgress,
      totalSteps: steps.length,
      completedSteps: trackedAirdrop.progress.filter((p) => p.completed).length,
    });
  } catch (error: any) {
    console.error("Get progress error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get progress" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const { stepIndex, completed, notes } = await request.json();

    if (typeof stepIndex !== "number" || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get tracked airdrop
    const trackedAirdrop = await prisma.trackedAirdrop.findUnique({
      where: {
        userId_airdropId: {
          userId,
          airdropId: id,
        },
      },
      include: {
        airdrop: {
          select: {
            participationSteps: true,
          },
        },
      },
    });

    if (!trackedAirdrop) {
      return NextResponse.json(
        { error: "Airdrop not tracked" },
        { status: 404 }
      );
    }

    // Parse steps to get step title
    const steps = parseParticipationSteps(trackedAirdrop.airdrop.participationSteps);
    const step = steps[stepIndex];

    if (!step) {
      return NextResponse.json(
        { error: "Invalid step index" },
        { status: 400 }
      );
    }

    // Upsert progress
    const progress = await prisma.airdropProgress.upsert({
      where: {
        trackedAirdropId_stepIndex: {
          trackedAirdropId: trackedAirdrop.id,
          stepIndex,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
        notes: notes || null,
      },
      create: {
        trackedAirdropId: trackedAirdrop.id,
        stepIndex,
        stepTitle: step.title,
        completed,
        completedAt: completed ? new Date() : null,
        notes: notes || null,
      },
    });

    // Update tracked airdrop status based on progress
    const allProgress = await prisma.airdropProgress.findMany({
      where: { trackedAirdropId: trackedAirdrop.id },
    });

    const totalSteps = steps.length;
    const completedSteps = allProgress.filter((p) => p.completed).length;

    let newStatus = trackedAirdrop.status;
    if (completedSteps > 0 && newStatus === "tracking") {
      newStatus = "in_progress";
    }
    if (completedSteps === totalSteps && totalSteps > 0) {
      newStatus = "completed";
      await prisma.trackedAirdrop.update({
        where: { id: trackedAirdrop.id },
        data: { completedAt: new Date() },
      });
    }

    if (newStatus !== trackedAirdrop.status) {
      await prisma.trackedAirdrop.update({
        where: { id: trackedAirdrop.id },
        data: { status: newStatus },
      });
    }

    return NextResponse.json({
      progress,
      status: newStatus,
      completedSteps,
      totalSteps,
    });
  } catch (error: any) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update progress" },
      { status: 500 }
    );
  }
}
