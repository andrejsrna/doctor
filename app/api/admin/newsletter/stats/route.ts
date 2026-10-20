import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/app/lib/roles";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: NextRequest) {
  const guard = await requireRole(request, ["ADMIN"]);
  if (guard.response) return guard.response;
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