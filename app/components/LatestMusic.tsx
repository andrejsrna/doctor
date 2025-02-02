'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Post {
  id: number
  title: {
    rendered: string
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string
      media_details?: {
        sizes?: {
          full?: {
            source_url?: string
          }
          medium?: {
            source_url?: string
          }
        }
      }
    }>
  }
  acf?: {
    preview?: string  // Made optional since it might not exist
  }
  date: string
  slug: string
}

export default function LatestMusic() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [audioErrors, setAudioErrors] = useState<Record<number, string>>({})
  const [previewUrls, setPreviewUrls] = useState<Record<number, string>>({})

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(
          'https://admin.dnbdoctor.com/wp-json/wp/v2/posts?_embed&per_page=6'
        )
        const data = await response.json()
        console.log('Fetched posts:', data)

        // Fetch preview URLs for each post
        const updatedPosts = await Promise.all(
          data.map(async (post: Post) => {
            if (post.acf?.preview) {
              try {
                const attachmentResponse = await fetch(
                  `https://admin.dnbdoctor.com/wp-json/wp/v2/media/${post.acf.preview}`
                )
                if (attachmentResponse.ok) {
                  const attachment = await attachmentResponse.json()
                  console.log(`Audio URL for post ${post.id}:`, attachment.source_url)
                  setPreviewUrls(prev => ({
                    ...prev,
                    [post.id]: attachment.source_url
                  }))
                }
              } catch (error) {
                console.error(`Error fetching preview for post ${post.id}:`, error)
              }
            }
            return post
          })
        )

        setPosts(updatedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Update the audio element source
  useEffect(() => {
    posts.forEach(post => {
      const audioElement = document.getElementById(`audio-${post.id}`) as HTMLAudioElement
      if (audioElement && previewUrls[post.id]) {
        audioElement.src = previewUrls[post.id]
      }
    })
  }, [previewUrls, posts])

  // Helper function to get the best available image URL
  const getImageUrl = (post: Post) => {
    const media = post._embedded?.['wp:featuredmedia']?.[0]
    return (
      media?.source_url ||
      media?.media_details?.sizes?.full?.source_url ||
      media?.media_details?.sizes?.medium?.source_url
    )
  }

  const handlePlay = async (postId: number) => {
    if (!posts.find(post => post.id === postId)?.acf?.preview) {
      setAudioErrors(prev => ({
        ...prev,
        [postId]: 'No preview available'
      }))
      return
    }

    if (playingId === postId) {
      const audio = document.getElementById(`audio-${postId}`) as HTMLAudioElement
      audio?.pause()
      setPlayingId(null)
    } else {
      // Stop any currently playing audio
      if (playingId) {
        const currentAudio = document.getElementById(`audio-${playingId}`) as HTMLAudioElement
        currentAudio?.pause()
        currentAudio.currentTime = 0
      }
      // Play new audio
      const newAudio = document.getElementById(`audio-${postId}`) as HTMLAudioElement
      if (newAudio) {
        try {
          await newAudio.play()
          setPlayingId(postId)
          // Clear any previous error for this post
          setAudioErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[postId]
            return newErrors
          })
        } catch (error) {
          console.error('Error playing audio:', error)
          setAudioErrors(prev => ({
            ...prev,
            [postId]: 'Error playing audio'
          }))
        }
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-purple-500">Loading...</div>
      </div>
    )
  }

  return (
    <section className="py-20 px-4 relative">
      {/* Section Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
        >
          Latest <span className="text-purple-500">Releases</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-square bg-black/50 backdrop-blur-lg rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300"
            >
              {getImageUrl(post) ? (
                <div className="relative aspect-square">
                  <Image
                    src={getImageUrl(post)!}
                    alt={post.title.rendered}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  No image available
                </div>
              )}

              
              
              {/* Hidden audio element */}
              {post.acf?.preview && (
                <audio
                  id={`audio-${post.id}`}
                  preload="none"
                  onError={() => {
                    setAudioErrors(prev => ({
                      ...prev,
                      [post.id]: 'Error loading audio'
                    }))
                  }}
                >
                  {previewUrls[post.id] && (
                    <source 
                      src={previewUrls[post.id]} 
                      type="audio/mpeg"
                    />
                  )}
                  Your browser does not support the audio element.
                </audio>
              )}
              
              {/* Overlay with title and buttons */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 
                  className="text-xl font-bold text-white mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div className="flex gap-3">
                  {post.acf?.preview && (
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        handlePlay(post.id)
                      }}
                      className="flex-1 text-sm text-white bg-purple-500 hover:bg-purple-600 px-4 py-3 rounded-full transition-colors font-medium uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      {playingId === post.id ? (
                        <>
                          <span className="w-4 h-4">⏸</span>
                          Pause
                        </>
                      ) : (
                        <>
                          <span className="w-4 h-4">▶️</span>
                          {audioErrors[post.id] ? 'Error' : 'Preview'}
                        </>
                      )}
                    </button>
                  )}
                  {audioErrors[post.id] && (
                    <div className="absolute bottom-20 left-0 right-0 text-center text-red-500 text-sm bg-black/80 py-2">
                      {audioErrors[post.id]}
                    </div>
                  )}
                  <Link 
                    href={`/music/${post.slug}`} 
                    className="flex-1 text-sm text-white bg-purple-500 hover:bg-purple-600 px-4 py-3 rounded-full transition-colors font-medium uppercase tracking-wider text-center"
                  >
                    Show More
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-x-4 flex justify-center mt-10"
          >
            <motion.button 
              className="relative group px-8 py-3 rounded-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-500 via-purple-500 to-pink-500 group-hover:opacity-80 transition-opacity" />
              <span className="relative text-white font-medium flex items-center gap-2">
                <Link href="/music">Show More</Link>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
    </section>
  )
} 