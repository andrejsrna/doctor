'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { FaArrowRight, FaHeadphones, FaWaveSquare } from 'react-icons/fa'
import Button from '@/app/components/Button'
import { sanitizeHtml } from '@/lib/sanitize'

type NewsItem = {
  id: string
  slug: string
  title: string
  coverImageUrl?: string | null
  publishedAt?: string | null
}

type NewsResponse = {
  items?: NewsItem[]
}

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').trim()
}

export default function NeurofunkDnBMixesSection() {
  const { data, isLoading } = useSWR(['mixesSection'], async () => {
    const params = new URLSearchParams({ page: '1', limit: '4', category: 'Mixes' })
    const res = await fetch(`/api/news?${params}`)
    if (!res.ok) throw new Error('Failed to fetch mixes')
    return (await res.json()) as NewsResponse
  })

  const mixes = useMemo(() => data?.items || [], [data])

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
              Neurofunk DnB <span className="text-purple-500">Mixes</span>
            </motion.h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Fresh DJ sets and curated showreels tagged under “Mixes” — hit play and binge the newest drops.
            </p>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Button href="/neurofunk-dnb-mixes" variant="infected" className="group">
              <FaHeadphones className="w-4 h-4 mr-2" />
              <span>Explore mixes</span>
              <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[190px] bg-black/40 rounded-2xl border border-white/10 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && mixes.length === 0 && (
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-8 flex items-start gap-4">
            <div className="mt-1 text-purple-400">
              <FaWaveSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">No mixes published yet</h3>
              <p className="text-gray-400">As soon as something lands in the “Mixes” category, it will show up here.</p>
            </div>
          </div>
        )}

        {!isLoading && mixes.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {mixes.map((mix, index) => {
                const safeTitle = sanitizeHtml(mix.title)
                const alt = stripHtml(safeTitle) || 'Mix cover'
                return (
                  <motion.article
                    key={mix.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="group relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 overflow-hidden"
                  >
                    <Link href={`/news/${mix.slug}`} className="grid grid-cols-[1.4fr_1fr] min-h-[190px]">
                      <div className="p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                              Mixes
                            </span>
                            <span className="text-gray-400 text-xs">{formatDate(mix.publishedAt)}</span>
                          </div>
                          <h3
                            className="text-xl font-semibold mt-3 mb-2 group-hover:text-purple-100 transition-colors"
                            dangerouslySetInnerHTML={{ __html: safeTitle }}
                          />
                          <p className="text-gray-400 text-sm line-clamp-2">
                            Dark rollers, halftime pivots, and cinematic pressure — curated for late-night systems.
                          </p>
                        </div>

                        <span className="text-sm text-purple-200 flex items-center gap-2 group-hover:text-white">
                          Listen now
                          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </span>
                      </div>

                      <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/35 via-black/40 to-green-500/10" />
                        {mix.coverImageUrl ? (
                          <Image
                            src={mix.coverImageUrl}
                            alt={alt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 40vw, 30vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                            No image
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/neurofunk-dnb-mixes"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors border border-purple-500/30"
              >
                <span>Browse all mixes</span>
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

