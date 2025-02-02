'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaSoundcloud, FaSpotify } from 'react-icons/fa'

interface Artist {
  id: number
  slug: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  acf: {
    soundcloud?: string
    facebook?: string
    instagram?: string
    spotify?: string
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string
      media_details?: {
        sizes?: {
          large?: {
            source_url?: string
          }
        }
      }
    }>
  }
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      const response = await fetch('https://dnbdoctor.com/wp-json/wp/v2/artists?_embed')
      if (!response.ok) {
        throw new Error('Failed to fetch artists')
      }
      const data = await response.json()
      setArtists(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching artists:', error)
      setError('Failed to load artists. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const getImageUrl = (artist: Artist) => {
    const media = artist._embedded?.['wp:featuredmedia']?.[0]
    return media?.media_details?.sizes?.large?.source_url || media?.source_url || '/default-artist.jpg'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <section className="py-32 px-4 relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
        >
          Our Artists
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist, index) => (
            <motion.article
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                {getImageUrl(artist) && (
                  <Image
                    src={getImageUrl(artist)!}
                    alt={artist.title.rendered}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Social Links - moved outside of Link */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-4 opacity-0 translate-y-4 
                  group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                  {artist.acf?.soundcloud && (
                    <a href={artist.acf.soundcloud} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-white hover:text-purple-500 transition-colors"
                    >
                      <FaSoundcloud className="inline-block mr-2" />
                      SoundCloud
                    </a>
                  )}
                  {artist.acf?.spotify && (
                    <a href={artist.acf.spotify} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-white hover:text-purple-500 transition-colors"
                    >
                      <FaSpotify className="inline-block mr-2" />
                      Spotify
                    </a>
                  )}
                </div>
              </div>

              {/* Artist Link */}
              <Link href={`/artists/${artist.slug}`} className="block">
                <h2 
                  className="text-2xl font-bold group-hover:text-purple-500 transition-colors"
                  dangerouslySetInnerHTML={{ __html: artist.title.rendered }}
                />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
} 