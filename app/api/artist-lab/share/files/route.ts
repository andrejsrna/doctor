import { ListObjectsV2Command } from "@aws-sdk/client-s3"
import { readdir, stat } from "fs/promises"
import { join } from "path"
import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/app/lib/roles"
import { prisma } from "@/lib/prisma"
import {
  displayNameFromKey,
  getShareBucket,
  getSharePublicUrl,
  getShareS3,
  slugifyArtist,
  type SharedFile,
} from "../storage"

export async function GET(request: NextRequest) {
  const { user, response } = await requireRole(request, ["ARTIST", "ADMIN"])
  if (response) return response
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const membership = await prisma.artistMember.findFirst({
    where: user.role === "ADMIN" ? {} : { userId: user.id },
    include: { artist: { select: { slug: true, name: true } } },
  })

  if (!membership) {
    return NextResponse.json({ error: "No artist workspace assigned" }, { status: 404 })
  }

  const artistSlug = slugifyArtist(membership.artist.slug || membership.artist.name)
  const s3 = getShareS3()
  const bucket = getShareBucket()

  if (s3 && bucket) {
    const prefix = `artist-lab/share/${artistSlug}/`
    const response = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, MaxKeys: 100 }))
    const files: SharedFile[] = (response.Contents || [])
      .filter((item) => item.Key)
      .map((item) => {
        const key = item.Key || ""
        return {
          name: displayNameFromKey(key),
          size: item.Size || 0,
          type: "file",
          key,
          url: getSharePublicUrl(key),
          uploadedAt: item.LastModified?.toISOString() || null,
        }
      })
      .sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime())

    return NextResponse.json({ files })
  }

  const uploadDir = join(process.cwd(), "public", "uploads", "artist-lab", artistSlug)
  const entries = await readdir(uploadDir).catch(() => [])
  const files = await Promise.all(
    entries.map(async (name) => {
      const filePath = join(uploadDir, name)
      const info = await stat(filePath)
      return {
        name,
        size: info.size,
        type: "file",
        key: name,
        url: `/uploads/artist-lab/${artistSlug}/${name}`,
        uploadedAt: info.mtime.toISOString(),
      } satisfies SharedFile
    })
  )

  files.sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime())
  return NextResponse.json({ files })
}
