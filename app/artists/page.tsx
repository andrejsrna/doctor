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
      const response = await fetch('https://admin.dnbdoctor.com/wp-json/wp/v2/artists?_embed')
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
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Neurofunk Artists and Producers",
            "description": "Top neurofunk artists and producers in the drum and bass scene",
            "url": "https://dnbdoctor.com/artists",
            "numberOfItems": artists.length,
            "itemListElement": artists.map((artist, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "MusicGroup",
                "name": artist.title.rendered,
                "description": `Neurofunk artist and producer - ${artist.title.rendered}`,
                "url": `https://dnbdoctor.com/artists/${artist.slug}`,
                "image": getImageUrl(artist),
                "genre": "Neurofunk",
                "sameAs": [
                  artist.acf?.soundcloud,
                  artist.acf?.spotify,
                  artist.acf?.facebook,
                  artist.acf?.instagram
                ].filter(Boolean)
              }
            }))
          })
        }}
      />

      <section className="py-32 px-4 relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
        >
          Neurofunk Artists
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto"
        >
          Discover the best neurofunk artists and producers pushing the boundaries of drum and bass. 
          Meet top neurofunk producers creating the most innovative sounds in the scene.
        </motion.p>

        {/* SEO Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">
            Top <span className="text-purple-500">Neurofunk Producers</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-3">Innovative Sound Design</h3>
              <p className="text-gray-300 text-sm">
                Our neurofunk artists are known for their cutting-edge sound design, 
                creating complex basslines and atmospheric elements that define the genre.
              </p>
            </div>
            <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-3">Technical Precision</h3>
              <p className="text-gray-300 text-sm">
                Meet neurofunk producers who master the technical aspects of drum and bass, 
                delivering precise rhythms and rolling basslines that drive the scene forward.
              </p>
            </div>
            <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-3">Genre Pioneers</h3>
              <p className="text-gray-300 text-sm">
                Discover neurofunk artists who are pushing the boundaries of the genre, 
                creating fresh sounds and innovative approaches to drum and bass production.
              </p>
            </div>
          </div>
        </motion.div>

        <h3 className="text-2xl font-bold mb-8 text-center text-white">
          Featured <span className="text-purple-500">Neurofunk Artists</span>
        </h3>
        
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
                    alt={`Neurofunk artist ${artist.title.rendered}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Social Links and View More */}
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
                  <Link 
                    href={`/artists/${artist.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-white hover:text-purple-500 transition-colors"
                  >
                    View More
                  </Link>
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
    </>
  )
} 