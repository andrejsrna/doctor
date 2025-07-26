'use client'

import { use, useState } from 'react'
import {
  FaAmazon,
  FaApple,
  FaBandcamp,
  FaDeezer,
  FaDownload,
  FaSoundcloud,
  FaSpotify,
  FaYoutube,
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useReleasePreview, useSingleRelease } from '@/app/hooks/useWordPress'
import { StreamingLink } from '@/app/types/release'
import SocialShare from '@/app/components/SocialShare'
import BulkSalePromo from '@/app/components/BulkSalePromo'
import MoreFromArtist from '@/app/components/MoreFromArtist'
import RelatedNews from '@/app/components/RelatedNews'
import SubscribeCTA from '@/app/components/SubscribeCTA'
import ReleaseHero from './components/ReleaseHero'
import ReleaseDescription from './components/ReleaseDescription'
import StreamingLinks from './components/StreamingLinks'
import InfectionDivider from './components/InfectionDivider'


interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ReleasePage({ params }: PageProps) {
  const { slug } = use(params)
  const { data: release, isLoading } = useSingleRelease(slug)
  const { data: previewUrl } = useReleasePreview(release?.acf?.preview || null)
  const [isPlaying, setIsPlaying] = useState(false)

  if (isLoading) {
    return <div className="animate-pulse text-purple-500">Loading...</div>
  }

  if (!release) {
    return <div className="text-red-500">Release not found</div>
  }

  const getImageUrl = () => {
    const media = release?._embedded?.['wp:featuredmedia']?.[0]
    return media?.source_url || media?.media_details?.sizes?.full?.source_url
  }

  const streamingLinks: StreamingLink[] = [
    {
      name: 'Spotify',
      url: release?.acf?.spotify,
      icon: FaSpotify,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20',
      priority: 3
    },
    {
      name: 'Beatport',
      url: release?.acf?.beatport,
      icon: '/beatport.svg',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20',
      priority: 3
    },
    {
      name: 'Apple Music',
      url: release?.acf?.apple_music,
      icon: FaApple,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
      priority: 2
    },
    {
      name: 'Deezer',
      url: release?.acf?.deezer,
      icon: FaDeezer,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20'
    },
    {
      name: 'SoundCloud',
      url: release?.acf?.soundcloud,
      icon: FaSoundcloud,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 hover:bg-orange-500/20'
    },
    {
      name: 'YouTube Music',
      url: release?.acf?.youtube_music,
      icon: FaYoutube,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 hover:bg-red-500/20',
      priority: 3
    },
    {
      name: 'JunoDownload',
      url: release?.acf?.junodownload,
      icon: FaDownload,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
      priority: 1
    },
    {
      name: 'Tidal',
      url: release?.acf?.tidal,
      icon: '/tidal.svg',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
    },
    {
      name: 'Amazon Music',
      url: release?.acf?.amazon,
      icon: FaAmazon,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10 hover:bg-yellow-500/20'
    },
    {
      name: 'Bandcamp',
      url: release?.acf?.bandcamp,
      icon: FaBandcamp,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
      priority: 3
    },
    {
      name: 'iTunes',
      url: release?.acf?.itunes,
      icon: FaApple,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
    }
  ]

  return (
    <section>
      <ReleaseHero
        title={release.title.rendered}
        imageUrl={getImageUrl()}
        previewUrl={previewUrl}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
      />

      <div className="relative z-10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
          {release.content.rendered && (
            <ReleaseDescription content={release.content.rendered} />
          )}

          <StreamingLinks
            links={streamingLinks}
            gumroadUrl={release.acf?.gumroad}
          />
          
          <InfectionDivider />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BulkSalePromo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SocialShare
              url={`https://dnbdoctor.com/music/${slug}`}
              title={release.title.rendered}
            />
          </motion.div>

          <MoreFromArtist
            artistName={release.title.rendered.split(' ')[0]}
            currentPostId={release.id}
          />

          <RelatedNews
            currentPostId={release.id}
            relatedBy={release.title.rendered}
          />

          <SubscribeCTA />
        </div>
      </div>
    </section>
  )
}
