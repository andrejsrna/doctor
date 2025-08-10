import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const prisma = new PrismaClient()

const R2_ENDPOINT = process.env.R2_ENDPOINT
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '')

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
  const fileName = url.split('?')[0].split('/').pop() || `file-${Date.now()}`
  return { buffer, contentType, fileName }
}

async function uploadToR2(key: string, body: Buffer, contentType?: string): Promise<string | null> {
  const s3 = getS3()
  if (!s3 || !R2_BUCKET) return null
  await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: contentType }))
  if (R2_PUBLIC_BASE_URL) return `${R2_PUBLIC_BASE_URL}/${key}`
  return null
}

function findImageUrls(html?: string | null): string[] {
  if (!html) return []
  const urls: string[] = []
  const re = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) urls.push(m[1])
  return Array.from(new Set(urls))
}

function isAdminUrl(url?: string | null): boolean {
  if (!url) return false
  try {
    const u = new URL(url)
    if (R2_PUBLIC_BASE_URL && url.startsWith(R2_PUBLIC_BASE_URL)) return false
    return /(^|\.)admin\.dnbdoctor\.com$/i.test(u.hostname)
  } catch { return false }
}

function parseArg(name: string): string | undefined {
  const idx = process.argv.findIndex(a => a === name || a.startsWith(`${name}=`))
  if (idx === -1) return undefined
  const val = process.argv[idx].split('=')[1]
  return val || process.argv[idx + 1]
}

async function run() {
  const dryRun = process.argv.includes('--dry-run')
  const limitStr = parseArg('--limit')
  const limit = limitStr ? parseInt(limitStr, 10) : undefined

  const where: any = {
    OR: [
      { content: { contains: 'admin.dnbdoctor.com' } },
      { coverImageUrl: { contains: 'admin.dnbdoctor.com' } },
    ],
  }

  const items = await prisma.news.findMany({ where, select: { id: true, slug: true, content: true, coverImageUrl: true, coverImageKey: true } , take: limit })

  let updated = 0
  for (const n of items) {
    let newCoverUrl = n.coverImageUrl || null
    let newCoverKey = n.coverImageKey || null
    if (isAdminUrl(n.coverImageUrl)) {
      const dl = await downloadBuffer(n.coverImageUrl!)
      if (dl) {
        const key = `news/${n.slug}/${dl.fileName}`
        const url = await uploadToR2(key, dl.buffer, dl.contentType)
        if (url) { newCoverUrl = url; newCoverKey = key }
      }
    }

    const urls = findImageUrls(n.content).filter(isAdminUrl)
    const replacements: Record<string, string> = {}
    for (const u of urls) {
      const dl = await downloadBuffer(u)
      if (!dl) continue
      const key = `news/${n.slug}/content/${dl.fileName}`
      const url = await uploadToR2(key, dl.buffer, dl.contentType)
      if (url) replacements[u] = url
    }

    let newContent = n.content || null
    if (newContent && Object.keys(replacements).length > 0) {
      for (const [oldUrl, newUrl] of Object.entries(replacements)) {
        const esc = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        newContent = newContent.replace(new RegExp(esc, 'g'), newUrl)
      }
    }

    const needsUpdate = newCoverUrl !== n.coverImageUrl || newCoverKey !== n.coverImageKey || newContent !== n.content
    if (needsUpdate) {
      if (!dryRun) {
        await prisma.news.update({ where: { id: n.id }, data: { coverImageUrl: newCoverUrl || undefined, coverImageKey: newCoverKey || undefined, content: newContent || undefined } })
      }
      updated += 1
      console.log(`Updated ${n.slug}`)
    }
  }

  console.log(`Processed ${items.length}. Updated ${updated}.`)
}

run().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })


