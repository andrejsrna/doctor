import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'node:crypto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { prisma } from '@/lib/prisma'
import { staffSession } from '@/app/lib/roles'
import { sendReceipt } from '@/lib/shop/orders'
import { issueInvoice, scrmConfigured } from '@/lib/shop/invoices'
import { stripeConfigured } from '@/lib/shop/stripe'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }
const err = (status: number, error: string) => NextResponse.json({ error }, { status, headers: noStore })

function r2() {
  const { R2_ENDPOINT: endpoint, R2_ACCESS_KEY_ID: accessKeyId, R2_SECRET_ACCESS_KEY: secretAccessKey } = process.env
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) return null
  return { bucket, client: new S3Client({ region: 'auto', endpoint, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } }) }
}

export async function GET(request: NextRequest) {
  if (!(await staffSession(request.headers))) return err(401, 'Unauthorized')
  const [products, orders, releases] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' }, include: { release: { select: { title: true, slug: true } }, _count: { select: { orderItems: true } } } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { items: { select: { title: true, downloadCount: true } } } }),
    prisma.release.findMany({ orderBy: { publishedAt: 'desc' }, select: { id: true, title: true, slug: true, categories: true } }),
  ])
  return NextResponse.json({ products, orders, releases, config: { stripe: stripeConfigured(), scrm: scrmConfigured() } }, { headers: noStore })
}

const slugOk = (s: string) => /^[a-z0-9-]{3,80}$/.test(s)

export async function POST(request: NextRequest) {
  if (!(await staffSession(request.headers))) return err(401, 'Unauthorized')
  const body = await request.json().catch(() => null)
  const action = String(body?.action || '')

  if (action === 'presign') {
    // Product files go under a random, never-published key; buyers only get them through /api/shop/download.
    const name = String(body.name || '').trim()
    const size = Number(body.size || 0)
    if (!/\.(zip|rar|7z|wav|aiff?|flac|mp3)$/i.test(name)) return err(415, 'Upload a .zip (or audio) file')
    if (!size || size > 5 * 1024 ** 3) return err(413, 'File too large (max 5 GB)')
    const s3 = r2()
    if (!s3) return err(501, 'Storage not configured')
    const fileName = name.replace(/[^\w.\- ]/g, '-')
    const key = `shop/products/${randomUUID()}/${fileName.replace(/\s+/g, '-')}`
    const uploadUrl = await getSignedUrl(s3.client, new PutObjectCommand({ Bucket: s3.bucket, Key: key, ContentType: 'application/octet-stream' }), { expiresIn: 3600 })
    return NextResponse.json({ uploadUrl, key, fileName, size }, { headers: noStore })
  }

  if (action === 'saveProduct') {
    const title = String(body.title || '').trim().slice(0, 200)
    const slug = String(body.slug || '').trim()
    const price = Math.round(Number(body.price) * 100)
    if (!title || !slugOk(slug)) return err(400, 'Title and a lowercase slug are required')
    if (!Number.isInteger(price) || price < 100 || price > 100000) return err(400, 'Price must be between 1 and 1000 EUR')
    const releaseId = body.releaseId ? String(body.releaseId) : null
    const data = {
      title,
      slug,
      priceCents: price,
      type: body.type === 'TRACK' || body.type === 'RELEASE' ? (body.type as 'TRACK' | 'RELEASE') : ('SAMPLE_PACK' as const),
      active: Boolean(body.active),
      releaseId,
      ...(body.fileKey ? { fileKey: String(body.fileKey), fileName: String(body.fileName || 'download.zip'), fileSize: Number(body.fileSize) || null } : {}),
    }
    if (data.active && !(body.fileKey || (body.id && (await prisma.product.findUnique({ where: { id: String(body.id) } }))?.fileKey))) {
      return err(400, 'Upload the file before activating the product')
    }
    try {
      const product = body.id
        ? await prisma.product.update({ where: { id: String(body.id) }, data })
        : await prisma.product.create({ data })
      // Show/hide the Buy button now instead of after the 5-minute ISR window.
      if (product.releaseId) {
        const rel = await prisma.release.findUnique({ where: { id: product.releaseId }, select: { slug: true } })
        if (rel) revalidatePath(`/music/${rel.slug}`)
      }
      return NextResponse.json({ product }, { headers: noStore })
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') return err(409, 'Slug is already used by another product')
      throw e
    }
  }

  if (action === 'resendEmail' || action === 'issueInvoice') {
    const id = String(body.orderId || '')
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) return err(404, 'Order not found')
    if (action === 'resendEmail') return NextResponse.json({ ok: await sendReceipt(id) }, { headers: noStore })
    if (order.invoiceState === 'FAILED') await prisma.order.update({ where: { id }, data: { invoiceState: 'PENDING', invoiceAttempts: 0 } })
    return NextResponse.json(await issueInvoice(id), { headers: noStore })
  }

  return err(400, 'Unknown action')
}
