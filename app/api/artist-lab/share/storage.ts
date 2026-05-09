import { S3Client } from "@aws-sdk/client-s3"

export type SharedFile = {
  name: string
  size: number
  type: string
  key: string
  url: string | null
  uploadedAt?: string | null
}

export function getShareS3() {
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

export function getShareBucket() {
  return process.env.R2_BUCKET || process.env.R2_BUCKET_NAME || ""
}

export function getSharePublicUrl(key: string) {
  const publicBase = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/$/, "")
  return publicBase ? `${publicBase}/${key}` : null
}

export function slugifyArtist(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "artist"
}

export function displayNameFromKey(key: string) {
  const fileName = key.split("/").pop() || key
  return fileName.replace(/^\d+-/, "")
}

export function cleanShareFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-")
}

export function createShareKey(artistSlug: string, fileName: string) {
  return `artist-lab/share/${artistSlug}/${Date.now()}-${cleanShareFileName(fileName)}`
}
