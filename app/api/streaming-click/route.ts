import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendMetaCapiEvent } from "@/lib/metaCapi"
import { sendGoogleAdsConversion } from "@/lib/googleAdsConversion"

export async function POST(request: NextRequest) {
  const { slug, platform, eventId, eventSourceUrl, adClickIds } = await request
    .json()
    .catch(() => ({ slug: "", platform: "", eventId: undefined, eventSourceUrl: undefined, adClickIds: undefined }))
  const safePlatform = typeof platform === "string" ? platform.slice(0, 80) : ""
  const safeSlug = typeof slug === "string" ? slug : ""
  const safeEventId = typeof eventId === "string" ? eventId.slice(0, 80) : undefined
  const safeEventSourceUrl = typeof eventSourceUrl === "string" ? eventSourceUrl.slice(0, 500) : undefined
  const safeAdClickIds =
    adClickIds && typeof adClickIds === "object"
      ? {
          gclid: typeof adClickIds.gclid === "string" ? adClickIds.gclid.slice(0, 128) : undefined,
          wbraid: typeof adClickIds.wbraid === "string" ? adClickIds.wbraid.slice(0, 128) : undefined,
          gbraid: typeof adClickIds.gbraid === "string" ? adClickIds.gbraid.slice(0, 128) : undefined,
        }
      : undefined
  const cookieGclid = request.cookies.get("dd_gclid")?.value
  const cookieWbraid = request.cookies.get("dd_wbraid")?.value
  const cookieGbraid = request.cookies.get("dd_gbraid")?.value
  const resolvedAdClickIds = {
    gclid: safeAdClickIds?.gclid || cookieGclid,
    wbraid: safeAdClickIds?.wbraid || cookieWbraid,
    gbraid: safeAdClickIds?.gbraid || cookieGbraid,
  }

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

  await sendGoogleAdsConversion({
    request,
    eventId: safeEventId,
    ...(resolvedAdClickIds.gclid ? { gclid: resolvedAdClickIds.gclid } : {}),
    ...(resolvedAdClickIds.wbraid ? { wbraid: resolvedAdClickIds.wbraid } : {}),
    ...(resolvedAdClickIds.gbraid ? { gbraid: resolvedAdClickIds.gbraid } : {}),
  })

  return NextResponse.json({ ok: true, count: click.count })
}
