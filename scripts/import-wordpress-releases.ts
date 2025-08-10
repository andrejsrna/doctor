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
interface WPExcerpt { rendered?: string }
interface WPMediaSize { source_url?: string }
interface WPMediaDetails { sizes?: { full?: WPMediaSize; medium?: WPMediaSize } }
interface WPFeaturedMedia { source_url?: string; media_details?: WPMediaDetails }
interface WPMediaResponse { source_url?: string }
interface WPEmbedded { 'wp:featuredmedia'?: WPFeaturedMedia[] }
interface ACFFields {
  preview?: unknown
  spotify?: string
  apple_music?: string
  beatport?: string
  deezer?: string
  soundcloud?: string
  youtube_music?: string
  junodownload?: string
  tidal?: string
  gumroad?: string
  bandcamp?: string
}
interface WPPost {
  id: number
  slug: string
  title?: WPTitle
  content?: WPContent
  excerpt?: WPExcerpt
  date?: string
  categories?: number[]
  acf?: ACFFields
  _embedded?: WPEmbedded
}

interface WPCategory { id: number; name: string }

interface NormalizedAcf {
  spotify: string | null
  appleMusic: string | null
  beatport: string | null
  deezer: string | null
  soundcloud: string | null
  youtubeMusic: string | null
  junoDownload: string | null
  tidal: string | null
  rawPreview: unknown
  gumroad: string | null
  bandcamp: string | null
}

function getS3(): S3Client | null {
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) return null
  return new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  })
}

async function fetchAllPosts(): Promise<WPPost[]> {
  const perPage = 100
  let page = 1
  const all: WPPost[] = []
  while (true) {
    const url = `${WP_BASE}/posts?_embed&per_page=${perPage}&page=${page}`
    const res = await fetch(url)
    if (res.status === 400 || res.status === 404) break
    if (!res.ok) throw new Error(`Failed WP fetch: ${res.status} ${await res.text()}`)
    const data = (await res.json()) as WPPost[]
    if (!Array.isArray(data) || data.length === 0) break
    all.push(...data)
    if (data.length < perPage) break
    page += 1
  }
  return all
}

async function fetchCategoriesMap(): Promise<Map<number, string>> {
  const perPage = 100
  let page = 1
  const map = new Map<number, string>()
  while (true) {
    const url = `${WP_BASE}/categories?per_page=${perPage}&page=${page}`
    const res = await fetch(url)
    if (res.status === 400 || res.status === 404) break
    if (!res.ok) throw new Error(`Failed WP categories fetch: ${res.status} ${await res.text()}`)
    const data = (await res.json()) as WPCategory[]
    if (!Array.isArray(data) || data.length === 0) break
    for (const c of data) map.set(c.id, c.name)
    if (data.length < perPage) break
    page += 1
  }
  return map
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

function normalizeAcf(acf?: ACFFields): NormalizedAcf {
  return {
    spotify: acf?.spotify || null,
    appleMusic: acf?.apple_music || null,
    beatport: acf?.beatport || null,
    deezer: acf?.deezer || null,
    soundcloud: acf?.soundcloud || null,
    youtubeMusic: acf?.youtube_music || null,
    junoDownload: acf?.junodownload || null,
    tidal: acf?.tidal || null,
    rawPreview: acf?.preview ?? null,
    gumroad: acf?.gumroad || null,
    bandcamp: acf?.bandcamp || null,
  }
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

async function resolvePreviewUrl(rawPreview: unknown): Promise<string | null> {
  if (!rawPreview) return null
  if (typeof rawPreview === 'string') {
    if (/^https?:\/\//i.test(rawPreview)) return rawPreview
    if (/^\d+$/.test(rawPreview)) {
      const res = await fetch(`${WP_BASE}/media/${rawPreview}`)
      if (!res.ok) return null
      const data = (await res.json()) as WPMediaResponse
      return data?.source_url || null
    }
    return null
  }
  if (typeof rawPreview === 'number') {
    const res = await fetch(`${WP_BASE}/media/${rawPreview}`)
    if (!res.ok) return null
    const data = (await res.json()) as WPMediaResponse
    return data?.source_url || null
  }
  return null
}

function getFeaturedImage(post: WPPost): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  return (
    media?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    null
  )
}

function extractCategories(post: WPPost, map: Map<number, string>): string[] {
  const cats = post.categories
  if (!cats || !Array.isArray(cats)) return []
  return cats.map((c) => map.get(c) || String(c))
}

function extractGumroadFromContent(html: string | null | undefined): string | null {
  if (!html) return null
  const match = html.match(/href=["'](https?:\/\/[^"'>]*gumroad\.com[^"'>]*)["']/i)
  return match?.[1] || null
}

function extractBandcampFromContent(html: string | null | undefined): string | null {
  if (!html) return null
  const match = html.match(/href=["'](https?:\/\/[^"'>]*bandcamp\.com[^"'>]*)["']/i)
  return match?.[1] || null
}

async function run() {
  const [posts, categoryMap] = await Promise.all([fetchAllPosts(), fetchCategoriesMap()])

  let imported = 0
  for (const post of posts) {
    const wpId = post.id
    const slug = post.slug
    const rawTitle = post.title?.rendered ? String(post.title.rendered) : `Untitled ${wpId}`
    const title = decodeHtmlEntities(rawTitle)
    const content = post.content?.rendered ? String(post.content.rendered) : null
    // excerpt removed
    const publishedAt = post.date ? new Date(post.date) : null
    const acf = normalizeAcf(post.acf)
    const gumroadFallback = extractGumroadFromContent(content)
  const bandcampFallback = extractBandcampFromContent(content)
    const categories = extractCategories(post, categoryMap)

    let coverImageUrl: string | null = null
    let coverImageKey: string | null = null

    const featuredUrl = getFeaturedImage(post)
    if (featuredUrl) {
      const downloaded = await downloadBuffer(featuredUrl)
      if (downloaded) {
        const key = `releases/${slug}/${downloaded.fileName}`
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

    let previewUrl: string | null = await resolvePreviewUrl(acf.rawPreview)
    if (previewUrl) {
      const downloadedPreview = await downloadBuffer(previewUrl)
      if (downloadedPreview) {
        const key = `releases/${slug}/preview-${downloadedPreview.fileName}`
        const publicUrl = await uploadToR2(key, downloadedPreview.buffer, downloadedPreview.contentType)
        if (publicUrl) previewUrl = publicUrl
      }
    }

    await prisma.release.upsert({
      where: { slug },
      create: {
        wpId,
        slug,
        title,
        content,
        
        coverImageUrl: coverImageUrl || undefined,
        coverImageKey: coverImageKey || undefined,
        previewUrl: previewUrl || undefined,
        spotify: acf.spotify || undefined,
        appleMusic: acf.appleMusic || undefined,
        beatport: acf.beatport || undefined,
        deezer: acf.deezer || undefined,
        soundcloud: acf.soundcloud || undefined,
        youtubeMusic: acf.youtubeMusic || undefined,
        junoDownload: acf.junoDownload || undefined,
        tidal: acf.tidal || undefined,
        gumroad: (acf.gumroad || gumroadFallback) || undefined,
        bandcamp: (acf.bandcamp || bandcampFallback) || undefined,
        categories,
        publishedAt: publishedAt || undefined,
      },
      update: {
        wpId,
        title,
        content,
        
        coverImageUrl: coverImageUrl || undefined,
        coverImageKey: coverImageKey || undefined,
        previewUrl: previewUrl || undefined,
        spotify: acf.spotify || undefined,
        appleMusic: acf.appleMusic || undefined,
        beatport: acf.beatport || undefined,
        deezer: acf.deezer || undefined,
        soundcloud: acf.soundcloud || undefined,
        youtubeMusic: acf.youtubeMusic || undefined,
        junoDownload: acf.junoDownload || undefined,
        tidal: acf.tidal || undefined,
        gumroad: (acf.gumroad || gumroadFallback) || undefined,
        bandcamp: (acf.bandcamp || bandcampFallback) || undefined,
        categories,
        publishedAt: publishedAt || undefined,
      },
    })

    imported += 1
    if (imported % 25 === 0) console.log(`Imported ${imported}/${posts.length}`)
  }

  console.log(`Import complete. Imported/updated: ${imported}`)
}

run()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
