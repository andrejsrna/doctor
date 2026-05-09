import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/app/lib/roles"
import { prisma } from "@/lib/prisma"
import { createShareKey, getShareBucket, getSharePublicUrl, getShareS3, slugifyArtist } from "../storage"

const maxSizeBytes = 5 * 1024 * 1024 * 1024
const allowedContent = /^(audio\/|video\/|image\/|application\/zip|application\/x-zip-compressed|application\/octet-stream)/

export async function POST(request: NextRequest) {
  const { user, response } = await requireRole(request, ["ARTIST", "ADMIN"])
  if (response) return response
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await request.json().catch(() => null)
  const name = String(data?.name || "").trim()
  const size = Number(data?.size || 0)
  const type = String(data?.type || "application/octet-stream").trim() || "application/octet-stream"

  if (!name || !size) return NextResponse.json({ error: "File name and size are required" }, { status: 400 })
  if (size > maxSizeBytes) return NextResponse.json({ error: `${name} is too large. Max 5GB.` }, { status: 413 })
  if (type && !allowedContent.test(type)) return NextResponse.json({ error: `${name} has unsupported file type` }, { status: 415 })

  const s3 = getShareS3()
  const bucket = getShareBucket()
  if (!s3 || !bucket) {
    return NextResponse.json({ error: "Direct R2 upload is not configured" }, { status: 501 })
  }

  const membership = await prisma.artistMember.findFirst({
    where: user.role === "ADMIN" ? {} : { userId: user.id },
    include: { artist: { select: { slug: true, name: true } } },
  })

  if (!membership) {
    return NextResponse.json({ error: "No artist workspace assigned" }, { status: 404 })
  }

  const artistSlug = slugifyArtist(membership.artist.slug || membership.artist.name)
  const key = createShareKey(artistSlug, name)
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: type,
    }),
    { expiresIn: 60 * 60 }
  )

  return NextResponse.json({
    uploadUrl,
    file: {
      name,
      size,
      type,
      key,
      url: getSharePublicUrl(key),
      uploadedAt: new Date().toISOString(),
    },
  })
}
