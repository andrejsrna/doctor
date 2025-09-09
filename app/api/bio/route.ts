import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '30')

  const skip = (page - 1) * limit

  try {
    // Fetch news and releases in parallel
    const [news, releases, newsTotal, releasesTotal] = await Promise.all([
      prisma.news.findMany({
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          coverImageUrl: true,
          publishedAt: true,
        },
      }),
      prisma.release.findMany({
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          coverImageUrl: true,
          publishedAt: true,
          artistName: true,
        },
      }),
      prisma.news.count(),
      prisma.release.count(),
    ])

    // Combine and sort by date
    const allPosts = [
      ...news.map(item => ({
        ...item,
        type: 'news' as const,
        publishedAt: item.publishedAt?.toISOString() || null,
      })),
      ...releases.map(item => ({
        ...item,
        type: 'release' as const,
        publishedAt: item.publishedAt?.toISOString() || null,
      })),
    ].sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0).getTime()
      const dateB = new Date(b.publishedAt || 0).getTime()
      return dateB - dateA
    })

    const total = newsTotal + releasesTotal
    const totalPages = Math.max(1, Math.ceil(total / limit))

    const res = NextResponse.json({ 
      items: allPosts, 
      totalPages, 
      total,
      hasMore: page < totalPages
    })
    
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
    return res
  } catch (error) {
    console.error('Error fetching bio data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
