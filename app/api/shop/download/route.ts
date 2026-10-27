import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'node:stream'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/lib/auth'
import { verifyDownloadToken } from '@/lib/shop/tokens'
import { normEmail } from '@/lib/shop/orders'

export const dynamic = 'force-dynamic'

// A shared guest link can't be farmed forever; account downloads are not capped.
const LINK_DOWNLOAD_CAP = 25

const deny = (status: number, error: string) => NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } })

function s3() {
  const { R2_ENDPOINT: endpoint, R2_ACCESS_KEY_ID: accessKeyId, R2_SECRET_ACCESS_KEY: secretAccessKey } = process.env
  if (!endpoint || !accessKeyId || !secretAccessKey) return null
  return new S3Client({ region: 'auto', endpoint, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } })
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('t')
  const itemParam = request.nextUrl.searchParams.get('item')

  let itemId: string | null = null
  let viaLink = false
  let accountEmail: string | null = null
  if (token) {
    itemId = verifyDownloadToken(token)
    viaLink = true
    if (!itemId) return deny(410, 'This download link has expired. Sign in to My account to download again.')
  } else if (itemParam) {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user?.emailVerified) return deny(401, 'Sign in to download')
    itemId = itemParam
    accountEmail = normEmail(session.user.email)
  } else return deny(400, 'Missing download reference')

  const item = await prisma.orderItem.findUnique({
    where: { id: itemId },
    include: { order: { select: { status: true, email: true } }, product: { select: { fileKey: true, fileName: true } } },
  })
  if (!item || item.order.status !== 'PAID') return deny(404, 'Download not found')
  if (accountEmail && normEmail(item.order.email) !== accountEmail) return deny(404, 'Download not found')
  if (viaLink && item.downloadCount >= LINK_DOWNLOAD_CAP) return deny(429, 'Download limit reached for this link. Sign in to My account to download again.')
  if (!item.product.fileKey) return deny(500, 'File not available')

  const client = s3()
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
  if (!client || !bucket) return deny(500, 'Storage not configured')
  const obj = await client.send(new GetObjectCommand({ Bucket: bucket, Key: item.product.fileKey }))
  if (!obj.Body) return deny(500, 'File not available')

  await prisma.orderItem.update({ where: { id: item.id }, data: { downloadCount: { increment: 1 } } })

  const name = (item.product.fileName || 'download.zip').replace(/[^\w.\- ]/g, '')
  const headers = new Headers({
    'Cache-Control': 'private, no-store',
    'Content-Type': obj.ContentType || 'application/zip',
    'Content-Disposition': `attachment; filename="${name}"`,
  })
  if (obj.ContentLength) headers.set('Content-Length', String(obj.ContentLength))
  return new NextResponse(Readable.toWeb(obj.Body as Readable) as ReadableStream, { status: 200, headers })
}
