'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { FaMusic, FaPlay, FaPause, FaInfoCircle, FaFilter, FaSearch, FaSoundcloud, FaSpotify, FaApple, FaYoutube } from 'react-icons/fa'
import Link from 'next/link'
import Button from '../components/Button'
import EngagementCTA from '../components/EngagementCTA'
import { useSearchParams } from 'next/navigation'
import NiceSelect from '../components/NiceSelect'

type ReleaseItem = {
  id: string
  title: string
  slug: string
  coverImageUrl?: string | null
  previewUrl?: string | null
  soundcloud?: string | null
  spotify?: string | null
  appleMusic?: string | null
  beatport?: string | null
  youtubeMusic?: string | null
  publishedAt?: string | null
}

export default function MusicClient({ initialPosts, categories, initialTotalPages }: { initialPosts: ReleaseItem[]; categories: string[]; initialTotalPages: number }) {
  const shouldReduce = useReducedMotion()
  const [currentPage, setCurrentPage] = useState(1)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioErrors, setAudioErrors] = useState<Record<string, string>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [posts, setPosts] = useState<ReleaseItem[]>(initialPosts)
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const sectionRef = useRef<HTMLElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  // hero removed
  const searchInputRef = useRef<HTMLInputElement>(null)

  const postsPerPage = 12
  const loadingRef = useRef(false)
  const controllerRef = useRef<AbortController | null>(null)
  const searchParams = useSearchParams()

  const slugify = (value: string) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const resolveCategoryFromParam = (param: string | null): string => {
    if (!param) return ''
    const paramSlug = slugify(param)
    const slugToName = new Map(categories.map((name) => [slugify(name), name]))
    const direct = slugToName.get(paramSlug)
    if (direct) return direct
    const aliases: Record<string, string[]> = {
      'ep': ['ep', 'eps'],
      'eps': ['ep', 'eps'],
      'lp': ['lp', 'lps', 'album', 'albums'],
      'lps': ['lp', 'lps', 'album', 'albums'],
      'album': ['album', 'albums', 'lp', 'lps'],
      'albums': ['album', 'albums', 'lp', 'lps'],
      'single-tracks': ['single-tracks', 'single', 'singles', 'single-release', 'single-releases'],
      'single': ['single-tracks', 'single', 'singles', 'single-release', 'single-releases'],
      'singles': ['single-tracks', 'single', 'singles', 'single-release', 'single-releases'],
    }
    const alts = aliases[paramSlug] || []
    for (const alt of alts) {
      const hit = slugToName.get(alt)
      if (hit) return hit
    }
    const canonicalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
    const canonicalMap = new Map(categories.map((name) => [canonicalize(name), name]))
    const paramCanonical = canonicalize(param)
    const canonDirect = canonicalMap.get(paramCanonical)
    if (canonDirect) return canonDirect
    if (['ep', 'eps'].includes(paramCanonical)) {
      const match = categories.find((c) => canonicalize(c) === 'eps' || canonicalize(c).startsWith('ep'))
      if (match) return match
    }
    const ci = categories.find(c => c.toLowerCase() === param.toLowerCase())
    return ci || ''
  }

  const fetchAndSet = async (page: number, replace: boolean) => {
    if (loadingRef.current) return
    loadingRef.current = true
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setIsLoading(true)
    try {
      const qs = new URLSearchParams({
        page: String(page),
        limit: String(postsPerPage),
        category: selectedCategory,
        search: searchQuery,
      })
      const res = await fetch(`/api/releases?${qs.toString()}`, { signal: controller.signal })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setPosts(prev => replace ? (data.items || []) : [...prev, ...(data.items || [])])
      setTotalPages(data.totalPages || 1)
    } catch (e) {
      if ((e as unknown as { name?: string }).name !== 'AbortError') console.error(e)
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }

  useEffect(() => {
    const categoryParam = searchParams?.get('category') ?? null
    const focus = searchParams?.get('focus') ?? null
    const mapped = resolveCategoryFromParam(categoryParam)
    if (mapped !== selectedCategory) {
      setSelectedCategory(mapped)
      setCurrentPage(1)
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    if (focus === 'search') {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, categories])

  // simplified: hero removed

  // Fetch when page increments beyond initial
  useEffect(() => {
    if (currentPage > 1) fetchAndSet(currentPage, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  // Debounced fetch when filters/search change (reset to page 1)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchAndSet(1, true)
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0]
      const hasMore = currentPage < totalPages
      if (entry.isIntersecting && hasMore && !loadingRef.current && !isLoading) {
        setCurrentPage(p => p + 1)
      }
    }, { root: null, rootMargin: '0px', threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [currentPage, totalPages, isLoading])

  const getImageUrl = (post: ReleaseItem) => post.coverImageUrl || undefined

  const handlePlay = async (postId: string) => {
    if (!posts?.find((post: ReleaseItem) => post.id === postId)?.previewUrl) {
      setAudioErrors(prev => ({ ...prev, [postId]: 'No preview available' }))
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
            const next = { ...prev }
            delete next[postId]
            return next
          })
        } catch {
          setAudioErrors(prev => ({ ...prev, [postId]: 'Error playing audio' }))
        }
      }
    }
  }

  return (
    <>
      {/* JSON-LD moved to server in page.tsx */}

      {/* hero removed */}

      <section className="py-20 px-4 relative" ref={sectionRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center">
            <span className="text-white">Drum and Bass </span>
            <span className="text-purple-500">New Releases</span>
          </h1>
          <p className="text-gray-300 text-center mb-12 max-w-3xl mx-auto text-lg">
            Discover the latest drum and bass tracks updated daily. Stream new DnB releases, fresh neurofunk music, and the hottest tracks from top artists.
          </p>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" />
              <div className="pl-6">
                <NiceSelect
                  value={selectedCategory}
                  options={[{ value: '', label: 'All Categories' }, ...categories]}
                  onChange={(val) => {
                    setSelectedCategory(val)
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>
            <div className="flex-1 relative group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 group-hover:text-pink-500 transition-colors duration-300" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search drum and bass new releases, tracks, artists..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 text-white focus:border-purple-500 focus:outline-none hover:border-purple-500/50 transition-all duration-300"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-8 text-center text-white">Latest <span className="text-purple-500">Tracks</span></h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post: ReleaseItem, index: number) => (
              <motion.article
                key={post.id}
                initial={shouldReduce ? undefined : { opacity: 1, y: 20 }}
                whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
                viewport={shouldReduce ? undefined : { once: true }}
                transition={shouldReduce ? undefined : { delay: index * 0.1 }}
                className="group relative aspect-square bg-black/50 backdrop-blur-lg rounded-lg overflow-hidden border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
              >
                {post.previewUrl && (
                  <audio id={`audio-${post.id}`} preload="none" onError={() => setAudioErrors(prev => ({ ...prev, [post.id]: 'Error loading audio' }))}>
                    <source src={post.previewUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}

                {getImageUrl(post) ? (
                  <div className="relative aspect-square">
                    <Link href={`/music/${post.slug}`}>
                      <Image
                        src={getImageUrl(post)!}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">No image available</div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">
                    <Link href={`/music/${post.slug}`} className="hover:text-purple-300 transition-colors">{post.title}</Link>
                  </h3>
                  <div className="flex gap-3">
                    {post.previewUrl && (
                      <motion.div whileHover={shouldReduce ? undefined : { scale: 1.02 }} className="flex-1">
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
                      <div className="absolute bottom-20 left-0 right-0 text-center text-red-500 text-sm bg-red-500/10 border border-red-500/30 py-2">{audioErrors[post.id]}</div>
                    )}
                    <motion.div whileHover={shouldReduce ? undefined : { scale: 1.02 }} className="flex-1">
                      <Button href={`/music/${post.slug}`} variant="infected" className="w-full group">
                        <FaInfoCircle className="w-4 h-4 mr-2" />
                        <span>Show More</span>
                      </Button>
                    </motion.div>
                  </div>

                  {(post.soundcloud || post.spotify || post.appleMusic || post.beatport || post.youtubeMusic) && (
                    <div className="flex gap-2 mt-3">
                      {post.soundcloud && (
                        <motion.a href={post.soundcloud} target="_blank" rel="noopener noreferrer" whileHover={shouldReduce ? undefined : { scale: 1.05 }} className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 hover:border-orange-500/50 rounded-lg p-2 text-center transition-all duration-300">
                          <FaSoundcloud className="w-4 h-4 text-orange-400 mx-auto" />
                        </motion.a>
                      )}
                      {post.spotify && (
                        <motion.a href={post.spotify} target="_blank" rel="noopener noreferrer" whileHover={shouldReduce ? undefined : { scale: 1.05 }} className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50 rounded-lg p-2 text-center transition-all duration-300">
                          <FaSpotify className="w-4 h-4 text-green-400 mx-auto" />
                        </motion.a>
                      )}
                      {post.appleMusic && (
                        <motion.a href={post.appleMusic} target="_blank" rel="noopener noreferrer" whileHover={shouldReduce ? undefined : { scale: 1.05 }} className="flex-1 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 hover:border-pink-500/50 rounded-lg p-2 text-center transition-all duration-300">
                          <FaApple className="w-4 h-4 text-pink-400 mx-auto" />
                        </motion.a>
                      )}
                      {post.beatport && (
                        <motion.a href={post.beatport} target="_blank" rel="noopener noreferrer" whileHover={shouldReduce ? undefined : { scale: 1.05 }} className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg p-2 text-center transition-all duration-300">
                          <Image src="/beatport.svg" alt="Beatport" width={16} height={16} className="mx-auto" />
                        </motion.a>
                      )}
                      {post.youtubeMusic && (
                        <motion.a href={post.youtubeMusic} target="_blank" rel="noopener noreferrer" whileHover={shouldReduce ? undefined : { scale: 1.05 }} className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-lg p-2 text-center transition-all duration-300">
                          <FaYoutube className="w-4 h-4 text-red-400 mx-auto" />
                        </motion.a>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          <div ref={loadMoreRef} className="h-10" />

          {!isLoading && currentPage >= totalPages && posts.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-400">That’s all for now.</p>
              <div className="mt-4 flex justify-center gap-3">
                <Button href="/newsletter" variant="infected">Stay Connected</Button>
                <Button href="https://www.instagram.com/dnbdoctor/" variant="toxic">Follow on IG</Button>
              </div>
            </div>
          )}

          {posts?.length === 0 && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 px-6 rounded-lg border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm">
              <p className="text-gray-400">No releases found matching your criteria</p>
            </motion.div>
          )}

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[400px] flex items-center justify-center">
              <div className="animate-pulse text-purple-500 flex items-center gap-3">
                <FaMusic className="w-6 h-6 animate-spin" />
                <span>Loading...</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h2 initial={shouldReduce ? undefined : { opacity: 0, y: 20 }} whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }} viewport={shouldReduce ? undefined : { once: true }} className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Stay Updated with <span className="text-purple-500">New Drum and Bass Releases</span>
          </motion.h2>
          <EngagementCTA />
        </div>
      </section>
    </>
  )
}


