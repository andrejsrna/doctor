'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaSpotify, FaApple, FaSoundcloud, FaBandcamp, FaYoutube, FaDeezer } from 'react-icons/fa'
import AudioPreview from './AudioPreview'

interface StreamingLink {
  name: string
  url: string | undefined
  icon: React.ComponentType<{ className?: string }> | string
  color: string
  bgColor: string
  priority?: number
}   

interface FeaturedPost {
  id: number
  title: {
    rendered: string
  }
  slug: string
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string
      media_details?: {
        sizes?: {
          full?: {
            source_url?: string
          }
        }
      }
    }>
  }
  acf?: {
    preview?: string
    spotify?: string
    beatport?: string
    soundcloud?: string
    apple_music?: string
    deezer?: string
    youtube_music?: string
    bandcamp?: string
    tidal?: string
  }
}


export default function FeaturedTrack() {
  const [post, setPost] = useState<FeaturedPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    fetchRandomPost()
  }, [])

  const fetchRandomPost = async () => {
    try {
      // First, get total number of posts
      const countResponse = await fetch('https://admin.dnbdoctor.com/wp-json/wp/v2/posts?per_page=1')
      const totalPosts = parseInt(countResponse.headers.get('X-WP-Total') || '0')
      
      if (totalPosts === 0) return

      // Get a random offset
      const randomOffset = Math.floor(Math.random() * totalPosts)
      
      // Fetch one random post
      const response = await fetch(
        `https://admin.dnbdoctor.com/wp-json/wp/v2/posts?_embed&per_page=1&offset=${randomOffset}`
      )
      const [data] = await response.json()
      
      if (data.acf?.preview) {
        try {
          const attachmentResponse = await fetch(
            `https://admin.dnbdoctor.com/wp-json/wp/v2/media/${data.acf.preview}`
          )
          if (attachmentResponse.ok) {
            const attachment = await attachmentResponse.json()
            setPreviewUrl(attachment.source_url)
          }
        } catch (error) {
          console.error('Error fetching preview:', error)
        }
      }

     

      setPost(data)
    } catch (error) {
      console.error('Error fetching featured post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getImageUrl = (post: FeaturedPost) => {
    const media = post._embedded?.['wp:featuredmedia']?.[0]
    return media?.source_url || media?.media_details?.sizes?.full?.source_url
  }

  if (isLoading) {
    return (
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse text-purple-500 text-center">Loading featured track...</div>
        </div>
      </section>
    )
  }

  const streamingLinks: StreamingLink[] = [
    { 
      name: 'Spotify', 
      url: post?.acf?.spotify, 
      icon: FaSpotify, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20',
      priority: 3
    },
    { 
      name: 'Beatport', 
      url: post?.acf?.beatport, 
      icon: '/beatport.svg', 
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20',
      priority: 3
    },
    { 
      name: 'Apple Music', 
      url: post?.acf?.apple_music, 
      icon: FaApple, 
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
      priority: 2
    },
    { 
      name: 'Deezer', 
      url: post?.acf?.deezer, 
      icon: FaDeezer, 
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20'
    },
    { 
      name: 'SoundCloud', 
      url: post?.acf?.soundcloud, 
      icon: FaSoundcloud, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 hover:bg-orange-500/20'
    },
    { 
      name: 'YouTube Music', 
      url: post?.acf?.youtube_music, 
      icon: FaYoutube, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 hover:bg-red-500/20'
    },
    { 
      name: 'Bandcamp', 
      url: post?.acf?.bandcamp, 
      icon: FaBandcamp, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
    },
    { 
      name: 'Tidal', 
      url: post?.acf?.tidal, 
      icon: '/tidal.svg', 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
    },
  ]


  if (!post) return null

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-20" />
      <div className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 w-[1000px] h-[1000px] bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
        >
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-300">Track</span>
        </motion.h2>

        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
          
          {/* Main content */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-square group"
              >
                <div className="absolute inset-0 bg-purple-500/10 rounded-xl transform group-hover:scale-95 transition-transform duration-500" />
                {getImageUrl(post) ? (
                 <Link href={`/music/${post.slug}`}> <Image
                    src={getImageUrl(post)!}
                    alt={post.title.rendered}
                    fill
                    className="object-contain p-4 transform group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  </Link>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
              </motion.div>

              {/* Content Side */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-8"
              >

                {previewUrl && (
                  <>
                    {/* Audio Preview */}
            {post.acf?.preview && previewUrl && (
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
                  </>
                )}

   <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
                  {streamingLinks
                    .filter(platform => platform.url)
                    .map((platform) => (
                      <motion.a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
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
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 