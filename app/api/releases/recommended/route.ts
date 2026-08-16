import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const revalidate = 60

// Recommendation algorithm:
//  1. Exact artist match (strongest)
//  2. Shared categories (count of overlapping categories)
//  3. Recency (publishedAt desc) as tiebreaker
// Score = artistBonus*1000 + sharedCategories*100 + recencyFactor
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '8')))

  const current = slug
    ? await prisma.release.findUnique({
        where: { slug },
        select: { id: true, artistName: true, categories: true },
      })
    : null

  if (!current) {
    return NextResponse.json({ items: [], total: 0, page, limit })
  }

  // Fetch candidate releases (excluding current), recent first
  const all = await prisma.release.findMany({
    where: { id: { not: current.id } },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      artistName: true,
      coverImageUrl: true,
      coverImageKey: true,
      previewUrl: true,
      publishedAt: true,
      categories: true,
    },
  })

  const currentArtist = (current.artistName || '').trim().toLowerCase()
  const currentCats = current.categories || []

  const scored = all.map((r) => {
    const artist = (r.artistName || '').trim().toLowerCase()
    const sharedCats = (r.categories || []).filter((c) =>
      currentCats.includes(c)
    ).length
    // artist bonus only when both are set and equal
    const artistBonus = currentArtist && artist && currentArtist === artist ? 1 : 0
    // recency: newer releases rank slightly higher on ties
    const recency = r.publishedAt ? new Date(r.publishedAt).getTime() / 1e9 : 0
    const score = artistBonus * 1000 + sharedCats * 100 + recency
    return { r, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const ordered = scored.map((s) => s.r)

  const total = ordered.length
  const start = (page - 1) * limit
  const items = ordered.slice(start, start + limit)

  const r2Host = process.env.R2_PUBLIC_HOSTNAME
  const itemsWithImage = items.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    artistName: item.artistName,
    previewUrl: item.previewUrl,
    publishedAt: item.publishedAt,
    imageUrl: item.coverImageUrl || (r2Host && item.coverImageKey ? `https://${r2Host}/${item.coverImageKey}` : null),
  }))

  const res = NextResponse.json({
    items: itemsWithImage,
    total,
    page,
    limit,
    hasMore: start + items.length < total,
  })
  res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600')
  return res
}
