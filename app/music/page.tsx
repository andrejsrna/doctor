'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

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
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [audioErrors, setAudioErrors] = useState<Record<number, string>>({})
  const [previewUrls, setPreviewUrls] = useState<Record<number, string>>({})
  const postsPerPage = 12
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    // Reset posts and current page when filters change
    setPosts([])
    setCurrentPage(1)
    fetchPosts(1, selectedCategory, searchQuery)
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    if (currentPage > 1) {
      fetchPosts(currentPage, selectedCategory, searchQuery)
    }
  }, [currentPage])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchPosts = async (page: number, category: string, search: string) => {
    try {
      let url = `https://admin.dnbdoctor.com/wp-json/wp/v2/posts?_embed&per_page=${postsPerPage}&page=${page}`
      
      if (category) {
        url += `&categories=${category}`
      }
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`
      }

      const response = await fetch(url)
      const data = await response.json()
      
      if (data.length < postsPerPage) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

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
      
      if (page === 1) {
        setPosts(updatedPosts)
      } else {
        setPosts(prev => [...prev, ...updatedPosts])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update audio elements when preview URLs change
  useEffect(() => {
    posts.forEach(post => {
      const audioElement = document.getElementById(`audio-${post.id}`) as HTMLAudioElement
      if (audioElement && previewUrls[post.id]) {
        audioElement.src = previewUrls[post.id]
      }
    })
  }, [previewUrls, posts])

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

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://admin.dnbdoctor.com/wp-json/wp/v2/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/music-bg.jpeg" // Make sure to add your preferred background image
          alt="DnB Doctor Music Background"
          fill
          className="object-cover object-center"
          priority
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            DnB Doctor <span className="text-purple-500">Releases</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Explore our collection of cutting-edge drum and bass releases.
          </motion.p>
        </div>
      </section>

      {/* Releases Section */}
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
            Pick Your Sonic <span className="text-purple-500">Masterpieces</span>
          </motion.h2>

          {/* Filter Controls */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setIsLoading(true)
                  setSelectedCategory(e.target.value)
                }}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
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
                  setIsLoading(true)
                  setSearchQuery(e.target.value)
                }}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

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

          {/* Show message when no results */}
          {posts.length === 0 && !isLoading && (
            <div className="text-center text-gray-400 py-12">
              No releases found matching your criteria
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-12"
            >
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-8 py-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors uppercase tracking-wider"
              >
                Load More
              </button>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-pulse text-purple-500">Loading...</div>
            </div>
          )}
        </div>
      </section>
    </>
  )
} 