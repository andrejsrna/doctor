import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { plainTitle, primaryArtist, splitTitle } from '@/app/components/hero/releaseMeta'
import MusicCatalog, { type CatalogRelease, type CatalogCategory } from './MusicCatalog'
import { slugify } from './slugify'

export const revalidate = 300

const SITE = 'https://dnbdoctor.com'

/** Friendly chip labels for the WordPress-era category names; unknown ones fall through as-is. */
const LABELS: Record<string, string> = {
  'Single Tracks': 'Singles',
  "EP's": 'EPs',
  Albums: 'Albums',
  'Music Packs': 'Music packs',
  'Sample Packs': 'Sample packs',
}

async function load() {
  if (!process.env.DATABASE_URL) return { releases: [] as CatalogRelease[], categories: [] as CatalogCategory[] }
  try {
    const rows = await prisma.release.findMany({
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        artistName: true,
        coverImageUrl: true,
        previewUrl: true,
        publishedAt: true,
        categories: true,
        beatport: true,
        spotify: true,
        releaseType: true,
      },
    })
    const releases: CatalogRelease[] = rows.map((r) => {
      const { artist, title } = splitTitle(plainTitle(r.title), r.artistName ? plainTitle(r.artistName) : null)
      return {
        id: r.id,
        slug: r.slug,
        title,
        artist,
        cover: r.coverImageUrl,
        preview: r.previewUrl,
        date: r.publishedAt ? r.publishedAt.toISOString() : null,
        cats: r.categories.map(slugify),
        beatport: r.beatport,
        spotify: r.spotify,
        free: r.releaseType === 'FREE_DOWNLOAD',
      }
    })
    const tally = new Map<string, number>()
    for (const r of rows) for (const c of r.categories) tally.set(c, (tally.get(c) ?? 0) + 1)
    const categories = [...tally.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ slug: slugify(name), label: LABELS[name] ?? name, count }))
    return { releases, categories }
  } catch {
    return { releases: [] as CatalogRelease[], categories: [] as CatalogCategory[] }
  }
}

export const metadata: Metadata = {
  title: { absolute: 'Drum and Bass New Releases | Latest DnB & Neurofunk Tracks | DnB Doctor' },
  description:
    'Drum and bass new releases from DnB Doctor: browse the full catalogue of neurofunk singles, EPs and albums, play previews and buy on Beatport. Updated with every drop.',
  alternates: { canonical: `${SITE}/music` },
  openGraph: {
    title: 'Drum and Bass New Releases | DnB Doctor',
    description: 'The full DnB Doctor catalogue: neurofunk and drum & bass singles, EPs and albums with previews.',
    url: `${SITE}/music`,
    siteName: 'DnB Doctor',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'DnB Doctor — drum and bass new releases' }],
  },
  twitter: { card: 'summary_large_image', images: [`${SITE}/og-image.jpg`] },
}

export default async function MusicPage() {
  const { releases, categories } = await load()
  const artists = new Set(releases.map((r) => (r.artist ? primaryArtist(r.artist).toLowerCase() : '')).filter(Boolean)).size
  const years = releases.map((r) => (r.date ? Number(r.date.slice(0, 4)) : 0)).filter(Boolean)
  const since = years.length ? Math.min(...years) : null

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Drum and Bass New Releases',
      url: `${SITE}/music`,
      description: 'The full DnB Doctor catalogue of neurofunk and drum & bass releases.',
      publisher: { '@type': 'Organization', name: 'DnB Doctor', url: SITE, logo: `${SITE}/logo-1.png` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: releases.length,
        itemListElement: releases.slice(0, 24).map((r, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'MusicAlbum',
            name: r.title,
            url: `${SITE}/music/${r.slug}`,
            genre: 'Drum and Bass',
            ...(r.artist && { byArtist: { '@type': 'MusicGroup', name: r.artist } }),
            ...(r.cover && { image: r.cover }),
            ...(r.date && { datePublished: r.date.slice(0, 10) }),
            recordLabel: { '@type': 'Organization', name: 'DnB Doctor' },
          },
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'DnB Doctor', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Music', item: `${SITE}/music` },
      ],
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MusicCatalog releases={releases} categories={categories} artists={artists} since={since} />
    </>
  )
}
