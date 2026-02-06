'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight, FaBoxOpen, FaInfoCircle, FaMusic, FaPause, FaPlay, FaSearch, FaVirus } from 'react-icons/fa'
import { useCategories, useLatestPosts } from '../hooks/useWordPress'
import Button from '../components/Button'
import SamplePacksFAQ from '../components/SamplePacksFAQ'

type ReleaseItem = {
  id: string
  title: string
  slug: string
  imageUrl?: string | null
  previewUrl?: string | null
  publishedAt?: string | null
  categories?: string[]
}

type Props = {
  initialPosts: ReleaseItem[]
  initialTotalPages: number
  initialCategory: string
  fallbackItems: ReleaseItem[]
}

export default function SamplePacksClient({
  initialPosts,
  initialTotalPages,
  initialCategory,
  fallbackItems,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioErrors, setAudioErrors] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [samplePacksCategory, setSamplePacksCategory] = useState<string>(initialCategory)
  const postsPerPage = 12
  const sectionRef = useRef<HTMLElement>(null)

  const { data: categories = [] } = useCategories()
  const { data: postsData, isLoading: postsLoading } = useLatestPosts(
    postsPerPage,
    currentPage,
    samplePacksCategory,
    searchQuery,
    {
      fallbackData: {
        posts: initialPosts,
        totalPages: initialTotalPages || 1,
        total: initialPosts.length,
      },
    }
  )

  const posts = useMemo<ReleaseItem[]>(
    () => (postsData?.posts?.length ? postsData.posts : fallbackItems),
    [postsData?.posts, fallbackItems]
  )
  const totalPages = postsData?.totalPages || (posts?.length ? 1 : initialTotalPages || 1)

  useEffect(() => {
    if (!initialCategory && Array.isArray(categories) && categories.length) {
      const matched = (categories as string[]).find(
        (c) => c.toLowerCase().includes('sample pack') || c.toLowerCase().includes('sample-pack')
      )
      if (matched) setSamplePacksCategory(matched)
    }
  }, [categories, initialCategory])

  useEffect(() => {
    setCurrentPage(1)
  }, [samplePacksCategory, searchQuery])

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentPage, samplePacksCategory, searchQuery])

  const getImageUrl = (post: ReleaseItem) => post.imageUrl || undefined

  const handlePlay = async (postId: string) => {
    if (!posts?.find((post: ReleaseItem) => post.id === postId)?.previewUrl) {
      setAudioErrors((prev) => ({
        ...prev,
        [postId]: 'No preview available',
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
        if (currentAudio) currentAudio.currentTime = 0
      }
      const newAudio = document.getElementById(`audio-${postId}`) as HTMLAudioElement
      if (newAudio) {
        try {
          await newAudio.play()
          setPlayingId(postId)
          setAudioErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[postId]
            return newErrors
          })
        } catch (error) {
          console.error('Error playing audio:', error)
          setAudioErrors((prev) => ({
            ...prev,
            [postId]: 'Error playing audio',
          }))
        }
      }
    }
  }

  return (
    <>
      {/* Infected Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Animated Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/music-bg.jpeg"
            alt="DnB Doctor Sample Packs Background"
            fill
            sizes="100vw"
            className="object-cover opacity-80"
            priority
          />
          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/30 to-black 
            after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)] 
            after:animate-pulse"
          />

          {/* Animated grid overlay */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.1)_1px,transparent_1px)] 
            bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]"
          />
        </div>

        {/* Floating infection particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 100 - 50 + '%',
                y: -20,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 0,
              }}
              animate={{
                y: '120%',
                opacity: [0, 1, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 2,
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
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r 
                from-purple-500 via-pink-500 to-purple-500 relative z-10"
              >
                Neurofunk Samples
              </span>
              <div className="absolute inset-0 blur-xl bg-purple-500/20 -z-10" />
            </h1>

            <p
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto 
              flex items-center justify-center gap-3 relative group mb-4"
            >
              <FaBoxOpen
                className="w-5 h-5 text-purple-500 
                group-hover:scale-110 transition-transform duration-300"
              />
              <span>Professional neurofunk sample packs with rolling basslines and complex drums</span>
              <FaBoxOpen
                className="w-5 h-5 text-purple-500 
                group-hover:scale-110 transition-transform duration-300"
              />
            </p>

            <motion.p
              className="text-lg text-gray-400 max-w-2xl mx-auto mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Download high-quality neurofunk samples featuring dark atmospheres, technical precision,
              and infectious beats for your drum and bass productions.
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
              <span>Browse Sample Packs</span>
              <FaBoxOpen className="w-5 h-5 ml-2 group-hover:rotate-180 transition-transform duration-500" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Sample Packs Section */}
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
              Professional <span className="text-purple-500">Neurofunk Samples</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-3">Rolling Basslines</h3>
                <p className="text-gray-300 text-sm">
                  High-quality neurofunk bass samples with complex modulation, perfect for creating
                  the signature rolling basslines that define the genre.
                </p>
              </div>
              <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-3">Complex Drums</h3>
                <p className="text-gray-300 text-sm">
                  Professional drum loops and one-shots featuring intricate patterns, tight kicks,
                  and crisp snares engineered for neurofunk productions.
                </p>
              </div>
              <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-3">Dark Atmospheres</h3>
                <p className="text-gray-300 text-sm">
                  Atmospheric pads, industrial textures, and sci-fi soundscapes that create the
                  dark, technical aesthetic of neurofunk music.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search Controls */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 group-hover:text-pink-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search neurofunk samples, bass loops, drum patterns..."
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
            Latest <span className="text-purple-500">Neurofunk Sample Packs</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post: ReleaseItem, index: number) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square bg-black/50 backdrop-blur-lg rounded-lg overflow-hidden 
                  border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
                itemScope
                itemType="https://schema.org/Product"
              >
                {post.previewUrl && (
                  <audio
                    id={`audio-${post.id}`}
                    preload="none"
                    onError={() => {
                      setAudioErrors((prev) => ({
                        ...prev,
                        [post.id]: 'Error loading audio',
                      }))
                    }}
                  >
                    <source src={post.previewUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}

                {getImageUrl(post) ? (
                  <div className="relative aspect-square">
                    <Image
                      src={getImageUrl(post)!}
                      alt={`Neurofunk sample pack - ${post.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      itemProp="image"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}

                {/* Overlay with title and buttons */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-4 line-clamp-2" itemProp="name">
                    {post.title}
                  </h3>
                  <meta itemProp="description" content={`Professional neurofunk sample pack - ${post.title}`} />
                  <meta itemProp="category" content="Neurofunk Samples" />
                  <div className="flex gap-3">
                    {post.previewUrl && (
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
                      <div
                        className="absolute bottom-20 left-0 right-0 text-center text-red-500 text-sm 
                        bg-red-500/10 border border-red-500/30 py-2"
                      >
                        {audioErrors[post.id]}
                      </div>
                    )}
                    <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
                      <Button href={`/music/${post.slug}`} variant="infected" className="w-full group">
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
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="decayed"
                  className="group"
                >
                  <FaArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>Previous</span>
                </Button>
              </motion.div>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <motion.div key={page} whileHover={{ scale: 1.02 }}>
                    <Button
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? 'infected' : 'toxic'}
                      className="min-w-[40px] px-4"
                    >
                      {page}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
              <p className="text-gray-400">No sample packs found matching your criteria</p>
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

      {/* FAQ Section */}
      <SamplePacksFAQ />
    </>
  )
}
