'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaMusic } from 'react-icons/fa'
import { useLatestPosts, useMultipleMediaPreviews, useCategories } from '../hooks/useWordPress'

interface Post {
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
          medium?: {
            source_url?: string
          }
        }
      }
    }>
  }
  acf?: {
    preview?: string
  }
  date: string
  excerpt: {
    rendered: string
  }
  categories?: number[]
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function MusicPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [audioErrors, setAudioErrors] = useState<Record<number, string>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const postsPerPage = 12

  // Use SWR hooks with caching
  const { data: postsData, isLoading: postsLoading } = useLatestPosts(postsPerPage, currentPage, selectedCategory, searchQuery)
  const { data: categories = [] } = useCategories()
  
  const posts = useMemo(() => postsData?.posts || [], [postsData?.posts])
  const totalPages = postsData?.totalPages || 1

  const previewIds = useMemo(() => 
    posts.map((post: Post) => post.acf?.preview).filter(Boolean) || [], 
    [posts]
  )
  const { data: previews } = useMultipleMediaPreviews(previewIds)

  // Update previewUrls when previews change
  useEffect(() => {
    if (!posts || !previews) return
    
    const newPreviewUrls: Record<number, string> = {}
    posts.forEach((post: Post) => {
      if (post.acf?.preview && previews[post.acf.preview]) {
        newPreviewUrls[post.id] = previews[post.acf.preview]
      }
    })

    setPreviewUrls(newPreviewUrls)
  }, [posts, previews])

  const [previewUrls, setPreviewUrls] = useState<Record<number, string>>({})

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  const getImageUrl = (post: Post) => {
    const media = post._embedded?.['wp:featuredmedia']?.[0]
    return (
      media?.source_url ||
      media?.media_details?.sizes?.full?.source_url ||
      media?.media_details?.sizes?.medium?.source_url
    )
  }

  const handlePlay = async (postId: number) => {
    if (!posts?.find((post: Post) => post.id === postId)?.acf?.preview) {
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
      if (playingId) {
        const currentAudio = document.getElementById(`audio-${playingId}`) as HTMLAudioElement
        currentAudio?.pause()
        currentAudio.currentTime = 0
      }
      const newAudio = document.getElementById(`audio-${postId}`) as HTMLAudioElement
      if (newAudio) {
        try {
          await newAudio.play()
          setPlayingId(postId)
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

  return (
    <>
            {/* Hero Section with Parallax Effect */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/music-bg.jpeg"
            alt="DnB Doctor Music Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>
        
        <motion.div 
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block p-4 bg-purple-500/20 rounded-full mb-6 backdrop-blur-sm"
          >
            <FaMusic className="w-16 h-16 text-purple-500" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
            DnB Doctor Releases
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Explore our collection of cutting-edge drum and bass releases.
          </p>
        </motion.div>
      </div>

      {/* Releases Section */}
      <section className="py-20 px-4 relative">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        
        <div className="max-w-7xl mx-auto relative z-10">

          {/* Filter Controls */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                }}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search releases..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post: Post, index: number) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square bg-black/50 backdrop-blur-lg rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300"
              >
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          )}

          {/* Show message when no results */}
          {posts?.length === 0 && !postsLoading && (
            <div className="text-center text-gray-400 py-12">
              No releases found matching your criteria
            </div>
          )}

          {/* Loading State */}
          {postsLoading && (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-pulse text-purple-500">Loading...</div>
            </div>
          )}
        </div>
      </section>
    </>
  )
} 