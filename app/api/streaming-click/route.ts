import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { slug, platform } = await request.json().catch(() => ({ slug: "", platform: "" }))
  const safePlatform = typeof platform === "string" ? platform.slice(0, 80) : ""
  const safeSlug = typeof slug === "string" ? slug : ""

  if (!safePlatform || !safeSlug) {
    return NextResponse.json({ error: "Missing slug or platform" }, { status: 400 })
  }

  const release = await prisma.release.findUnique({
    where: { slug: safeSlug },
    select: { id: true },
  })

  if (!release) {
    return NextResponse.json({ error: "Release not found" }, { status: 404 })
  }

  const click = await prisma.streamingClick.upsert({
    where: { releaseId_platform: { releaseId: release.id, platform: safePlatform } },
    update: { count: { increment: 1 }, lastClickedAt: new Date() },
    create: { releaseId: release.id, platform: safePlatform, count: 1, lastClickedAt: new Date() },
  })

  return NextResponse.json({ ok: true, count: click.count })
}
