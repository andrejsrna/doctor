import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { plainTitle, splitTitle, typeLabel } from '@/app/components/hero/releaseMeta'

export const dynamic = 'force-dynamic'

/** exact → starts with → word starts with → contains */
function rank(text: string, q: string) {
  const t = text.toLowerCase()
  if (t === q) return 0
  if (t.startsWith(q)) return 1
  if (new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(t)) return 2
  return 3
}

/**
 * Site search (header overlay + /search). One request, slim fields, grouped by kind.
 * GET /api/search?q=damo&limit=6
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').replace(/\s+/g, ' ').trim().slice(0, 80)
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '6') || 6, 1), 50)
  if (q.length < 2) return NextResponse.json({ q, artists: [], releases: [], news: [] })

  const has = { contains: q, mode: 'insensitive' as const }
  const take = limit * 3 // fetch extra, then rank by relevance
  try {
    const [artists, releases, news] = await Promise.all([
      prisma.artist.findMany({ where: { name: has }, select: { slug: true, name: true, imageUrl: true }, take }),
      prisma.release.findMany({
        where: { OR: [{ title: has }, { artistName: has }] },
        select: { slug: true, title: true, artistName: true, coverImageUrl: true, categories: true, publishedAt: true },
        orderBy: { publishedAt: 'desc' },
        take,
      }),
      prisma.news.findMany({
        where: { OR: [{ title: has }, { content: has }] },
        select: { slug: true, title: true, coverImageUrl: true, categories: true, publishedAt: true },
        orderBy: { publishedAt: 'desc' },
        take,
      }),
    ])
    const lq = q.toLowerCase()
    const byRank = <T,>(items: T[], text: (i: T) => string) =>
      items.map((i, n) => ({ i, r: rank(text(i), lq), n })).sort((a, b) => a.r - b.r || a.n - b.n).slice(0, limit).map((x) => x.i)

    return NextResponse.json(
      {
        q,
        artists: byRank(artists, (a) => a.name).map((a) => ({ slug: a.slug, name: a.name, image: a.imageUrl })),
        releases: byRank(releases, (r) => `${r.artistName ?? ''} ${r.title}`.trim()).map((r) => {
          const raw = plainTitle(r.title)
          const { artist, title } = splitTitle(raw, r.artistName)
          return { slug: r.slug, artist, title, cover: r.coverImageUrl, type: typeLabel(raw, r.categories), date: r.publishedAt }
        }),
        news: byRank(news, (p) => p.title).map((p) => ({
          slug: p.slug,
          title: plainTitle(p.title),
          cover: p.coverImageUrl,
          kind: p.categories.includes('Mixes') ? 'Mix' : 'News',
          date: p.publishedAt,
        })),
      },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
    )
  } catch (error) {
    console.error('search failed', error)
    return NextResponse.json({ message: 'Search is unavailable' }, { status: 500 })
  }
}
