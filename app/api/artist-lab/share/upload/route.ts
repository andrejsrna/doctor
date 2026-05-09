import { NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { createWriteStream } from "fs"
import { mkdir } from "fs/promises"
import { join } from "path"
import { Readable } from "stream"
import { pipeline } from "stream/promises"
import { requireRole } from "@/app/lib/roles"
import { prisma } from "@/lib/prisma"

const maxSizeBytes = 5 * 1024 * 1024 * 1024

function getS3() {
  const endpoint = process.env.R2_ENDPOINT
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) return null
  return new S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  })
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "artist"
}

function toNodeReadable(file: File) {
  return Readable.fromWeb(file.stream() as unknown as Parameters<typeof Readable.fromWeb>[0])
}

export async function POST(request: NextRequest) {
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

  const form = await request.formData()
  const files = form.getAll("files").filter((entry): entry is File => entry instanceof File)
  if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 })
  if (files.length > 10) return NextResponse.json({ error: "Upload up to 10 files at once" }, { status: 400 })

  const allowedContent = /^(audio\/|video\/|image\/|application\/zip|application\/x-zip-compressed|application\/octet-stream)/
  const s3 = getS3()
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
  const publicBase = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/$/, "")
  const artistSlug = slugify(membership.artist.slug || membership.artist.name)
  const uploaded: Array<{ name: string; size: number; type: string; key: string; url: string | null }> = []

  for (const file of files) {
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: `${file.name} is too large. Max 5GB.` }, { status: 413 })
    }

    if (file.type && !allowedContent.test(file.type)) {
      return NextResponse.json({ error: `${file.name} has unsupported file type` }, { status: 415 })
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
    const key = `artist-lab/share/${artistSlug}/${Date.now()}-${cleanName}`

    if (s3 && bucket) {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: toNodeReadable(file),
          ContentLength: file.size,
          ContentType: file.type || undefined,
        })
      )
      uploaded.push({ name: file.name, size: file.size, type: file.type || "file", key, url: publicBase ? `${publicBase}/${key}` : null })
      continue
    }

    const uploadDir = join(process.cwd(), "public", "uploads", "artist-lab", artistSlug)
    await mkdir(uploadDir, { recursive: true })
    const filePath = join(uploadDir, cleanName)
    await pipeline(toNodeReadable(file), createWriteStream(filePath))
    uploaded.push({
      name: file.name,
      size: file.size,
      type: file.type || "file",
      key: cleanName,
      url: `/uploads/artist-lab/${artistSlug}/${cleanName}`,
    })
  }

  return NextResponse.json({ success: true, files: uploaded })
}
