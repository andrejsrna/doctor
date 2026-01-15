import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const search = (searchParams.get('search') || '').trim()
  const category = (searchParams.get('category') || '').trim()

  const where: {
    OR?: Array<{ title?: { contains: string; mode: 'insensitive' }, content?: { contains: string; mode: 'insensitive' } }>
    categories?: { has: string }
  } = {}
  if (search) where.OR = [
    { title: { contains: search, mode: 'insensitive' as const } },
    { content: { contains: search, mode: 'insensitive' as const } },
  ]
  if (category) where.categories = { has: category }

  const skip = (page - 1) * limit
  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        coverImageUrl: true,
        categories: true,
        publishedAt: true,
      },
    }),
    prisma.news.count({ where }),
  ])

  const res = NextResponse.json({ items, totalPages: Math.max(1, Math.ceil(total / limit)), total })
  res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
  return res
}
