import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/app/lib/auth"

function isSameHost(originA: string, originB: string): boolean {
  try {
    return new URL(originA).host === new URL(originB).host
  } catch {
    return false
  }
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const search = (searchParams.get("search") || '').trim()

  const skip = (page - 1) * limit
  const where: { name?: { contains: string; mode: 'insensitive' } } = {}
  if (search) where.name = { contains: search, mode: 'insensitive' }

  const [items, total] = await Promise.all([
    prisma.artist.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.artist.count({ where }),
  ])

  return NextResponse.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  const origin = request.headers.get('origin')
  const requestOrigin = new URL(request.url).origin
  if (origin && !isSameHost(origin, requestOrigin)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }
  const data = await request.json()
  const created = await prisma.artist.create({
    data: {
      slug: data.slug,
      name: data.name,
      bio: data.bio || null,
      imageUrl: data.imageUrl || null,
      imageKey: data.imageKey || null,
      soundcloud: data.soundcloud || null,
      spotify: data.spotify || null,
      facebook: data.facebook || null,
      instagram: data.instagram || null,
    },
  })
  return NextResponse.json({ item: created })
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  const origin = request.headers.get('origin')
  const requestOrigin = new URL(request.url).origin
  if (origin && !isSameHost(origin, requestOrigin)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }
  const { id, ...data } = await request.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const updated = await prisma.artist.update({
    where: { id },
    data: {
      slug: data.slug ?? undefined,
      name: data.name ?? undefined,
      bio: data.bio ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
      imageKey: data.imageKey ?? undefined,
      soundcloud: data.soundcloud ?? undefined,
      spotify: data.spotify ?? undefined,
      facebook: data.facebook ?? undefined,
      instagram: data.instagram ?? undefined,
    },
  })
  return NextResponse.json({ item: updated })
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  const origin = request.headers.get('origin')
  const requestOrigin = new URL(request.url).origin
  if (origin && !isSameHost(origin, requestOrigin)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  await prisma.artist.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}


