import { CreateMultipartUploadCommand, UploadPartCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/app/lib/roles"
import { prisma } from "@/lib/prisma"
import { createShareKey, getShareBucket, getSharePublicUrl, getShareS3, slugifyArtist } from "../../storage"

const PART_SIZE = 50 * 1024 * 1024
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024
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
  if (size > MAX_FILE_SIZE) return NextResponse.json({ error: `${name} is too large. Max 5GB.` }, { status: 413 })
  if (!allowedContent.test(type)) return NextResponse.json({ error: `${name} has unsupported file type` }, { status: 415 })

  const s3 = getShareS3()
  const bucket = getShareBucket()
  if (!s3 || !bucket) return NextResponse.json({ error: "R2 storage is not configured" }, { status: 501 })

  const membership = await prisma.artistMember.findFirst({
    where: user.role === "ADMIN" ? {} : { userId: user.id },
    include: { artist: { select: { slug: true, name: true } } },
  })
  if (!membership) return NextResponse.json({ error: "No artist workspace assigned" }, { status: 404 })

  const artistSlug = slugifyArtist(membership.artist.slug || membership.artist.name)
  const key = createShareKey(artistSlug, name)

  const { UploadId: uploadId } = await s3.send(
    new CreateMultipartUploadCommand({ Bucket: bucket, Key: key, ContentType: type })
  )

  const partCount = Math.ceil(size / PART_SIZE)
  const parts = await Promise.all(
    Array.from({ length: partCount }, (_, i) => {
      const partNumber = i + 1
      return getSignedUrl(
        s3,
        new UploadPartCommand({ Bucket: bucket, Key: key, UploadId: uploadId!, PartNumber: partNumber }),
        { expiresIn: 4 * 60 * 60 }
      ).then(url => ({ partNumber, url }))
    })
  )

  return NextResponse.json({
    uploadId,
    key,
    parts,
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
