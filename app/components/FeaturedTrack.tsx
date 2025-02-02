'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

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
  }
}

export default function FeaturedTrack() {
  const [post, setPost] = useState<FeaturedPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [audioError, setAudioError] = useState<string>('')

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

  const handlePlay = async () => {
    const audio = document.getElementById('featured-audio') as HTMLAudioElement
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      try {
        await audio.play()
        setIsPlaying(true)
        setAudioError('')
      } catch (error) {
        console.error('Error playing audio:', error)
        setAudioError('Error playing audio')
      }
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

  if (!post) return null

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-20" />
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
                  <Image
                    src={getImageUrl(post)!}
                    alt={post.title.rendered}
                    fill
                    className="object-contain p-4 transform group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
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
                <h3 
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />

                {previewUrl && (
                  <>
                    <audio
                      id="featured-audio"
                      src={previewUrl}
                      onEnded={() => setIsPlaying(false)}
                      onError={() => setAudioError('Error loading audio')}
                    />
                    <button 
                      onClick={handlePlay}
                      className="group flex items-center justify-center gap-3 bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full transform group-hover:scale-110 transition-transform duration-300">
                        {isPlaying ? "⏸" : "▶️"}
                      </span>
                      {isPlaying ? 'Pause Preview' : 'Play Preview'}
                    </button>
                    {audioError && (
                      <p className="text-red-500 text-sm">{audioError}</p>
                    )}
                  </>
                )}

                <div className="flex flex-wrap gap-4">
                  {post.acf?.spotify && (
                    <a 
                      href={post.acf.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-[#1DB954] hover:bg-[#1ed760] text-white px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 font-medium"
                    >
                      Spotify
                    </a>
                  )}
                  {post.acf?.beatport && (
                    <a 
                      href={post.acf.beatport}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-[#02FF95] hover:bg-[#02ff95ee] text-black px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 font-medium"
                    >
                      Beatport
                    </a>
                  )}
                  {post.acf?.soundcloud && (
                    <a 
                      href={post.acf.soundcloud}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-[#ff5500] hover:bg-[#ff5500ee] text-white px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 font-medium"
                    >
                      SoundCloud
                    </a>
                  )}
                </div>

                <Link
                  href={`/music/${post.slug}`}
                  className="text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 font-medium backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 