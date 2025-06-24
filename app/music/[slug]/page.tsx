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
  FaYoutube,
  FaBiohazard,
  FaSkull,
  FaSyringe
} from 'react-icons/fa'
import SocialShare from '../../components/SocialShare'
import Button from '@/app/components/Button'
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
                <div className="relative group">
                  {/* Corrupted Border Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-700/50 via-purple-900/50 to-green-700/50 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  
                  {/* Main Content Container */}
                  <div className="relative bg-black/30 backdrop-blur-sm rounded-lg p-6 md:p-8 shadow-lg
                    before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(68,175,105,0.1),transparent_50%)] before:rounded-lg
                    after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_80%_20%,rgba(128,0,128,0.1),transparent_50%)] after:rounded-lg">
                    
                    {/* Toxic Drips */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent">
                      <div className="absolute top-0 left-1/4 w-px h-8 bg-gradient-to-b from-green-500/50 to-transparent"></div>
                      <div className="absolute top-0 left-2/4 w-px h-12 bg-gradient-to-b from-green-500/50 to-transparent"></div>
                      <div className="absolute top-0 left-3/4 w-px h-6 bg-gradient-to-b from-green-500/50 to-transparent"></div>
                    </div>
                    
                    <div className="prose prose-invert prose-lg max-w-none
                      prose-p:text-gray-300 prose-p:relative prose-p:z-10
                      first-letter:text-5xl first-letter:font-bold first-letter:text-green-400
                      first-letter:mr-3 first-letter:float-left
                      prose-headings:text-green-400 prose-headings:font-nurgle
                      prose-a:text-purple-400 prose-a:hover:text-green-400
                      prose-strong:text-green-300
                      prose-blockquote:border-green-700 prose-blockquote:bg-green-900/10
                      prose-code:text-green-300"
                      dangerouslySetInnerHTML={{ __html: release.content.rendered }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Unified Streaming Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Header with Biohazard Icon */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20 
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 
                    rounded-full bg-purple-500/20 mb-4 relative group
                    before:absolute before:inset-0 before:rounded-full 
                    before:bg-gradient-to-r before:from-purple-500/20 before:to-pink-500/20 
                    before:animate-spin-slow"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                    blur-xl group-hover:blur-2xl transition-all duration-500" />
                  
                  <FaBiohazard className="w-10 h-10 text-purple-500 relative z-10 
                    group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent 
                    bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500
                    pb-1"
                  >
                    Choose Your Infection Vector
                  </h2>
                  <p className="text-gray-400 flex items-center justify-center gap-2">
                    <FaSyringe className="w-4 h-4 text-purple-500 rotate-45" />
                    <span>Select your preferred method of contamination</span>
                    <FaSyringe className="w-4 h-4 text-purple-500 -rotate-45" />
                  </p>
                </motion.div>
              </div>

              {/* Streaming Links Grid */}
              <div className="grid grid-cols-1 gap-3">
                {availableLinks
                  .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
                  .map((platform, index) => (
                    <motion.div
                      key={platform.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="infected"
                        onClick={(e) => {
                          e.preventDefault();
                          setTimeout(() => {
                            if (typeof window !== 'undefined') {
                              window?.open(platform.url, '_blank', 'noopener,noreferrer');
                            }
                          }, 100);
                        }}
                        className="w-full group relative overflow-hidden"
                      >
                        <div className="flex items-center gap-4 p-4">
                          {/* Platform Icon */}
                          <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 blur-xl 
                              group-hover:bg-purple-500/40 transition-all duration-500" />
                            {typeof platform.icon === 'string' ? (
                              <Image 
                                src={platform.icon}
                                alt={platform.name}
                                width={24}
                                height={24}
                                className="w-8 h-8 relative z-10"
                              />
                            ) : (
                              <platform.icon className="w-8 h-8 relative z-10" />
                            )}
                          </div>
                          
                          {/* Platform Info */}
                          <div className="flex flex-col items-start flex-1">
                            <span className="text-sm opacity-70 group-hover:opacity-90 transition-opacity
                              flex items-center gap-2"
                            >
                              <FaSkull className="w-3 h-3" />
                              <span>Spread through</span>
                            </span>
                            <span className="text-xl font-bold">
                              {platform.name}
                            </span>
                          </div>

                          {/* Arrow indicator */}
                          <FaSyringe className="w-5 h-5 transform rotate-45 
                            group-hover:translate-x-1 group-hover:-translate-y-1 
                            transition-transform duration-300" />
                        </div>
                      </Button>
                    </motion.div>
                  ))}
              </div>
            </motion.div>

            {/* Nurgle-themed Divider */}
            <div className="relative py-16">
              {/* Animated infection line */}
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent">
                {/* Dripping effects */}
                <div className="absolute left-1/4 top-0 w-px h-8 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
                <div className="absolute left-2/4 top-0 w-px h-12 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
                <div className="absolute left-3/4 top-0 w-px h-6 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
              </div>

              {/* Centered infection icon */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                bg-black p-4 rounded-full z-10">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl"></div>
                  <FaBiohazard className="w-8 h-8 text-purple-500 relative z-10" />
                </motion.div>
              </div>
            </div>

            {/* Bulk Sale Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
