'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight, FaSoundcloud } from 'react-icons/fa'

interface Artist {
  id: number
  slug: string
  title: {
    rendered: string
  }
  acf: {
    role: string
    soundcloud: string
    description: string
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

export default function FeaturedArtists() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch(
          'https://admin.dnbdoctor.com/wp-json/wp/v2/artists?per_page=3&orderby=date&featured=1&_embed',
          { next: { revalidate: 3600 } }
        )
        const data = await response.json()
        setArtists(data)
      } catch (error) {
        console.error('Error fetching artists:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtists()
  }, [])

  // Helper function to get the best available image URL
  const getImageUrl = (artist: Artist) => {
    return artist._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url ||
           artist._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
           '/placeholder-artist.jpg' // fallback image
  }

  if (isLoading) {
    return (
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse text-purple-500">Loading artists...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/pattern.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
              bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
          >
            Featured Artists
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Meet the talented producers and DJs behind our signature neurofunk sound
          </motion.p>
        </div>

        {/* Artists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden 
                border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                <Link 
                  href={`/artists/${artist.slug}`}
                  className="block absolute inset-0 z-10"
                >
                  <span className="sr-only">View {artist.title.rendered}&apos;s profile</span>
                </Link>
                
                <Image
                  src={getImageUrl(artist)}
                  alt={artist.title.rendered}
                  fill
                  className="object-cover transition-transform duration-500 
                    group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Artist Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {artist.title.rendered}
                  </h3>
                  <p className="text-purple-400 mb-3">{artist.acf.role}</p>
                  <p className="text-gray-300 line-clamp-2 mb-4">
                    {artist.acf.description}
                  </p>
                  
                  {/* SoundCloud Link */}
                  <a 
                    href={artist.acf.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-20 inline-flex items-center gap-2 text-orange-500 
                      hover:text-orange-400 transition-colors"
                  >
                    <FaSoundcloud className="w-5 h-5" />
                    <span>Listen on SoundCloud</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/artists"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl 
              bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium 
              hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Meet All Artists
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
} 