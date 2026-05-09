import { CompleteMultipartUploadCommand } from "@aws-sdk/client-s3"
import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/app/lib/roles"
import { getShareBucket, getSharePublicUrl, getShareS3 } from "../../storage"

type PartData = { PartNumber: number; ETag: string }

export async function POST(request: NextRequest) {
  const { user, response } = await requireRole(request, ["ARTIST", "ADMIN"])
  if (response) return response
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await request.json().catch(() => null)
  const key = String(data?.key || "").trim()
  const uploadId = String(data?.uploadId || "").trim()
  const parts: PartData[] = data?.parts || []

  if (!key || !uploadId || !parts.length) {
    return NextResponse.json({ error: "key, uploadId and parts are required" }, { status: 400 })
  }

  const s3 = getShareS3()
  const bucket = getShareBucket()
  if (!s3 || !bucket) return NextResponse.json({ error: "R2 storage is not configured" }, { status: 501 })

  await s3.send(
    new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map(p => ({ PartNumber: p.PartNumber, ETag: p.ETag })),
      },
    })
  )

  return NextResponse.json({ success: true, url: getSharePublicUrl(key) })
}
