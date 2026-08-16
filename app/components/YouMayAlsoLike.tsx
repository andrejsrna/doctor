'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaPlay, FaSkull, FaFire } from 'react-icons/fa'
import Button from './Button'

interface Recommended {
  id: string
  slug: string
  title: string
  artistName: string | null
  previewUrl?: string | null
  imageUrl?: string | null
}

interface YouMayAlsoLikeProps {
  currentSlug: string
}

export default function YouMayAlsoLike({ currentSlug }: YouMayAlsoLikeProps) {
  const [items, setItems] = useState<Recommended[]>([])
  const [visible, setVisible] = useState<Recommended[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [audioErrors, setAudioErrors] = useState<Record<string, string>>({})

  const PAGE_SIZE = 8

  const loadPage = useCallback(async (pageNum: number) => {
    const res = await fetch(
      `/api/releases/recommended?slug=${encodeURIComponent(currentSlug)}&page=${pageNum}&limit=${PAGE_SIZE}`
    )
    if (!res.ok) throw new Error('Failed to load')
    return res.json()
  }, [currentSlug])

  useEffect(() => {
    let active = true
    loadPage(1)
      .then((data) => {
        if (!active) return
        setItems(data.items || [])
        setVisible(data.items || [])
        setHasMore(!!data.hasMore)
        setPage(1)
      })
      .catch(() => active && setError('Failed to load recommendations'))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
      audio?.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug])

  const handleLoadMore = async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)
    try {
      const next = page + 1
      const data = await loadPage(next)
      setItems((prev) => [...prev, ...(data.items || [])])
      setVisible((prev) => [...prev, ...(data.items || [])])
      setHasMore(!!data.hasMore)
      setPage(next)
    } catch {
      setError('Failed to load more')
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handlePlay = async (item: Recommended) => {
    if (!item.previewUrl) return
    try {
      if (playingId === item.id) {
        audio?.pause()
        setPlayingId(null)
        return
      }
      if (audio) audio.pause()
      const newAudio = new Audio(item.previewUrl)
      await newAudio.play()
      setAudio(newAudio)
      setPlayingId(item.id)
      setAudioErrors((prev) => ({ ...prev, [item.id]: '' }))
    } catch {
      setAudioErrors((prev) => ({ ...prev, [item.id]: 'Failed to play preview' }))
    }
  }

  useEffect(() => () => { audio?.pause() }, [audio])

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 pt-16 border-t border-purple-500/20"
      >
        <div className="h-8 w-64 bg-purple-500/20 rounded mb-8 mx-auto" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-black/30 rounded-xl p-4">
              <div className="aspect-square bg-purple-500/20 rounded-lg mb-4" />
              <div className="h-5 w-3/4 bg-purple-500/20 rounded mb-2" />
              <div className="h-4 w-1/2 bg-purple-500/20 rounded" />
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  if (error || visible.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 pt-16 border-t border-purple-500/20"
    >
      <div className="flex items-center justify-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="mr-3"
        >
          <FaFire className="w-6 h-6 text-green-500" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent
          bg-gradient-to-r from-green-500 via-purple-500 to-green-500">
          You May Also Like
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {visible.map((item) => (
          <div key={item.id} className="group relative">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src={item.imageUrl || '/placeholder.jpg'}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                flex flex-col justify-end p-4">
                <h3 className="font-bold text-white mb-3 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-gray-300 mb-3 line-clamp-1">
                  {item.artistName || 'DnB Doctor'}
                </p>
                <div className="flex gap-2">
                  {item.previewUrl && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        handlePlay(item)
                      }}
                      variant="toxic"
                      size="sm"
                      className="flex-1 !min-w-0"
                    >
                      <FaPlay className="w-3 h-3 mr-1.5" />
                      {playingId === item.id ? 'Pause' : audioErrors[item.id] ? 'Error' : 'Preview'}
                    </Button>
                  )}
                  <Button
                    href={`/music/${item.slug}`}
                    variant="infected"
                    size="sm"
                    className="flex-1 !min-w-0"
                  >
                    Open
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-3 px-1">
              <Link href={`/music/${item.slug}`} className="block">
                <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1">{item.artistName || 'DnB Doctor'}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <motion.div whileHover={{ scale: 1.02 }} className="inline-block">
            <Button onClick={handleLoadMore} variant="decayed" disabled={isLoadingMore}>
              <FaSkull className="w-4 h-4 mr-2 animate-pulse" />
              <span>{isLoadingMore ? 'Loading...' : 'Load More'}</span>
            </Button>
          </motion.div>
        </div>
      )}

      {error && <p className="text-center text-red-500 text-sm mt-4">{error}</p>}
    </motion.div>
  )
}
