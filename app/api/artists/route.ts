import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '24')
  const search = (searchParams.get('search') || '').trim()

  const where: { name?: { contains: string; mode: 'insensitive' } } = {}
  if (search) where.name = { contains: search, mode: 'insensitive' as const }

  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    prisma.artist.findMany({
      where,
      orderBy: search ? { name: 'asc' } : { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        imageUrl: true,
        soundcloud: true,
        spotify: true,
        facebook: true,
        instagram: true,
      },
    }),
    prisma.artist.count({ where }),
  ])

  const res = NextResponse.json({
    items,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  })
  res.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400')
  return res
}


