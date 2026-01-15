'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { FaArrowRight, FaBox, FaMusic } from 'react-icons/fa'
import { useCategories } from '@/app/hooks/useWordPress'
import Button from '@/app/components/Button'
import MusicPackCard, { type MusicPackItem } from '@/app/music-packs/components/MusicPackCard'

type ReleasesResponse = {
  items?: Array<{
    id: string | number
    title: string
    slug: string
    imageUrl?: string | null
    coverImageUrl?: string | null
    previewUrl?: string | null
  }>
}

export default function MusicPacksSection() {
  const [category, setCategory] = useState('')
  const [playingId, setPlayingId] = useState<string | number | null>(null)
  const [audioErrors, setAudioErrors] = useState<Record<string | number, string>>({})

  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  useEffect(() => {
    if (!Array.isArray(categories) || !categories.length) return
    const preferred = ['music pack', 'music-pack', 'packs', 'pack']
    const found = categories.find((c: string) => preferred.some((p) => c.toLowerCase().includes(p)))
    if (found) setCategory(found)
  }, [categories])

  const { data, isLoading } = useSWR(
    category ? ['musicPacksSection', category] : null,
    async () => {
      const params = new URLSearchParams({ page: '1', limit: '6', category })
      const response = await fetch(`/api/releases?${params}`)
      if (!response.ok) throw new Error('Failed to fetch music packs')
      return (await response.json()) as ReleasesResponse
    }
  )

  const items: MusicPackItem[] = useMemo(() => {
    const raw = data?.items || []
    return raw.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      imageUrl: item.imageUrl || item.coverImageUrl || null,
      previewUrl: item.previewUrl || null,
    }))
  }, [data])

  const togglePlay = async (id: string | number) => {
    const target = document.getElementById(`audio-${id}`) as HTMLAudioElement | null
    if (!target) {
      setAudioErrors((p) => ({ ...p, [id]: 'No preview available' }))
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
      setAudioErrors((p) => {
        const n = { ...p }
        delete n[id]
        return n
      })
    } catch {
      setAudioErrors((p) => ({ ...p, [id]: 'Error playing audio' }))
    }
  }

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Music <span className="text-purple-500">Packs</span>
            </motion.h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Curated collections and albums — exclusive drops, preview-ready, and easy to explore.
            </p>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Button href="/music-packs" variant="infected" className="group">
              <FaBox className="w-4 h-4 mr-2" />
              <span>Explore packs</span>
              <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {categoriesLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-black/40 rounded-xl border border-white/10 animate-pulse" />
            ))}
          </div>
        )}

        {!categoriesLoading && !category && (
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-purple-400">
                <FaMusic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Music packs are coming soon</h3>
                <p className="text-gray-400">No matching “Music pack” category found in releases yet.</p>
              </div>
            </div>
            <Link
              href="/music-packs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors border border-purple-500/30"
            >
              <span>Open Music Packs</span>
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {!categoriesLoading && category && isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-black/40 rounded-xl border border-white/10 animate-pulse" />
            ))}
          </div>
        )}

        {!categoriesLoading && category && !isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <MusicPackCard
                  key={item.id}
                  item={item}
                  isPlaying={playingId === item.id}
                  error={audioErrors[item.id]}
                  onTogglePlay={togglePlay}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/music-packs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors border border-purple-500/30"
              >
                <span>Browse all packs</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

