import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const search = (searchParams.get('search') || '').trim()
  const category = searchParams.get('category') || ''

  const where: {
    title?: { contains: string; mode: 'insensitive' }
    categories?: { has: string }
  } = {}
  if (search) where.title = { contains: search, mode: 'insensitive' as const }
  if (category) where.categories = { has: category }

  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    prisma.release.findMany({
      where,
      orderBy: search ? { title: 'asc' } : { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        wpId: true,
        id: true,
        slug: true,
        title: true,
        artistName: true,
        coverImageUrl: true,
        coverImageKey: true,
        previewUrl: true,
        publishedAt: true,
        spotify: true,
        appleMusic: true,
        beatport: true,
        bandcamp: true,
        soundcloud: true,
        categories: true,
        content: true,
      },
    }),
    prisma.release.count({ where }),
  ])

  const r2Host = process.env.R2_PUBLIC_HOSTNAME
  const itemsWithImage = items.map((item) => ({
    ...item,
    imageUrl: item.coverImageUrl || (r2Host && item.coverImageKey ? `https://${r2Host}/${item.coverImageKey}` : null),
  }))

  const res = NextResponse.json({
    items: itemsWithImage,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    total,
  })
  res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
  return res
}


