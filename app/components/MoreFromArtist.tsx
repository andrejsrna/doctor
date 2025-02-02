'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  id: number
  title: {
    rendered: string
  }
  slug: string
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string
    }>
  }
  acf?: {
    preview?: string
  }
}

interface MoreFromArtistProps {
  artistName: string
  currentPostId: number
}

export default function MoreFromArtist({ artistName, currentPostId }: MoreFromArtistProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [visiblePosts, setVisiblePosts] = useState(4)
  const [audioErrors, setAudioErrors] = useState<Record<number, string>>({})

  useEffect(() => {
    const fetchArtistPosts = async () => {
      try {
        // First fetch tag ID
        const tagsResponse = await fetch(
          `https://dnbdoctor.com/wp-json/wp/v2/tags?search=${encodeURIComponent(artistName)}`
        )
        const tags = await tagsResponse.json()
        
        if (!tags.length) {
          setError('No artist tag found')
          return
        }

        // Then fetch posts with that tag ID
        const response = await fetch(
          `https://dnbdoctor.com/wp-json/wp/v2/posts?tags=${tags[0].id}&_embed`
        )
        if (!response.ok) throw new Error('Failed to fetch posts')
        
        const data = await response.json()
        const filteredPosts = data.filter((post: Post) => post.id !== currentPostId)

        // Fetch preview URLs for each post
        const postsWithPreviews = await Promise.all(
          filteredPosts.map(async (post: Post) => {
            if (post.acf?.preview) {
              const attachmentResponse = await fetch(
                `https://dnbdoctor.com/wp-json/wp/v2/media/${post.acf.preview}`
              )
              if (attachmentResponse.ok) {
                const attachment = await attachmentResponse.json()
                return {
                  ...post,
                  acf: {
                    ...post.acf,
                    preview: attachment.source_url
                  }
                }
              }
            }
            return post
          })
        )

        setPosts(postsWithPreviews)
      } catch (error) {
        console.error('Error:', error)
        setError('Failed to load more posts from this artist')
      } finally {
        setIsLoading(false)
      }
    }

    if (artistName) {
      fetchArtistPosts()
    }
  }, [artistName, currentPostId])

  const handlePlay = async (postId: number) => {
    const post = posts.find(p => p.id === postId)
    if (!post?.acf?.preview) return

    try {
      if (playingId === postId) {
        audio?.pause()
        setPlayingId(null)
      } else {
        if (audio) {
          audio.pause()
        }
        const newAudio = new Audio(post.acf.preview)
        await newAudio.play()
        setAudio(newAudio)
        setPlayingId(postId)
        // Clear any previous error for this post
        setAudioErrors(prev => ({...prev, [postId]: ''}))
      }
    } catch (error) {
      console.error('Audio playback error:', error)
      setAudioErrors(prev => ({
        ...prev, 
        [postId]: 'Failed to play preview'
      }))
    }
  }

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 4)
  }

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause()
      }
    }
  }, [audio])

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-purple-500/20 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-black/30 rounded-xl p-4">
              <div className="aspect-video bg-purple-500/20 rounded-lg mb-4" />
              <div className="h-6 w-3/4 bg-purple-500/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return null // Hide section if there's an error
  }

  if (posts.length === 0) {
    return null // Hide section if no other posts from artist
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 pt-16 border-t border-[#00FF00]/20"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-clip-text text-transparent 
        bg-gradient-to-r from-[#00FF00] via-[#9900FF] to-[#00FF00]">
        More from {artistName}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {posts.slice(0, visiblePosts).map((post) => (
          <div key={post.id} className="group relative">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg'}
                alt={post.title.rendered}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay with title and buttons */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                flex flex-col justify-end p-6"
              >
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
                      className="flex-1 text-sm text-white bg-purple-500 hover:bg-purple-600 
                        px-4 py-3 rounded-full transition-colors font-medium uppercase 
                        tracking-wider flex items-center justify-center gap-2"
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
                    <div className="absolute bottom-20 left-0 right-0 text-center text-red-500 
                      text-sm bg-black/80 py-2">
                      {audioErrors[post.id]}
                    </div>
                  )}
                  <Link 
                    href={`/music/${post.slug}`} 
                    className="flex-1 text-sm text-white bg-purple-500 hover:bg-purple-600 
                      px-4 py-3 rounded-full transition-colors font-medium uppercase 
                      tracking-wider text-center"
                  >
                    Show More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length > visiblePosts && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 rounded-full bg-[#00FF00]/20 border border-[#00FF00]/30
              text-[#00FF00] hover:bg-[#00FF00]/30 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </motion.div>
  )
} 