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
interface WPNewsPost {
  id: number
  slug: string
  title?: WPTitle
  content?: WPContent
  date?: string
  acf?: { scsc?: string; artist?: number }
  meta?: { _related_artist?: string }
  _embedded?: WPEmbedded
}

function getS3(): S3Client | null {
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) return null
  return new S3Client({ region: 'auto', endpoint: R2_ENDPOINT, credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY } })
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

function getFeaturedImage(post: WPNewsPost): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  return (
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    media?.source_url ||
    null
  )
}

async function fetchAllNews(): Promise<WPNewsPost[]> {
  const perPage = 100
  let page = 1
  const all: WPNewsPost[] = []
  while (true) {
    const url = `${WP_BASE}/news?_embed&per_page=${perPage}&page=${page}`
    const res = await fetch(url)
    if (res.status === 400 || res.status === 404) break
    if (!res.ok) throw new Error(`Failed WP fetch: ${res.status} ${await res.text()}`)
    const data = (await res.json()) as WPNewsPost[]
    if (!Array.isArray(data) || data.length === 0) break
    all.push(...data)
    if (data.length < perPage) break
    page += 1
  }
  return all
}

function decodeHtmlEntities(text: string): string {
  let result = text.replace(/&#(x?[0-9a-fA-F]+);/g, (_m, code: string) => {
    try {
      if (/^x/i.test(code)) return String.fromCodePoint(parseInt(code.slice(1), 16))
      return String.fromCodePoint(parseInt(code, 10))
    } catch { return _m }
  })
  result = result.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  return result
}

async function run() {
  const posts = await fetchAllNews()
  let imported = 0

  for (const post of posts) {
    const wpId = post.id
    const slug = post.slug
    const rawTitle = post.title?.rendered ? String(post.title.rendered) : `Untitled ${wpId}`
    const title = decodeHtmlEntities(rawTitle)
    const content = post.content?.rendered ? String(post.content.rendered) : null
    const scsc = post.acf?.scsc || null
    const relatedArtistName = post.meta?._related_artist || null
    const publishedAt = post.date ? new Date(post.date) : null

    let coverImageUrl: string | null = null
    let coverImageKey: string | null = null

    const featuredUrl = getFeaturedImage(post)
    if (featuredUrl) {
      const downloaded = await downloadBuffer(featuredUrl)
      if (downloaded) {
        const key = `news/${slug}/${downloaded.fileName}`
        const publicUrl = await uploadToR2(key, downloaded.buffer, downloaded.contentType)
        if (publicUrl) {
          coverImageUrl = publicUrl
          coverImageKey = key
        } else {
          coverImageUrl = featuredUrl
        }
      } else {
        coverImageUrl = featuredUrl
      }
    }

    await prisma.news.upsert({
      where: { slug },
      create: {
        wpId,
        slug,
        title,
        content,
        coverImageUrl: coverImageUrl || undefined,
        coverImageKey: coverImageKey || undefined,
        scsc: scsc || undefined,
        relatedArtistName: relatedArtistName || undefined,
        publishedAt: publishedAt || undefined,
      },
      update: {
        wpId,
        title,
        content,
        coverImageUrl: coverImageUrl || undefined,
        coverImageKey: coverImageKey || undefined,
        scsc: scsc || undefined,
        relatedArtistName: relatedArtistName || undefined,
        publishedAt: publishedAt || undefined,
      },
    })

    imported += 1
    if (imported % 25 === 0) console.log(`Imported ${imported}/${posts.length}`)
  }

  console.log(`News import complete. Imported/updated: ${imported}`)
}

run().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
