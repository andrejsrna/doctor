import { NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { auth } from "@/app/lib/auth"
import { validateAdminOrigin } from "@/app/lib/adminUtils"

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

function cleanFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-")
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  validateAdminOrigin(request)

  const data = await request.json().catch(() => null)
  const name = String(data?.name || "").trim()
  const type = String(data?.type || "application/octet-stream").trim() || "application/octet-stream"
  const size = Number(data?.size || 0)
  const kind = String(data?.kind || "download").trim()
  const slug = String(data?.slug || "").trim()
  const baseDir = String(data?.baseDir || "news").trim()

  if (!name || !size) return NextResponse.json({ error: "File name and size are required" }, { status: 400 })
  if (!/^[a-z0-9-_]+$/i.test(slug)) return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
  if (!/^[a-z0-9-/]+$/i.test(baseDir)) return NextResponse.json({ error: "Invalid baseDir" }, { status: 400 })
  if (!/^[a-z0-9-_]+$/i.test(kind)) return NextResponse.json({ error: "Invalid kind" }, { status: 400 })

  const maxSizeBytes = 5 * 1024 * 1024 * 1024
  if (size > maxSizeBytes) return NextResponse.json({ error: "File too large. Max 5GB." }, { status: 413 })
  if (type && !/^(application\/|audio\/|video\/|image\/)/.test(type)) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 })
  }

  const s3 = getS3()
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
  if (!s3 || !bucket) return NextResponse.json({ error: "R2 upload is not configured" }, { status: 501 })

  const key = `${baseDir}/${slug}/${kind}-${Date.now()}-${cleanFileName(name)}`
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: type,
    }),
    { expiresIn: 60 * 60 }
  )

  const base = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/$/, "")
  const url = base ? `${base}/${key}` : null
  return NextResponse.json({ success: true, uploadUrl, url, key })
}
