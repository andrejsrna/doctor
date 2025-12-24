import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { StreamingLink } from '@/app/types/release'
import ReleaseHero from './components/ReleaseHero'
import StreamingLinks from './components/StreamingLinks'
import InfectionDivider from './components/InfectionDivider'
import EngagementCTA from '@/app/components/EngagementCTA'
import { sanitizeHtml } from '@/app/utils/sanitize'
import { getReleaseImageUrl } from '@/app/utils/index'

export const revalidate = 300

const SocialShare = dynamic(() => import('@/app/components/SocialShare'))
const BulkSalePromo = dynamic(() => import('@/app/components/BulkSalePromo'))
const MoreFromArtist = dynamic(() => import('@/app/components/MoreFromArtist'))
const RelatedNews = dynamic(() => import('@/app/components/RelatedNews'))

export async function generateStaticParams() {
  const items = await prisma.release.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 50,
    select: { slug: true },
  })
  return items.map(i => ({ slug: i.slug }))
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

  const streamingLinks: StreamingLink[] = [
    { name: 'Spotify', url: release.spotify || undefined, icon: 'spotify', color: 'text-green-400', bgColor: 'bg-green-500/10 hover:bg-green-500/20', priority: 3 },
    { name: 'Beatport', url: release.beatport || undefined, icon: '/beatport.svg', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20', priority: 3 },
    { name: 'Apple Music', url: release.appleMusic || undefined, icon: 'apple', color: 'text-pink-400', bgColor: 'bg-pink-500/10 hover:bg-pink-500/20', priority: 2 },
    { name: 'Deezer', url: release.deezer || undefined, icon: 'deezer', color: 'text-pink-400', bgColor: 'bg-pink-500/10 hover:bg-pink-500/20' },
    { name: 'SoundCloud', url: release.soundcloud || undefined, icon: 'soundcloud', color: 'text-orange-400', bgColor: 'bg-orange-500/10 hover:bg-orange-500/20', priority: 3 },
    { name: 'JunoDownload', url: release.junoDownload || undefined, icon: 'download', color: 'text-blue-400', bgColor: 'bg-blue-500/10 hover:bg-blue-500/20', priority: 1 },
    { name: 'Tidal', url: release.tidal || undefined, icon: '/tidal.svg', color: 'text-blue-400', bgColor: 'bg-blue-500/10 hover:bg-blue-500/20' },
    { name: 'Bandcamp', url: release.bandcamp || undefined, icon: 'download', color: 'text-blue-400', bgColor: 'bg-blue-500/10 hover:bg-blue-500/20' },
  ]

  const safeTitle = sanitizeHtml(release.title)
  const safeContent = sanitizeHtml(release.content || '')
  const cleanDescription = safeContent.replace(/<[^>]+>/g, '').slice(0, 200)
  const artistName = release.artistName || 'DnB Doctor'

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
  const byArtist = {
    '@type': 'MusicGroup',
    name: artistName,
    genre: 'Neurofunk',
    url: `https://dnbdoctor.com/artists/${artistName.toLowerCase().replace(/\s+/g, '-')}`,
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
      logo: 'https://dnbdoctor.com/logo.png',
    },
    ...(release.beatport && { 
      offers: {
        '@type': 'Offer',
        url: release.beatport,
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
      logo: 'https://dnbdoctor.com/logo.png',
    },
    ...(release.beatport && { 
      offers: {
        '@type': 'Offer',
        url: release.beatport,
        availability: 'https://schema.org/InStock',
        price: '0',
        priceCurrency: 'USD',
      }
    }),
  }

  return (
    <section>
      <noscript>
        <div className="px-4 py-6 text-center text-gray-300">Enable JavaScript to view this page.</div>
      </noscript>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReleaseHero
        title={safeTitle}
        imageUrl={imageUrl}
        beatportUrl={release.beatport || undefined}
        youtubeUrl={release.youtubeMusic || undefined}
        description={safeContent}
        gumroadUrl={release.gumroad || undefined}
        slug={slug}
        releaseType={release.releaseType}
      />

      <div className="relative z-10 bg-black/80 backdrop-blur-sm -mt-24">
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
          {release.releaseType !== "FREE_DOWNLOAD" && !release.gumroad && (
            <StreamingLinks links={streamingLinks} gumroadUrl={release.gumroad || undefined} slug={slug} />
          )}

          <InfectionDivider />

          <EngagementCTA />

          <BulkSalePromo />

          <SocialShare url={`https://dnbdoctor.com/music/${slug}`} title={safeTitle} />

          <MoreFromArtist artistName={release.title.split(' ')[0]} currentPostId={release.id} />

          <RelatedNews currentPostId={0} relatedBy={release.title} />
        </div>
      </div>
    </section>
  )
}
