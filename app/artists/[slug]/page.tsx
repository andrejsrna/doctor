'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { use } from 'react'
import Image from 'next/image'
import MoreFromArtist from '@/app/components/MoreFromArtist'
import { FaSoundcloud, FaSpotify, FaFacebook, FaInstagram } from 'react-icons/fa'
import ArtistContactCTA from '@/app/components/ArtistContactCTA'

interface Artist {
  id: number
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
          full?: {
            source_url?: string
          }
        }
      }
    }>
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ArtistPage({ params }: PageProps) {
  const { slug } = use(params)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchArtist()
  }, [slug])

  const fetchArtist = async () => {
    try {
      const response = await fetch(
        `https://dnbdoctor.com/wp-json/wp/v2/artists?slug=${slug}&_embed`
      )
      const data = await response.json()
      if (data.length > 0) {
        setArtist(data[0])
      }
    } catch (error) {
      console.error('Error fetching artist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getImageUrl = () => {
    const media = artist?._embedded?.['wp:featuredmedia']?.[0]
    return media?.source_url || media?.media_details?.sizes?.full?.source_url
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-500">Loading...</div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Artist not found</div>
      </div>
    )
  }

  const socialLinks = [
    {
      name: 'SoundCloud',
      url: artist.acf?.soundcloud,
      icon: FaSoundcloud,
      color: 'hover:text-orange-500'
    },
    {
      name: 'Spotify',
      url: artist.acf?.spotify,
      icon: FaSpotify,
      color: 'hover:text-green-500'
    },
    {
      name: 'Facebook',
      url: artist.acf?.facebook,
      icon: FaFacebook,
      color: 'hover:text-blue-500'
    },
    {
      name: 'Instagram',
      url: artist.acf?.instagram,
      icon: FaInstagram,
      color: 'hover:text-pink-500'
    }
  ]

  return (
    <>
      <section className="py-32 px-4 relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        
        <article className="max-w-4xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-square rounded-2xl overflow-hidden"
            >
              {getImageUrl() && (
                <Image
                  src={getImageUrl()!}
                  alt={artist.title.rendered}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </motion.div>

            {/* Content Column */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Title wrapper to prevent nested links */}
                <div className="content-wrapper">
                  <h1 
                    className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent 
                      bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
                    dangerouslySetInnerHTML={{ __html: artist.title.rendered }}
                  />
                </div>
                
                {/* Social Links */}
                <div className="flex gap-4 mb-8">
                  {socialLinks.map((link, index) => (
                    link.url && (
                      <motion.a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-full bg-black/30 border border-white/5 ${link.color} 
                          hover:border-purple-500/30 transition-all duration-300 group backdrop-blur-sm`}
                      >
                        <link.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                      </motion.a>
                    )
                  ))}
                </div>

                {/* Content wrapper to prevent nested links */}
                <div className="content-wrapper">
                  <div 
                    className="prose prose-invert prose-purple max-w-none"
                    dangerouslySetInnerHTML={{ __html: artist.content.rendered }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
          <MoreFromArtist 
            artistName={artist.title.rendered}
            currentPostId={artist.id}
          />
        </article>
      </section>
      
      <ArtistContactCTA artistName={artist.title.rendered} />
    </>
  )
} 