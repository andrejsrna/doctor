// server component
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { withBeatportAffiliate } from '@/lib/affiliates'
import HeroStage, { type HeroIncoming, type HeroRelease } from './hero/HeroStage'

/** "Artist - Title" → { artist, title } when the release has no explicit artist. */
function splitTitle(raw: string, artistName: string | null) {
  if (artistName) return { artist: artistName, title: raw }
  const idx = raw.indexOf(' - ')
  if (idx > 0) return { artist: raw.slice(0, idx).trim(), title: raw.slice(idx + 3).trim() }
  return { artist: null, title: raw }
}

function typeLabel(title: string, categories: string[]) {
  const hay = `${title} ${categories.join(' ')}`
  if (/\bEP\b/i.test(hay)) return 'EP'
  if (/\b(LP|album)\b/i.test(hay)) return 'Album'
  return 'Single'
}

export default async function Hero() {
  const release = await prisma.release.findFirst({
    orderBy: { publishedAt: 'desc' },
    where: { publishedAt: { not: null } },
    select: {
      id: true,
      slug: true,
      title: true,
      artistName: true,
      coverImageUrl: true,
      artworkImageUrl: true,
      previewUrl: true,
      spotify: true,
      beatport: true,
      publishedAt: true,
      categories: true,
    },
  })

  if (!release) {
    return (
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white">DnB Doctor</h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Neurofunk and drum &amp; bass label.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/music" className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium">
              Browse music
            </Link>
            <Link href="/submit-demo" className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium">
              Submit a demo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const startOfToday = new Date()
  startOfToday.setUTCHours(0, 0, 0, 0)

  const [calendarMatch, upcoming] = await Promise.all([
    prisma.releaseCalendarEntry.findFirst({
      where: { OR: [{ releaseId: release.id }, { title: { equals: release.title, mode: 'insensitive' } }] },
      select: { catalogueNumber: true },
    }),
    prisma.releaseCalendarEntry.findMany({
      where: { releaseDate: { gte: startOfToday }, releaseId: null },
      orderBy: { releaseDate: 'asc' },
      take: 3,
      select: { id: true, title: true, catalogueNumber: true, releaseDate: true },
    }),
  ])

  const { artist, title } = splitTitle(release.title, release.artistName)

  const heroRelease: HeroRelease = {
    slug: release.slug,
    artist,
    title,
    fullTitle: release.title,
    coverUrl: release.coverImageUrl,
    artUrl: release.artworkImageUrl,
    publishedAt: release.publishedAt?.toISOString() ?? null,
    typeLabel: typeLabel(release.title, release.categories),
    catalogue: calendarMatch?.catalogueNumber ?? null,
    spotify: release.spotify,
    beatport: withBeatportAffiliate(release.beatport ?? undefined) || null,
    previewUrl: release.previewUrl,
  }

  const incoming: HeroIncoming[] = upcoming
    // Skip anything already published under the same title.
    .filter((e) => e.title.toLowerCase() !== release.title.toLowerCase())
    .map((e) => {
      const parts = splitTitle(e.title, null)
      return {
        id: e.id,
        artist: parts.artist,
        title: parts.title,
        catalogue: e.catalogueNumber,
        releaseDate: e.releaseDate.toISOString(),
      }
    })

  return <HeroStage release={heroRelease} incoming={incoming} />
}
