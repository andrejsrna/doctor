import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const artistName = (searchParams.get('artist') || '').trim()

  try {
    if (!artistName) return NextResponse.json({ items: [] })
    const items = await prisma.release.findMany({
      where: {
        OR: [
          { artistName: { equals: artistName, mode: 'insensitive' } },
          { title: { contains: artistName, mode: 'insensitive' } },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        coverImageUrl: true,
        previewUrl: true,
        publishedAt: true,
      },
    })
    const res = NextResponse.json({ items })
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
    return res
  } catch (error) {
    console.error('Error fetching artist posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artist posts' },
      { status: 500 }
    )
  }
} 