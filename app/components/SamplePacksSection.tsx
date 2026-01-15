'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { FaArrowRight, FaBoxOpen, FaMusic } from 'react-icons/fa'
import { useCategories } from '@/app/hooks/useWordPress'
import Button from '@/app/components/Button'

type ReleaseItem = {
  id: string | number
  title: string
  slug: string
  imageUrl?: string | null
  coverImageUrl?: string | null
  previewUrl?: string | null
}

type ReleasesResponse = {
  items?: ReleaseItem[]
}

function getSamplePackHref(slug: string) {
  if (!slug) return '/sample-packs'
  if (slug.startsWith('http')) return slug
  const normalized = slug.startsWith('/') ? slug.slice(1) : slug
  if (normalized.startsWith('sample-packs')) return `/${normalized}`
  return `/music/${normalized}`
}

export default function SamplePacksSection() {
  const [category, setCategory] = useState('')
  const [playingId, setPlayingId] = useState<string | number | null>(null)
  const [audioErrors, setAudioErrors] = useState<Record<string | number, string>>({})

  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  useEffect(() => {
    if (!Array.isArray(categories) || !categories.length) return
    const preferred = ['sample pack', 'sample-pack']
    const found = categories.find((c: string) => preferred.some((p) => c.toLowerCase().includes(p)))
    if (found) setCategory(found)
  }, [categories])

  const { data, isLoading } = useSWR(
    category ? ['samplePacksSection', category] : null,
    async () => {
      const params = new URLSearchParams({ page: '1', limit: '6', category })
      const response = await fetch(`/api/releases?${params}`)
      if (!response.ok) throw new Error('Failed to fetch sample packs')
      return (await response.json()) as ReleasesResponse
    }
  )

  const items = useMemo(() => data?.items || [], [data])

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
              Sample <span className="text-purple-500">Packs</span>
            </motion.h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              High-quality neurofunk samples — drums, bass, atmospheres, and one-shots ready for your next session.
            </p>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Button href="/sample-packs" variant="infected" className="group">
              <FaBoxOpen className="w-4 h-4 mr-2" />
              <span>Explore sample packs</span>
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
                <h3 className="text-white font-semibold text-lg">Sample packs are coming soon</h3>
                <p className="text-gray-400">No matching “Sample pack” category found in releases yet.</p>
              </div>
            </div>
            <Link
              href="/sample-packs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors border border-purple-500/30"
            >
              <span>Open Sample Packs</span>
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
              {items.map((item, index) => {
                const href = getSamplePackHref(item.slug)
                const imageUrl = item.imageUrl || item.coverImageUrl || null
                const audioId = `audio-${item.id}`

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="group relative aspect-square bg-black/50 backdrop-blur-lg rounded-lg overflow-hidden border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
                  >
                    {item.previewUrl && (
                      <audio id={audioId} preload="none">
                        <source src={item.previewUrl} type="audio/mpeg" />
                      </audio>
                    )}

                    {imageUrl ? (
                      <div className="relative aspect-square">
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">No image</div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{item.title}</h3>

                      <div className="flex gap-3">
                        {item.previewUrl && (
                          <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
                            <Button
                              onClick={(e) => {
                                e.preventDefault()
                                togglePlay(item.id)
                              }}
                              variant="toxic"
                              className="w-full group"
                            >
                              <span>{playingId === item.id ? 'Pause' : audioErrors[item.id] ? 'Error' : 'Preview'}</span>
                            </Button>
                          </motion.div>
                        )}

                        <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
                          {href.startsWith('http') ? (
                            <a
                              href={href}
                              className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              Get pack
                            </a>
                          ) : (
                            <Button href={href} variant="infected" className="w-full group">
                              <span>Get pack</span>
                            </Button>
                          )}
                        </motion.div>
                      </div>

                      {audioErrors[item.id] && (
                        <div className="absolute bottom-20 left-0 right-0 text-center text-red-500 text-sm bg-red-500/10 border border-red-500/30 py-2">
                          {audioErrors[item.id]}
                        </div>
                      )}
                    </div>
                  </motion.article>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/sample-packs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors border border-purple-500/30"
              >
                <span>Browse all sample packs</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

