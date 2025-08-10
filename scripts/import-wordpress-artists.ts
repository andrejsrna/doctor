import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const prisma = new PrismaClient()

const WP_BASE = process.env.WP_API_BASE || 'https://admin.dnbdoctor.com/wp-json/wp/v2'
const R2_ENDPOINT = process.env.R2_ENDPOINT
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL

interface WPTitle { rendered?: string }
interface WPContent { rendered?: string }
interface WPMediaSize { source_url?: string }
interface WPMediaDetails { sizes?: { full?: WPMediaSize; large?: WPMediaSize; medium?: WPMediaSize } }
interface WPFeaturedMedia { source_url?: string; media_details?: WPMediaDetails }
interface WPEmbedded { 'wp:featuredmedia'?: WPFeaturedMedia[] }
interface WPArtist {
  id: number
  slug: string
  title?: WPTitle
  content?: WPContent
  _embedded?: WPEmbedded
  acf?: {
    soundcloud?: string
    spotify?: string
    facebook?: string
    instagram?: string
  }
}

function getS3(): S3Client | null {
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) return null
  return new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  })
}

async function downloadBuffer(url: string) {
  const res = await fetch(url)
  if (!res.ok) return null
  const contentType = res.headers.get('content-type') || undefined
  const arrayBuf = await res.arrayBuffer()
  const buffer = Buffer.from(arrayBuf)
  const fileName = url.split('/').pop() || `file-${Date.now()}`
  return { buffer, contentType, fileName }
}

async function uploadToR2(key: string, body: Buffer, contentType?: string): Promise<string | null> {
  const s3 = getS3()
  if (!s3 || !R2_BUCKET) return null
  await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: contentType }))
  if (R2_PUBLIC_BASE_URL) return `${R2_PUBLIC_BASE_URL.replace(/\/$/, '')}/${key}`
  return null
}

function getFeaturedImage(artist: WPArtist): string | null {
  const media = artist._embedded?.['wp:featuredmedia']?.[0]
  return (
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    media?.source_url ||
    null
  )
}

function decodeHtmlEntities(text: string): string {
  let result = text.replace(/&#(x?[0-9a-fA-F]+);/g, (_m, code: string) => {
    try {
      if (/^x/i.test(code)) return String.fromCodePoint(parseInt(code.slice(1), 16))
      return String.fromCodePoint(parseInt(code, 10))
    } catch {
      return _m
    }
  })
  result = result
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
  return result
}

async function fetchAllArtists(): Promise<WPArtist[]> {
  const perPage = 100
  let page = 1
  const all: WPArtist[] = []
  while (true) {
    const url = `${WP_BASE}/artists?_embed&per_page=${perPage}&page=${page}`
    const res = await fetch(url)
    if (res.status === 400 || res.status === 404) break
    if (!res.ok) throw new Error(`Failed WP fetch: ${res.status} ${await res.text()}`)
    const data = (await res.json()) as WPArtist[]
    if (!Array.isArray(data) || data.length === 0) break
    all.push(...data)
    if (data.length < perPage) break
    page += 1
  }
  return all
}

async function run() {
  const artists = await fetchAllArtists()
  let imported = 0

  for (const a of artists) {
    const wpId = a.id
    const slug = a.slug
    const rawName = a.title?.rendered ? String(a.title.rendered) : `artist-${wpId}`
    const name = decodeHtmlEntities(rawName)
    const bio = a.content?.rendered ? String(a.content.rendered) : null

    let imageUrl: string | null = null
    let imageKey: string | null = null

    const featuredUrl = getFeaturedImage(a)
    if (featuredUrl) {
      const downloaded = await downloadBuffer(featuredUrl)
      if (downloaded) {
        const key = `artists/${slug}/${downloaded.fileName}`
        const publicUrl = await uploadToR2(key, downloaded.buffer, downloaded.contentType)
        if (publicUrl) {
          imageUrl = publicUrl
          imageKey = key
        } else {
          imageUrl = featuredUrl
        }
      } else {
        imageUrl = featuredUrl
      }
    }

    await prisma.artist.upsert({
      where: { slug },
      create: {
        wpId,
        slug,
        name,
        bio: bio || undefined,
        imageUrl: imageUrl || undefined,
        imageKey: imageKey || undefined,
        soundcloud: a.acf?.soundcloud || undefined,
        spotify: a.acf?.spotify || undefined,
        facebook: a.acf?.facebook || undefined,
        instagram: a.acf?.instagram || undefined,
      },
      update: {
        wpId,
        name,
        bio: bio || undefined,
        imageUrl: imageUrl || undefined,
        imageKey: imageKey || undefined,
        soundcloud: a.acf?.soundcloud || undefined,
        spotify: a.acf?.spotify || undefined,
        facebook: a.acf?.facebook || undefined,
        instagram: a.acf?.instagram || undefined,
      },
    })

    imported += 1
    if (imported % 25 === 0) console.log(`Imported ${imported}/${artists.length}`)
  }

  console.log(`Artists import complete. Imported/updated: ${imported}`)
}

run()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
