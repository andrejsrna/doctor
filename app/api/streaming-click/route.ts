import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendMetaCapiEvent } from "@/lib/metaCapi"

// Some environments / proxies may probe API routes with GET/HEAD.
// Also, certain clients may accidentally navigate to this route.
// We respond with a friendly JSON payload instead of Next.js default 405 HTML.
export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed. Use POST." }, { status: 405 })
}

export async function HEAD() {
  return new NextResponse(null, { status: 405 })
}

// Optional: handle OPTIONS defensively.
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

export async function POST(request: NextRequest) {
  const { slug, platform, eventId, eventSourceUrl } = await request
    .json()
    .catch(() => ({ slug: "", platform: "", eventId: undefined, eventSourceUrl: undefined, adClickIds: undefined }))
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
