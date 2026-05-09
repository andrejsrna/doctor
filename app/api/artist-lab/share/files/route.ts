import { ListObjectsV2Command } from "@aws-sdk/client-s3"
import { readdir, stat } from "fs/promises"
import { join } from "path"
import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/app/lib/roles"
import {
  displayNameFromKey,
  getShareBucket,
  getSharePublicUrl,
  getShareS3,
  type SharedFile,
} from "../storage"

export async function GET(request: NextRequest) {
  const { user, response } = await requireRole(request, ["ARTIST", "ADMIN"])
  if (response) return response
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const s3 = getShareS3()
  const bucket = getShareBucket()

  if (s3 && bucket) {
    const prefix = "artist-lab/share/"
    const r2Response = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, MaxKeys: 500 }))
    const files: (SharedFile & { artist?: string })[] = (r2Response.Contents || [])
      .filter((item) => item.Key)
      .map((item) => {
        const key = item.Key || ""
        // key format: artist-lab/share/{artistSlug}/{timestamp}-{filename}
        const artistSlug = key.split("/")[2] || ""
        return {
          name: displayNameFromKey(key),
          size: item.Size || 0,
          type: "file",
          key,
          url: getSharePublicUrl(key),
          uploadedAt: item.LastModified?.toISOString() || null,
          artist: artistSlug,
        }
      })
      .sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime())

    return NextResponse.json({ files })
  }

  const shareRoot = join(process.cwd(), "public", "uploads", "artist-lab")
  const artistDirs = await readdir(shareRoot).catch(() => [])
  const allFiles: (SharedFile & { artist?: string })[] = []

  for (const artistSlug of artistDirs) {
    const uploadDir = join(shareRoot, artistSlug)
    const entries = await readdir(uploadDir).catch(() => [])
    const artistFiles = await Promise.all(
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
          artist: artistSlug,
        } satisfies SharedFile & { artist: string }
      })
    )
    allFiles.push(...artistFiles)
  }

  allFiles.sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime())
  return NextResponse.json({ files: allFiles })
}
