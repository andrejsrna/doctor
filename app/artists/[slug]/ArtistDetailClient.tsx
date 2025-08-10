'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import MoreFromArtist from '@/app/components/MoreFromArtist'
import { FaSoundcloud, FaSpotify, FaFacebook, FaInstagram } from 'react-icons/fa'
import ArtistContactCTA from '@/app/components/ArtistContactCTA'
import RelatedNews from '@/app/components/RelatedNews'
import { sanitizeHtml } from '@/app/utils/sanitize'

export type ArtistDetail = {
  id: string
  slug: string
  name: string
  bio?: string | null
  imageUrl?: string | null
  soundcloud?: string | null
  spotify?: string | null
  facebook?: string | null
  instagram?: string | null
}

export default function ArtistDetailClient({ artist }: { artist: ArtistDetail }) {
  const socials = [
    { name: 'SoundCloud', url: artist.soundcloud, icon: FaSoundcloud, color: 'hover:text-orange-500' },
    { name: 'Spotify', url: artist.spotify, icon: FaSpotify, color: 'hover:text-green-500' },
    { name: 'Facebook', url: artist.facebook, icon: FaFacebook, color: 'hover:text-blue-500' },
    { name: 'Instagram', url: artist.instagram, icon: FaInstagram, color: 'hover:text-pink-500' },
  ]

  return (
    <>
      <section className="py-32 px-4 relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />

        <article className="max-w-4xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative aspect-square rounded-2xl overflow-hidden">
              {artist.imageUrl && (
                <Image
                  src={artist.imageUrl}
                  alt={artist.name}
                  fill
                  className="object-cover"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                />
              )}
            </motion.div>

            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="content-wrapper">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
                    {artist.name}
                  </h1>
                </div>

                <div className="flex gap-4 mb-8">
                  {socials.map((link, index) => (
                    link.url && (
                      <motion.a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-full bg-black/30 border border-white/5 ${link.color} hover:border-purple-500/30 transition-all duration-300 group backdrop-blur-sm`}
                      >
                        <link.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                      </motion.a>
                    )
                  ))}
                </div>

                <div className="content-wrapper">
                  {artist.bio && (
                    <div className="prose prose-invert prose-purple max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(artist.bio) }} />
                  )}
                </div>
              </motion.div>
            </div>
          </div>
          <MoreFromArtist artistName={artist.name} currentPostId={artist.id} />
          <RelatedNews currentPostId={0} relatedBy={artist.name} />
        </article>
      </section>

      <ArtistContactCTA artistName={artist.name} />
    </>
  )
}


