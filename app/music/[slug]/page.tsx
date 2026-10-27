import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { StreamingLink } from '@/app/types/release'
import ReleaseHero from './components/ReleaseHero'
import { sanitizeHtml } from '@/app/utils/sanitize'
import { getArtworkImageUrl, getReleaseImageUrl } from '@/app/utils/index'
import ReleaseViewTracker from './components/ReleaseViewTracker'
import { withBeatportAffiliate } from '@/lib/affiliates'
import { offersForRelease } from '@/lib/shop/catalog'
import { loadPackManifest } from '@/lib/shop/pack'
import SamplePackView, { packFaq } from './components/pack/SamplePackView'
import { plainTitle, primaryArtist, splitTitle, typeLabel } from '@/app/components/hero/releaseMeta'

export const revalidate = 300

const ReleaseOutro = dynamic(() => import('./components/ReleaseOutro'))

export async function generateStaticParams() {
  // Build-time safety: in some CI/Docker builds the DB is not reachable.
  // Returning [] keeps the build green; pages will be rendered on-demand.
  if (!process.env.DATABASE_URL) return []

  try {
    const items = await prisma.release.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 50,
      select: { slug: true },
    })
    return items.map(i => ({ slug: i.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const release = await prisma.release.findUnique({ where: { slug } })
  
  if (!release) {
    return {
      title: 'Release Not Found',
      description: 'This release could not be found.',
    }
  }

  const imageUrl = getReleaseImageUrl({ coverImageUrl: release.coverImageUrl, coverImageKey: release.coverImageKey })
  const cleanDescription = release.content 
    ? sanitizeHtml(release.content).replace(/<[^>]+>/g, '').slice(0, 200) 
    : `Listen to ${release.title} on DnB Doctor - Neurofunk & Drum and Bass label`
  
  const canonicalUrl = `https://dnbdoctor.com/music/${slug}`
  const artistName = release.artistName || 'DnB Doctor'

  return {
    title: release.title,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'music.album',
      title: release.title,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: 'DnB Doctor',
      images: imageUrl ? [{
        url: imageUrl,
        width: 1200,
        height: 1200,
        alt: release.title,
      }] : [],
      ...(release.publishedAt && { publishedTime: release.publishedAt.toISOString() }),
    },
    twitter: {
      card: 'summary_large_image',
      title: release.title,
      description: cleanDescription,
      images: imageUrl ? [imageUrl] : [],
      creator: '@dnbdoctor',
    },
    other: {
      // Music-specific Open Graph tags
      'music:musician': artistName,
      ...(release.publishedAt && { 'music:release_date': release.publishedAt.toISOString().split('T')[0] }),
      ...(release.spotify && { 'music:song': release.spotify }),
    },
  }
}

export default async function ReleasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const release = await prisma.release.findUnique({ where: { slug } })
  if (!release) return notFound()

  const imageUrl = getReleaseImageUrl({ coverImageUrl: release.coverImageUrl, coverImageKey: release.coverImageKey })
  const artworkUrl = getArtworkImageUrl({ artworkImageUrl: release.artworkImageUrl, artworkImageKey: release.artworkImageKey })
  const streamingLinks: StreamingLink[] = [
    { name: 'Spotify', url: release.spotify || undefined, icon: 'spotify', color: 'text-green-400', bgColor: 'bg-green-500/10 hover:bg-green-500/20', priority: 5 },
    { name: 'Beatport', url: withBeatportAffiliate(release.beatport ?? undefined) || undefined, icon: '/beatport.svg', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20', priority: 3 },
    { name: 'JunoDownload', url: release.junoDownload || undefined, icon: 'download', color: 'text-blue-400', bgColor: 'bg-blue-500/10 hover:bg-blue-500/20', priority: 4, deprecated: true },
    { name: 'Bandcamp', url: release.bandcamp || undefined, icon: 'download', color: 'text-blue-400', bgColor: 'bg-blue-500/10 hover:bg-blue-500/20', priority: 3 },
    { name: 'SoundCloud', url: release.soundcloud || undefined, icon: 'soundcloud', color: 'text-orange-400', bgColor: 'bg-orange-500/10 hover:bg-orange-500/20', priority: 2 },
    { name: 'Tidal', url: release.tidal || undefined, icon: '/tidal.svg', color: 'text-blue-400', bgColor: 'bg-blue-500/10 hover:bg-blue-500/20', priority: 1 },
    { name: 'Deezer', url: release.deezer || undefined, icon: 'deezer', color: 'text-pink-400', bgColor: 'bg-pink-500/10 hover:bg-pink-500/20', priority: 0 },
    { name: 'Apple Music', url: release.appleMusic || undefined, icon: 'apple', color: 'text-pink-400', bgColor: 'bg-pink-500/10 hover:bg-pink-500/20', priority: 0 },
  ]

  const safeTitle = sanitizeHtml(release.title)
  const safeContent = sanitizeHtml(release.content || '')
  const cleanDescription = safeContent.replace(/<[^>]+>/g, '').slice(0, 200)
  const artistName = release.artistName || 'DnB Doctor'

  const published = { publishedAt: { not: null } } as const
  const [calendarMatch, prevRelease, nextRelease, olderCount, total] = await Promise.all([
    prisma.releaseCalendarEntry.findFirst({
      where: { OR: [{ releaseId: release.id }, { title: { equals: release.title, mode: 'insensitive' } }] },
      select: { catalogueNumber: true },
    }),
    release.publishedAt
      ? prisma.release.findFirst({ where: { publishedAt: { lt: release.publishedAt } }, orderBy: { publishedAt: 'desc' }, select: { slug: true, title: true, artistName: true } })
      : null,
    release.publishedAt
      ? prisma.release.findFirst({ where: { publishedAt: { gt: release.publishedAt } }, orderBy: { publishedAt: 'asc' }, select: { slug: true, title: true, artistName: true } })
      : null,
    release.publishedAt ? prisma.release.count({ where: { publishedAt: { lt: release.publishedAt } } }) : null,
    prisma.release.count({ where: published }),
  ])
  const adjacent = (r: { slug: string; title: string; artistName: string | null } | null) =>
    r ? { slug: r.slug, ...splitTitle(plainTitle(r.title), r.artistName) } : null
  const display = splitTitle(plainTitle(release.title), release.artistName)
  // Primary artist only ("A x B" / "A & B" → A) so the by-artist lookup finds their catalogue.
  const moreArtist = (display.artist ?? '').split(/\s+(?:x|&|feat\.?|ft\.?|vs\.?)\s+|,\s*/i)[0].trim()

  // Determine if it's an album/EP or single based on categories
  const isAlbum = release.categories.some(cat => 
    cat.toLowerCase().includes('album') || 
    cat.toLowerCase().includes('ep') || 
    cat.toLowerCase().includes('lp')
  )

  // Build audio objects for streaming links
  const audioObjects = []
  if (release.spotify) {
    audioObjects.push({
      '@type': 'AudioObject',
      name: `${safeTitle} on Spotify`,
      encodingFormat: 'audio/mpeg',
      contentUrl: release.spotify,
      embedUrl: release.spotify,
    })
  }
  if (release.soundcloud) {
    audioObjects.push({
      '@type': 'AudioObject',
      name: `${safeTitle} on SoundCloud`,
      encodingFormat: 'audio/mpeg',
      contentUrl: release.soundcloud,
      embedUrl: release.soundcloud,
    })
  }
  if (release.youtubeMusic) {
    audioObjects.push({
      '@type': 'AudioObject',
      name: `${safeTitle} on YouTube Music`,
      encodingFormat: 'video/mp4',
      contentUrl: release.youtubeMusic,
      embedUrl: release.youtubeMusic,
    })
  }

  // Build the artist object
  // link the real profile of the first credited act (slug guessing produced 404s for collabs)
  const profile = release.artistName
    ? await prisma.artist.findFirst({
        where: { name: { equals: primaryArtist(release.artistName), mode: 'insensitive' } },
        select: { slug: true, name: true, imageUrl: true },
      })
    : null
  const byArtist = {
    '@type': 'MusicGroup',
    name: artistName,
    genre: 'Neurofunk',
    ...(profile && { url: `https://dnbdoctor.com/artists/${profile.slug}` }),
  }

  // Paid sample packs get their own storefront layout instead of the music release hero.
  const { main: offer, tracks: trackOffers } = await offersForRelease(release.id)
  const isPack = !!offer && offer.type === 'SAMPLE_PACK' && release.releaseType !== 'FREE_DOWNLOAD'
  const pack = isPack ? await loadPackManifest(slug) : null
  const packArtist = isPack && release.artistName
    ? { name: profile?.name ?? primaryArtist(release.artistName), slug: profile?.slug ?? null, imageUrl: profile?.imageUrl ?? null }
    : null

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
      { '@type': 'ListItem', position: 2, name: 'Music', item: 'https://dnbdoctor.com/music' },
      { '@type': 'ListItem', position: 3, name: safeTitle, item: `https://dnbdoctor.com/music/${slug}` },
    ],
  }

  // Main JSON-LD structure
  const jsonLd = isAlbum ? {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: safeTitle,
    description: cleanDescription,
    genre: ['Drum and Bass', 'Neurofunk', 'Electronic Music'],
    url: `https://dnbdoctor.com/music/${slug}`,
    image: imageUrl || undefined,
    datePublished: release.publishedAt ? release.publishedAt.toISOString() : undefined,
    albumProductionType: 'StudioAlbum',
    albumReleaseType: release.categories.some(c => c.toLowerCase().includes('ep')) ? 'EPRelease' : 'AlbumRelease',
    byArtist,
    ...(audioObjects.length > 0 && { track: audioObjects }),
    recordLabel: {
      '@type': 'Organization',
      name: 'DnB Doctor',
      url: 'https://dnbdoctor.com',
      logo: 'https://dnbdoctor.com/logo-1.png',
    },
    ...(release.beatport && { 
      offers: {
        '@type': 'Offer',
        url: withBeatportAffiliate(release.beatport),
        availability: 'https://schema.org/InStock',
        price: '0',
        priceCurrency: 'USD',
      }
    }),
  } : {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: safeTitle,
    description: cleanDescription,
    genre: ['Drum and Bass', 'Neurofunk', 'Electronic Music'],
    url: `https://dnbdoctor.com/music/${slug}`,
    image: imageUrl || undefined,
    datePublished: release.publishedAt ? release.publishedAt.toISOString() : undefined,
    byArtist,
    ...(audioObjects.length > 0 && { audio: audioObjects[0] }),
    recordingOf: {
      '@type': 'MusicComposition',
      name: safeTitle,
      composer: byArtist,
    },
    inAlbum: {
      '@type': 'MusicAlbum',
      name: safeTitle,
      byArtist,
    },
    recordLabel: {
      '@type': 'Organization',
      name: 'DnB Doctor',
      url: 'https://dnbdoctor.com',
      logo: 'https://dnbdoctor.com/logo-1.png',
    },
    ...(release.beatport && { 
      offers: {
        '@type': 'Offer',
        url: withBeatportAffiliate(release.beatport),
        availability: 'https://schema.org/InStock',
        price: '0',
        priceCurrency: 'USD',
      }
    }),
  }

  const packJsonLd = isPack && offer ? [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: safeTitle,
      description: cleanDescription,
      image: imageUrl || undefined,
      url: `https://dnbdoctor.com/music/${slug}`,
      category: 'Sample pack',
      brand: { '@type': 'Brand', name: 'DnB Doctor' },
      offers: {
        '@type': 'Offer',
        url: `https://dnbdoctor.com/music/${slug}`,
        price: offer.amount.toFixed(2),
        priceCurrency: offer.currency,
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: packFaq(pack).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ] : null

  return (
    <section className="relative">
      {(artworkUrl || imageUrl) && (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center opacity-35 pointer-events-none"
            style={{ backgroundImage: `url(${artworkUrl || imageUrl})` }}
          />
          <div className="fixed inset-0 z-0 bg-black/35 pointer-events-none" />
          <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65 pointer-events-none" />
        </>
      )}
      <div className="relative z-10">
        <ReleaseViewTracker slug={slug} title={release.title} />
        <noscript>
          <div className="px-4 py-6 text-center text-gray-300">Enable JavaScript to view this page.</div>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(packJsonLd ?? jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {isPack && offer ? (
          <SamplePackView
            slug={slug}
            title={plainTitle(release.title)}
            coverUrl={imageUrl || undefined}
            offer={offer}
            manifest={pack}
            artist={packArtist}
            storyHtml={safeContent || undefined}
          />
        ) : (
        <ReleaseHero
          slug={slug}
          artist={display.artist}
          title={display.title}
          fullTitle={plainTitle(release.title)}
          coverUrl={imageUrl || undefined}
          artworkUrl={artworkUrl || undefined}
          typeLabel={typeLabel(release.title, release.categories)}
          catalogue={calendarMatch?.catalogueNumber ?? null}
          publishedAt={release.publishedAt?.toISOString() ?? null}
          index={olderCount === null ? null : olderCount + 1}
          total={total}
          beatportUrl={withBeatportAffiliate(release.beatport ?? undefined) || undefined}
          youtubeUrl={release.youtubeMusic || undefined}
          soundcloudUrl={release.soundcloud || undefined}
          gumroadUrl={release.gumroad || undefined}
          offer={offer}
          trackOffers={trackOffers}
          releaseType={release.releaseType}
          streamingLinks={streamingLinks}
          storyHtml={safeContent || undefined}
          prev={adjacent(prevRelease)}
          next={adjacent(nextRelease)}
        />
        )}

        <ReleaseOutro
          slug={slug}
          releaseId={release.id}
          moreArtist={moreArtist}
          shareUrl={`https://dnbdoctor.com/music/${slug}`}
          shareTitle={safeTitle}
          relatedBy={release.title}
        />
      </div>
    </section>
  )
}
