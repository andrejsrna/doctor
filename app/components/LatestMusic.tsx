'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import StreamingMenu from '@/app/components/StreamingMenu'

interface Release {
  id: string
  title: string
  artistName: string | null
  coverImageUrl: string | null
  previewUrl: string | null
  slug: string
  spotify: string | null
  appleMusic: string | null
  beatport: string | null
  bandcamp: string | null
  soundcloud: string | null
  categories: string[]
  publishedAt: string | null
  content: string | null
}

export default function LatestMusic() {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReleases() {
      try {
        const response = await fetch('/api/releases?limit=6')
        const data = await response.json()
        setReleases(data.items || [])
      } catch (error) {
        console.error('Error fetching releases:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReleases()
  }, [])

  const formatDate = (date: string | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getReleaseType = (categories: string[]) => {
    // Simple logic to determine release type based on categories or title
    const categoryStr = categories.join(' ').toLowerCase()
    const titleStr = releases.find(r => r.categories === categories)?.title.toLowerCase() || ''
    
    if (categoryStr.includes('ep') || titleStr.includes('ep')) return 'EP'
    if (categoryStr.includes('lp') || titleStr.includes('lp') || titleStr.includes('album')) return 'LP'
    return 'Single'
  }


  const getExcerpt = (content: string | null, maxLength: number = 120) => {
    if (!content) return ''
    
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    
    if (plainText.length <= maxLength) return plainText
    
    // Find the last complete word within the limit
    const truncated = plainText.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    
    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...'
    }
    
    return truncated + '...'
  }

  if (loading) {
    return (
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Latest Releases
            </h2>
            <p className="text-gray-400 text-lg">
              Loading latest music...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
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
          Latest <span className="text-purple-500">Releases</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {releases.map((release, index) => (
            <motion.article
              key={release.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              {/* Cover Art */}
              <div className="relative aspect-square">
                {release.coverImageUrl ? (
                  <Image
                    src={release.coverImageUrl}
                    alt={release.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tags and Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                      {getReleaseType(release.categories)}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {formatDate(release.publishedAt)}
                    </span>
                  </div>
                </div>

                {/* Title and Artist */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                    {release.title}
                  </h3>
                  {release.artistName && (
                    <p className="text-purple-400 text-sm">
                      {release.artistName}
                    </p>
                  )}
                </div>

                {/* Description Excerpt */}
                {release.content && (
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {getExcerpt(release.content, 100)}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Primary Listen Button */}
                  <Link
                    href={`/music/${release.slug}`}
                    className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors text-center"
                  >
                    Listen
                  </Link>
                  
                  {/* Streaming Menu */}
                  <StreamingMenu
                    spotify={release.spotify}
                    appleMusic={release.appleMusic}
                    beatport={release.beatport}
                    bandcamp={release.bandcamp}
                    soundcloud={release.soundcloud}
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Browse All Releases Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/music"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors border border-purple-500/30"
          >
            <span>Browse all releases</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
} 