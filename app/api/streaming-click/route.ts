import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendMetaCapiEvent } from "@/lib/metaCapi"

export async function POST(request: NextRequest) {
  const { slug, platform, eventId, eventSourceUrl } = await request
    .json()
    .catch(() => ({ slug: "", platform: "", eventId: undefined, eventSourceUrl: undefined }))
  const safePlatform = typeof platform === "string" ? platform.slice(0, 80) : ""
  const safeSlug = typeof slug === "string" ? slug : ""
  const safeEventId = typeof eventId === "string" ? eventId.slice(0, 80) : undefined
  const safeEventSourceUrl = typeof eventSourceUrl === "string" ? eventSourceUrl.slice(0, 500) : undefined

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

  await sendMetaCapiEvent({
    request,
    eventName: "Purchase",
    eventId: safeEventId,
    eventSourceUrl: safeEventSourceUrl,
    customData: {
      content_name: safePlatform,
      content_type: "streaming_click",
      content_category: "Music",
      content_ids: [safeSlug],
      value: 0,
      currency: "USD",
    },
  })

  return NextResponse.json({ ok: true, count: click.count })
}
