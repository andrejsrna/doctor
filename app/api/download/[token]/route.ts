import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { Readable } from "node:stream"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

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

function filenameFromKey(key: string) {
  const last = key.split("/").slice(-1)[0] || "download"
  return last.replace(/^download-\d+-/, "")
}

export async function GET(_request: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params
  const now = new Date()

  const tokenRow = await prisma.releaseDownloadToken.findUnique({
    where: { token },
    include: {
      release: {
        select: {
          downloadFileKey: true,
          downloadFileUrl: true,
          downloadFileName: true,
        },
      },
    },
  })

  if (!tokenRow) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (tokenRow.expiresAt <= now) return NextResponse.json({ error: "Expired" }, { status: 410 })

  if (!tokenRow.usedAt) {
    prisma.releaseDownloadToken
      .update({ where: { token }, data: { usedAt: now } })
      .catch(() => null)
  }

  const key = tokenRow.release.downloadFileKey
  const url = tokenRow.release.downloadFileUrl
  const filename = tokenRow.release.downloadFileName || (key ? filenameFromKey(key) : "download")

  if (!key && url) return NextResponse.redirect(url, { status: 302 })
  if (!key) return NextResponse.json({ error: "File not configured" }, { status: 500 })

  const headers = new Headers()
  headers.set("Cache-Control", "private, no-store")
  headers.set("Content-Disposition", `attachment; filename="${filename.replace(/"/g, "")}"`)

  const s3 = getS3()
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
  if (s3 && bucket) {
    const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    const body = obj.Body as Readable | undefined
    if (!body) return NextResponse.json({ error: "Missing body" }, { status: 500 })
    if (obj.ContentType) headers.set("Content-Type", obj.ContentType)
    const stream = Readable.toWeb(body) as ReadableStream
    return new NextResponse(stream, { status: 200, headers })
  }

  const filePath = join(process.cwd(), "public", "uploads", "admin", key)
  const buffer = await readFile(filePath)
  headers.set("Content-Type", "application/octet-stream")
  return new NextResponse(new Uint8Array(buffer), { status: 200, headers })
}
