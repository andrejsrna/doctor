import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET() {
  try {
    const [totalSubscribers, activeSubscribers, pendingSubscribers] = await Promise.all([
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { status: "ACTIVE" } }),
      prisma.subscriber.count({ where: { status: "PENDING" } })
    ]);

    return NextResponse.json({
      totalSubscribers,
      activeSubscribers,
      pendingSubscribers
    });
  } catch (error) {
    console.error("Error fetching newsletter stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletter stats" },
      { status: 500 }
    );
  }
} 