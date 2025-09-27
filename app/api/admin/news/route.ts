import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/app/lib/auth"
import { validateAdminOrigin } from "@/app/lib/adminUtils"

function unauthorized() { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = (searchParams.get('search') || '').trim()
  const skip = (page - 1) * limit
  const where: { OR?: Array<{ title?: { contains: string; mode: 'insensitive' }, content?: { contains: string; mode: 'insensitive' } }> } = {}
  if (search) where.OR = [ { title: { contains: search, mode: 'insensitive' as const } }, { content: { contains: search, mode: 'insensitive' as const } } ]
  const [items, total] = await Promise.all([
    prisma.news.findMany({ where, orderBy: { publishedAt: 'desc' }, skip, take: limit }),
    prisma.news.count({ where }),
  ])
  return NextResponse.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  validateAdminOrigin(request)
  const data = await request.json()
  const created = await prisma.news.create({ data: {
    slug: data.slug, title: data.title, content: data.content || null, coverImageUrl: data.coverImageUrl || null, coverImageKey: data.coverImageKey || null, scsc: data.scsc || null, relatedArtistName: data.relatedArtistName || null, publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
  } })
  return NextResponse.json({ item: created })
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  validateAdminOrigin(request)
  const { id, ...data } = await request.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const updated = await prisma.news.update({ where: { id }, data: {
    slug: data.slug ?? undefined, title: data.title ?? undefined, content: data.content ?? undefined, coverImageUrl: data.coverImageUrl ?? undefined, coverImageKey: data.coverImageKey ?? undefined, scsc: data.scsc ?? undefined, relatedArtistName: data.relatedArtistName ?? undefined, publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
  } })
  return NextResponse.json({ item: updated })
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  validateAdminOrigin(request)
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  await prisma.news.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}


