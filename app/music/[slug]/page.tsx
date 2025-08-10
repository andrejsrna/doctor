import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: safeTitle,
    description: safeContent.replace(/<[^>]+>/g, '').slice(0, 200),
    genre: 'Drum and Bass',
    url: `https://dnbdoctor.com/music/${slug}`,
    image: imageUrl || undefined,
    datePublished: release.publishedAt ? release.publishedAt.toISOString() : undefined,
    byArtist: { '@type': 'MusicGroup', name: 'DnB Doctor' },
  }

  return (
    <section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReleaseHero
        title={safeTitle}
        imageUrl={imageUrl}
        beatportUrl={release.beatport || undefined}
        youtubeUrl={release.youtubeMusic || undefined}
        description={safeContent}
        gumroadUrl={release.gumroad || undefined}
      />

      <div className="relative z-10 bg-black/80 backdrop-blur-sm -mt-24">
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
          {!release.gumroad && (
            <StreamingLinks links={streamingLinks} gumroadUrl={release.gumroad || undefined} />
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
