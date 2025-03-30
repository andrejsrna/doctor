'use client'

import AudioPreview from '@/app/components/AudioPreview'
import BulkSalePromo from '@/app/components/BulkSalePromo'
import MoreFromArtist from '@/app/components/MoreFromArtist'
import RelatedNews from '@/app/components/RelatedNews'
import SubscribeCTA from '@/app/components/SubscribeCTA'
import { useReleasePreview, useSingleRelease } from '@/app/hooks/useWordPress'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { use, useEffect, useState } from 'react'
import {
  FaAmazon,
  FaApple,
  FaBandcamp,
  FaDeezer, FaDownload,
  FaSoundcloud,
  FaSpotify,
  FaYoutube
} from 'react-icons/fa'
import SocialShare from '../../components/SocialShare'
//import { initializeAnalytics, trackStreamingClick } from '@/app/utils/analytics'


interface PageProps {
  params: Promise<{ slug: string }>
}

interface StreamingLink {
  name: string
  url: string | undefined
  icon: React.ComponentType<{ className?: string }> | string
  color: string
  bgColor: string
  priority?: number
}


export default function ReleasePage({ params }: PageProps) {
  const { slug } = use(params)
  const { data: release, isLoading } = useSingleRelease(slug)
  const { data: previewUrl } = useReleasePreview(release?.acf?.preview || null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
   // initializeAnalytics();
  }, [])

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

  // Filter out links without a URL first
  const availableLinks = streamingLinks.filter(link => link.url);

  return (
    <section className="relative min-h-screen">
      {/* Hero Background */}
      <div className="fixed inset-0 z-0">
        {getImageUrl() && (
          <Image
            src={getImageUrl()!}
            alt={release.title.rendered}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.01,
                skewX: 0.5,
                skewY: -0.5
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent
                bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mb-8
                drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] cursor-pointer"
              dangerouslySetInnerHTML={{ __html: release.title.rendered }}
            />

            {/* Audio Preview */}
            {release.acf?.preview && previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AudioPreview
                  url={previewUrl}
                  isPlaying={isPlaying}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-black/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
            {/* Description */}
            {release.content.rendered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 md:p-8 shadow-lg">
                  <div
                    className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300
                               first-letter:text-4xl first-letter:font-bold first-letter:text-purple-400
                               first-letter:mr-3 first-letter:float-left"
                    dangerouslySetInnerHTML={{ __html: release.content.rendered }}
                  />
                </div>
              </motion.div>
            )}

            {/* Unified Streaming Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent
                bg-gradient-to-r from-purple-400 to-pink-500">
                Listen & Download
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableLinks
                  .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
                  .map((platform) => (
                    <motion.a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        setTimeout(() => {
                          if (typeof window !== 'undefined') {
                            window?.open(platform.url, '_blank', 'noopener,noreferrer');
                          }
                        }, 100);
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex flex-col items-center justify-center gap-3 p-4 rounded-lg
                        ${platform.bgColor} backdrop-blur-sm border border-white/10
                        hover:border-white/20 hover:shadow-lg
                        transition-all duration-300 group text-center h-32`}
                    >
                      <div className="flex-shrink-0">
                        {typeof platform.icon === 'string' ? (
                          <Image
                            src={platform.icon}
                            alt={platform.name}
                            width={28}
                            height={28}
                            className="w-7 h-7"
                          />
                        ) : (
                          <platform.icon className={`w-7 h-7 ${platform.color}`} />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${platform.color} mt-1`}>
                        {platform.name}
                      </span>
                    </motion.a>
                  ))}
              </div>
            </motion.div>

            {/* Bulk Sale Promo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-12"
            >
              <BulkSalePromo />
            </motion.div>

            {/* Social Share */}
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

            {/* More From Artist */}
            <MoreFromArtist
              artistName={release.title.rendered.split(' ')[0]}
              currentPostId={release.id}
            />

            <RelatedNews
            currentPostId={release.id}
            relatedBy={release.title.rendered}
            />


            {/* Subscribe CTA */}
            <SubscribeCTA />
          </div>
        </div>
      </div>
    </section>
  )
}
