import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { plainTitle, primaryArtist, splitTitle } from '@/app/components/hero/releaseMeta'
import MusicCatalog, { type CatalogRelease, type CatalogCategory } from './MusicCatalog'
import { slugify } from './slugify'
import Link from 'next/link'
import SeoAbout, { faqLd, type FaqItem } from '@/app/components/SeoAbout'

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
  if (!process.env.DATABASE_URL)
    return {
      releases: [] as CatalogRelease[],
      categories: [] as CatalogCategory[],
    }
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
        products: { where: { active: true, fileKey: { not: null } }, select: { priceCents: true, currency: true } },
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
        // Lowest WAV price when the release is sold in our shop.
        from: r.products.length
          ? (() => {
              const low = r.products.reduce((m, x) => (x.priceCents < m.priceCents ? x : m))
              return new Intl.NumberFormat('en-IE', { style: 'currency', currency: low.currency.toUpperCase() }).format(low.priceCents / 100)
            })()
          : null,
      }
    })
    const tally = new Map<string, number>()
    for (const r of rows) for (const c of r.categories) tally.set(c, (tally.get(c) ?? 0) + 1)
    const categories = [...tally.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        slug: slugify(name),
        label: LABELS[name] ?? name,
        count,
      }))
    return { releases, categories }
  } catch {
    return {
      releases: [] as CatalogRelease[],
      categories: [] as CatalogCategory[],
    }
  }
}

export const metadata: Metadata = {
  title: {
    absolute: 'Drum and Bass New Releases | Latest DnB & Neurofunk Tracks | DnB Doctor',
  },
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
    images: [
      {
        url: `${SITE}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'DnB Doctor — drum and bass new releases',
      },
    ],
  },
  twitter: { card: 'summary_large_image', images: [`${SITE}/og-image.jpg`] },
}

export default async function MusicPage() {
  const { releases, categories } = await load()
  const artists = new Set(releases.map((r) => (r.artist ? primaryArtist(r.artist).toLowerCase() : '')).filter(Boolean)).size
  const years = releases.map((r) => (r.date ? Number(r.date.slice(0, 4)) : 0)).filter(Boolean)
  const since = years.length ? Math.min(...years) : null

  const now = Date.now()
  const dated = releases.filter((r) => r.date && Date.parse(r.date) <= now)
  const latest = dated[0]
  const last90 = dated.filter((r) => now - Date.parse(r.date!) <= 90 * 864e5).length
  const year = new Date().getUTCFullYear()
  const thisYear = dated.filter((r) => r.date!.startsWith(String(year))).length
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
  const latestText = latest ? `${latest.title}${latest.artist ? ` by ${latest.artist}` : ''} (${fmt(latest.date!)})` : null

  const faq: FaqItem[] = [
    {
      question: 'What is the newest drum and bass release on DnB Doctor?',
      answer: latestText
        ? `The latest release is ${latestText}. The list on this page is always sorted newest first.`
        : 'The list on this page is always sorted newest first.',
    },
    {
      question: 'How often does DnB Doctor release new drum and bass?',
      answer: `Regularly — ${last90} releases in the last 90 days and ${thisYear} so far in ${year}, mostly neurofunk singles and EPs.`,
    },
    {
      question: 'Where can I listen to or buy these tracks?',
      answer:
        'Press play on any release for a preview. Each release page links to Spotify, Beatport and the other stores that carry it, and many releases can also be bought as WAV directly on DnB Doctor.',
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Drum and Bass New Releases',
      url: `${SITE}/music`,
      description: 'The full DnB Doctor catalogue of neurofunk and drum & bass releases.',
      publisher: {
        '@type': 'Organization',
        name: 'DnB Doctor',
        url: SITE,
        logo: `${SITE}/logo-1.png`,
      },
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
            ...(r.artist && {
              byArtist: { '@type': 'MusicGroup', name: r.artist },
            }),
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
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Music',
          item: `${SITE}/music`,
        },
      ],
    },
    faqLd(faq),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MusicCatalog
        releases={releases}
        categories={categories}
        artists={artists}
        since={since}
        about={
          <SeoAbout
            id="about-releases"
            faq={faq}
            title={
              <>
                New DnB <span>releases</span>
              </>
            }
          >
            <p>
              This is the full catalogue of <strong>new drum and bass releases</strong> from DnB Doctor, an independent{' '}
              <Link href="/neurofunk-dnb">neurofunk</Link> label. {latestText && <>The newest drop is {latestText}. </>}
              {last90 > 0 && <>{last90} new releases came out in the last 90 days.</>}
            </p>
            <p>
              Filter by singles, EPs or <Link href="/albums">albums</Link>, search by artist, and open any release for every store and
              streaming link. Meet the producers behind the tracks on the <Link href="/artists">neurofunk artists</Link> page, or hear them
              back to back in <Link href="/neurofunk-dnb-mixes">neurofunk mixes</Link>.
            </p>
            <p>
              New to the sound? Start with <Link href="/what-is-drum-and-bass">what drum and bass is</Link> and the{' '}
              <Link href="/types-of-dnb">types of DnB</Link>.
            </p>
          </SeoAbout>
        }
      />
    </>
  )
}
