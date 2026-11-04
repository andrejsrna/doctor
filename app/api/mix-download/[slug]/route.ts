import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyMixDownload } from '@/lib/mixDownload'

export async function GET(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const q = request.nextUrl.searchParams
  const check = verifyMixDownload(slug, q.get('e'), q.get('x'), q.get('t'))
  const back = new URL(`/news/${encodeURIComponent(slug)}`, request.nextUrl.origin)
  if (check === 'expired') return NextResponse.json({ error: 'This link has expired. Request a new one on the mix page.', page: back.toString() }, { status: 410 })
  if (check !== 'ok') return NextResponse.json({ error: 'Invalid link' }, { status: 403 })
  const post = await prisma.news.findUnique({ where: { slug }, select: { mixDownloadUrl: true } })
  if (!post?.mixDownloadUrl) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const res = NextResponse.redirect(post.mixDownloadUrl, { status: 302 })
  res.headers.set('Cache-Control', 'private, no-store')
  res.headers.set('X-Robots-Tag', 'noindex')
  return res
}
