import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

function getS3() {
  const endpoint = process.env.R2_ENDPOINT
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) return null
  return new S3Client({ region: "auto", endpoint, credentials: { accessKeyId, secretAccessKey } })
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const form = await request.formData()
  const file = form.get("file") as File | null
  const kind = (form.get("kind") as string | null) || "asset"
  const slug = (form.get("slug") as string | null) || String(Date.now())
  const baseDir = (form.get("baseDir") as string | null) || 'releases'

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const origin = request.headers.get("origin")
  const requestOrigin = new URL(request.url).origin
  if (origin && origin !== requestOrigin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: "File too large" }, { status: 413 })
  const allowedKinds = new Set(["asset", "image", "audio", "cover", "preview"])
  if (!allowedKinds.has(kind)) return NextResponse.json({ error: "Invalid kind" }, { status: 400 })
  const allowedContent =
    kind === 'image' || kind === 'cover' ? /^image\// :
    kind === 'audio' || kind === 'preview' ? /^audio\// : /^(image|audio)\//
  if (file.type && !allowedContent.test(file.type)) return NextResponse.json({ error: "Unsupported content type" }, { status: 415 })
  if (!/^[a-z0-9-_]+$/i.test(slug)) return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
  if (!/^[a-z0-9-/]+$/i.test(baseDir)) return NextResponse.json({ error: "Invalid baseDir" }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
  const key = `${baseDir}/${slug}/${kind}-${Date.now()}-${cleanName}`

  const s3 = getS3()
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
  if (s3 && bucket) {
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: file.type || undefined }))
    const base = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/$/, "")
    const url = base ? `${base}/${key}` : null
    return NextResponse.json({ success: true, url, key })
  }

  const uploadDir = join(process.cwd(), "public", "uploads", "admin")
  await mkdir(uploadDir, { recursive: true })
  const localName = key.split("/").slice(-1)[0]
  const filePath = join(uploadDir, localName)
  await writeFile(filePath, buffer)
  return NextResponse.json({ success: true, url: `/uploads/admin/${localName}`, key: localName })
}


