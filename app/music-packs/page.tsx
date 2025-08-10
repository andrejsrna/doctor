"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight, FaMusic, FaSearch } from 'react-icons/fa'
import { useCategories, useLatestPosts } from '../hooks/useWordPress'
import Button from '../components/Button'
import MusicPacksHero from './components/MusicPacksHero'
import MusicPackCard from './components/MusicPackCard'

type Item = {
  id: string | number
  title: string
  slug: string
  imageUrl?: string | null
  previewUrl?: string | null
}

export default function MusicPacksPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [playingId, setPlayingId] = useState<string | number | null>(null)
  const [audioErrors, setAudioErrors] = useState<Record<string | number, string>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const postsPerPage = 12
  const sectionRef = useRef<HTMLElement>(null)

  const { data: postsData, isLoading } = useLatestPosts(postsPerPage, currentPage, category, searchQuery)
  const { data: categories = [] } = useCategories()

  const items: Item[] = useMemo(() => postsData?.posts || [], [postsData?.posts])
  const totalPages = postsData?.totalPages || 1

  useEffect(() => {
    if (!Array.isArray(categories) || !categories.length) return
    const preferred = ['music pack', 'music-pack', 'packs', 'pack']
    const found = categories.find((c: string) => preferred.some(p => c.toLowerCase().includes(p)))
    if (found) setCategory(found)
  }, [categories])

  useEffect(() => { setCurrentPage(1) }, [category, searchQuery])
  useEffect(() => { sectionRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [currentPage, category, searchQuery])

  const togglePlay = async (id: string | number) => {
    const target = document.getElementById(`audio-${id}`) as HTMLAudioElement | null
    if (!target) {
      setAudioErrors(p => ({ ...p, [id]: 'No preview available' }))
      return
    }
    if (playingId && playingId !== id) {
      const prev = document.getElementById(`audio-${playingId}`) as HTMLAudioElement | null
      prev?.pause()
      if (prev) prev.currentTime = 0
    }
    if (playingId === id) {
      target.pause()
      setPlayingId(null)
      return
    }
    try {
      await target.play()
      setPlayingId(id)
      setAudioErrors(p => { const n = { ...p }; delete n[id]; return n })
    } catch {
      setAudioErrors(p => ({ ...p, [id]: 'Error playing audio' }))
    }
  }

  return (
    <>
      <MusicPacksHero onBrowse={() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      <section className="py-20 px-4 relative" ref={sectionRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />
              <input type="text" placeholder="Search music packs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 text-white focus:border-purple-500 focus:outline-none transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <MusicPackCard key={item.id} item={item} isPlaying={playingId === item.id} error={audioErrors[item.id]} onTogglePlay={togglePlay} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-12">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="decayed" className="group">
                  <FaArrowLeft className="w-4 h-4 mr-2" />
                  <span>Previous</span>
                </Button>
              </motion.div>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <motion.div key={page} whileHover={{ scale: 1.02 }}>
                    <Button onClick={() => setCurrentPage(page)} variant={currentPage === page ? 'infected' : 'toxic'} className="min-w-[40px] px-4">{page}</Button>
                  </motion.div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="decayed" className="group">
                  <span>Next</span>
                  <FaArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          )}
          {items.length === 0 && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 px-6 rounded-lg border border-purple-500/30 bg-purple-500/5">
              <p className="text-gray-400">No music packs found matching your criteria</p>
            </motion.div>
          )}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[200px] flex items-center justify-center">
              <div className="animate-pulse text-purple-500 flex items-center gap-3">
                <FaMusic className="w-6 h-6 animate-spin" />
                <span>Loading...</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}