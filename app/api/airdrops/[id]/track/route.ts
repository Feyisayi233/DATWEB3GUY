import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Check if airdrop exists
    const airdrop = await prisma.airdrop.findUnique({
      where: { id, published: true },
    });

    if (!airdrop) {
      return NextResponse.json(
        { error: "Airdrop not found" },
        { status: 404 }
      );
    }

    // Check if already tracked
    const existing = await prisma.trackedAirdrop.findUnique({
      where: {
        userId_airdropId: {
          userId,
          airdropId: id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Airdrop already tracked" },
        { status: 400 }
      );
    }

    // Create tracked airdrop
    const trackedAirdrop = await prisma.trackedAirdrop.create({
      data: {
        userId,
        airdropId: id,
        status: "tracking",
      },
      include: {
        airdrop: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            endDate: true,
          },
        },
      },
    });

    return NextResponse.json(trackedAirdrop, { status: 201 });
  } catch (error: any) {
    console.error("Track airdrop error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to track airdrop" },
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
    const userId = (session.user as any).id;

    // Delete tracked airdrop
    await prisma.trackedAirdrop.delete({
      where: {
        userId_airdropId: {
          userId,
          airdropId: id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Untrack airdrop error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to untrack airdrop" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ isTracked: false });
    }

    const { id } = await params;
    const userId = (session.user as any).id;

    const tracked = await prisma.trackedAirdrop.findUnique({
      where: {
        userId_airdropId: {
          userId,
          airdropId: id,
        },
      },
    });

    return NextResponse.json({ isTracked: !!tracked });
  } catch (error: any) {
    return NextResponse.json({ isTracked: false });
  }
}
