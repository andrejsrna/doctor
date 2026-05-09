import { NextRequest, NextResponse } from "next/server"
import { validateAdminOrigin } from "@/app/lib/adminUtils"
import { requireRole } from "@/app/lib/roles"
import { prisma } from "@/lib/prisma"
import {
  ARTIST_PRE_RELEASE_ASSET_TEMPLATE_ID,
  assignArtistPreReleaseAssetChecklist,
} from "@/lib/artistLabPreReleaseAssets"
import {
  ARTIST_RELEASE_WEEK_TEMPLATE_ID,
  assignArtistReleaseWeekChecklist,
} from "@/lib/artistLabReleaseWeek"

export async function POST(request: NextRequest) {
  const { response } = await requireRole(request, ["ADMIN"])
  if (response) return response
  validateAdminOrigin(request)

  const data = await request.json()
  const artistId = String(data.artistId || "")
  const templateId = String(data.templateId || "")

  if (!artistId || !templateId) {
    return NextResponse.json({ error: "Artist and template are required" }, { status: 400 })
  }

  const artist = await prisma.artist.findUnique({ where: { id: artistId }, select: { id: true } })
  if (!artist) return NextResponse.json({ error: "Artist not found" }, { status: 404 })

  if (templateId === ARTIST_PRE_RELEASE_ASSET_TEMPLATE_ID) {
    const result = await assignArtistPreReleaseAssetChecklist(prisma, artistId)
    return NextResponse.json(result)
  }

  if (templateId === ARTIST_RELEASE_WEEK_TEMPLATE_ID) {
    const result = await assignArtistReleaseWeekChecklist(prisma, artistId)
    return NextResponse.json(result)
  }

  return NextResponse.json({ error: "Unsupported document template" }, { status: 400 })
}
