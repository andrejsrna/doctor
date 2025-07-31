'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaMusic, FaPlay, FaPause, FaInfoCircle, FaArrowLeft, FaArrowRight, FaFilter, FaSearch, FaVirus, FaSyringe } from 'react-icons/fa'
import { useLatestPosts, useMultipleMediaPreviews, useCategories } from '../hooks/useWordPress'
import Button from '../components/Button'
import EngagementCTA from '../components/EngagementCTA'

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
  const sectionRef = useRef<HTMLElement>(null)

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

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentPage, selectedCategory, searchQuery])

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
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Latest DnB Releases",
            "description": "Latest drum and bass releases, newest DnB tracks, and fresh neurofunk music",
            "url": "https://dnbdoctor.com/music",
            "numberOfItems": posts?.length || 0,
            "itemListElement": posts?.map((post: Post, index: number) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "MusicRecording",
                "name": post.title.rendered,
                "description": `Latest DnB release - ${post.title.rendered}`,
                "genre": "Drum and Bass",
                "url": `https://dnbdoctor.com/music/${post.slug}`,
                "image": getImageUrl(post),
                "datePublished": post.date,
                "byArtist": {
                  "@type": "MusicGroup",
                  "name": "DnB Doctor"
                }
              }
            })) || []
          })
        }}
      />

      {/* Infected Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Animated Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/music-bg.jpeg"
            alt="DnB Doctor Music Background"
            fill
            className="object-cover opacity-80"
            priority
          />
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/30 to-black 
            after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)] 
            after:animate-pulse" />
          
          {/* Animated grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.1)_1px,transparent_1px)] 
            bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
        </div>

        {/* Floating infection particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 - 50 + "%",
                y: -20,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 0 
              }}
              animate={{ 
                y: "120%",
                opacity: [0, 1, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute text-purple-500/30 w-8 h-8"
            >
              <FaVirus className="w-full h-full" />
            </motion.div>
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r 
                from-purple-500 via-pink-500 to-purple-500 relative z-10">
                DnB Latest Releases
              </span>
              <div className="absolute inset-0 blur-xl bg-purple-500/20 -z-10" />
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto 
              flex items-center justify-center gap-3 relative group mb-4">
              <FaSyringe className="w-5 h-5 text-purple-500 rotate-45 
                group-hover:scale-110 transition-transform duration-300" />
              <span>Latest drum and bass tracks and newest DnB releases</span>
              <FaSyringe className="w-5 h-5 text-purple-500 -rotate-45 
                group-hover:scale-110 transition-transform duration-300" />
            </p>
            
            <motion.p 
              className="text-lg text-gray-400 max-w-2xl mx-auto mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Discover the freshest DnB tracks, latest neurofunk releases, and newest drum and bass music 
              from top artists. Updated daily with the hottest tracks in the scene.
            </motion.p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Button
              variant="infected"
              onClick={() => {
                if (sectionRef.current) {
                  sectionRef.current.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="group text-lg"
            >
              <span>Browse Releases</span>
              <FaVirus className="w-5 h-5 ml-2 group-hover:rotate-180 transition-transform duration-500" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Releases Section */}
      <section className="py-20 px-4 relative" ref={sectionRef}>
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* SEO Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-6 text-white">
              Latest <span className="text-purple-500">DnB Releases</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-3">Fresh Tracks Daily</h3>
                <p className="text-gray-300 text-sm">
                  Get the newest DnB releases as soon as they drop. Our latest drum and bass tracks 
                  are updated daily with previews and streaming links.
                </p>
              </div>
              <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-3">Latest Neurofunk</h3>
                <p className="text-gray-300 text-sm">
                  Discover the latest neurofunk releases from top producers. From rolling basslines 
                  to complex drum patterns, find the freshest sounds in the scene.
                </p>
              </div>
              <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-3">New Drum & Bass</h3>
                <p className="text-gray-300 text-sm">
                  Explore the newest drum and bass music from emerging and established artists. 
                  Latest DnB tracks with high-quality previews and downloads.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Filter Controls */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 group-hover:text-pink-500 transition-colors duration-300" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                }}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 
                  text-white focus:border-purple-500 focus:outline-none hover:border-purple-500/50 
                  transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 relative group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 group-hover:text-pink-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search latest DnB releases, newest tracks, artists..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 
                  text-white focus:border-purple-500 focus:outline-none hover:border-purple-500/50 
                  transition-all duration-300"
              />
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-8 text-center text-white">
            Latest <span className="text-purple-500">DnB Tracks</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post: Post, index: number) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square bg-black/50 backdrop-blur-lg rounded-lg overflow-hidden 
                  border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 
                    className="text-xl font-bold text-white mb-4 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div className="flex gap-3">
                    {post.acf?.preview && (
                      <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            handlePlay(post.id)
                          }}
                          variant="toxic"
                          className="w-full group"
                        >
                          {playingId === post.id ? (
                            <>
                              <FaPause className="w-4 h-4 mr-2" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <FaPlay className="w-4 h-4 mr-2" />
                              <span>{audioErrors[post.id] ? 'Error' : 'Preview'}</span>
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                    {audioErrors[post.id] && (
                      <div className="absolute bottom-20 left-0 right-0 text-center text-red-500 text-sm 
                        bg-red-500/10 border border-red-500/30 py-2">
                        {audioErrors[post.id]}
                      </div>
                    )}
                    <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
                      <Button
                        href={`/music/${post.slug}`}
                        variant="infected"
                        className="w-full group"
                      >
                        <FaInfoCircle className="w-4 h-4 mr-2" />
                        <span>Show More</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-12">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="decayed"
                  className="group"
                >
                  <FaArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>Previous</span>
                </Button>
              </motion.div>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <motion.div
                    key={page}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Button
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "infected" : "toxic"}
                      className="min-w-[40px] px-4"
                    >
                      {page}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="decayed"
                  className="group"
                >
                  <span>Next</span>
                  <FaArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </div>
          )}

          {/* Show message when no results */}
          {posts?.length === 0 && !postsLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 px-6 rounded-lg border border-purple-500/30 
                bg-purple-500/5 backdrop-blur-sm"
            >
              <p className="text-gray-400">No releases found matching your criteria</p>
            </motion.div>
          )}

          {/* Loading State */}
          {postsLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-[400px] flex items-center justify-center"
            >
              <div className="animate-pulse text-purple-500 flex items-center gap-3">
                <FaMusic className="w-6 h-6 animate-spin" />
                <span>Loading...</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Engagement CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            Stay Connected with <span className="text-purple-500">Latest DnB</span>
          </motion.h2>
          <EngagementCTA />
        </div>
      </section>
    </>
  )
} 