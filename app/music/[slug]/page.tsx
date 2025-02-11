'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  FaSpotify, FaBandcamp, FaAmazon, FaYoutube, FaSoundcloud,
  FaApple
} from 'react-icons/fa'
import { FaDeezer} from 'react-icons/fa'
import SocialShare from '../../components/SocialShare'
import MoreFromArtist from '@/app/components/MoreFromArtist'
import SubscribeCTA from '@/app/components/SubscribeCTA'
import AudioPreview from '@/app/components/AudioPreview'
import BulkSalePromo from '@/app/components/BulkSalePromo'
import { useSingleRelease, useReleasePreview } from '@/app/hooks/useWordPress'
import Comments from '@/app/components/Comments'
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
      bgColor: 'bg-red-500/10 hover:bg-red-500/20'
    },
    { 
      name: 'Bandcamp', 
      url: release?.acf?.bandcamp, 
      icon: FaBandcamp, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
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
  ]

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
              className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent 
                bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mb-8
                drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
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
                className="prose prose-invert prose-purple max-w-none"
                dangerouslySetInnerHTML={{ __html: release.content.rendered }}
              />
            )}

            {/* Streaming Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Popular Services */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent 
                  bg-gradient-to-r from-purple-500 to-pink-500">
                  Listen Now
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {streamingLinks
                    .filter(platform => platform.url && platform.priority === 3)
                    .map((platform) => (
                      <motion.a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          //trackStreamingClick(platform.name);
                          setTimeout(() => {
                            if (typeof window !== 'undefined') {
                              window?.open(platform.url, '_blank', 'noopener,noreferrer');
                            }
                          }, 100);
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-4 p-4 rounded-xl
                          ${platform.bgColor} backdrop-blur-sm
                          transition-all duration-300 group relative overflow-hidden`}
                      >
                        <div className={`p-3 rounded-lg ${platform.bgColor}`}>
                          {typeof platform.icon === 'string' ? (
                            <Image 
                              src={platform.icon}
                              alt={platform.name}
                              width={24}
                              height={24}
                              className="w-6 h-6"
                            />
                          ) : (
                            <platform.icon className={`w-6 h-6 ${platform.color}`} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-400">Listen on</span>
                          <span className={`text-lg font-medium ${platform.color}`}>
                            {platform.name}
                          </span>
                        </div>
                        <motion.div
                          className="absolute right-4"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <svg className={`w-6 h-6 ${platform.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      </motion.a>
                    ))}
                </div>
              </div>

              {/* Other Services */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center text-purple-500">
                  More Platforms
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {streamingLinks
                    .filter(platform => platform.url && platform.priority !== 3)
                    .map((platform) => (
                      <motion.a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          //trackStreamingClick(platform.name);
                          setTimeout(() => {
                            if (typeof window !== 'undefined') {
                              window?.open(platform.url, '_blank', 'noopener,noreferrer');
                            }
                          }, 100);
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl
                          ${platform.bgColor} backdrop-blur-sm
                          transition-all duration-300 group`}
                      >
                        {typeof platform.icon === 'string' ? (
                          <Image 
                            src={platform.icon}
                            alt={platform.name}
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                        ) : (
                          <platform.icon className={`w-5 h-5 ${platform.color}`} />
                        )}
                        <span className={`text-sm font-medium ${platform.color}`}>
                          {platform.name}
                        </span>
                      </motion.a>
                    ))}
                </div>
              </div>

              {/* Bulk Sale Promo */}
              <BulkSalePromo />
            </motion.div>

            {/* Reactions */}
            <Comments 
              slug={slug}
              title={release.title.rendered}
            />

            {/* Social Share */}
            <SocialShare 
              url={`https://dnbdoctor.com/music/${slug}`}
              title={release.title.rendered}
            />

            {/* More From Artist */}
            <MoreFromArtist 
              artistName={release.title.rendered.split(' ')[0]}
              currentPostId={release.id}
            />

            {/* Subscribe CTA */}
            <SubscribeCTA />
          </div>
        </div>
      </div>
    </section>
  )
} 