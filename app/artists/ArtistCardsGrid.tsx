'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaSoundcloud, FaSpotify } from 'react-icons/fa'

export type ArtistCardItem = {
  id: string
  slug: string
  name: string
  imageUrl?: string | null
  soundcloud?: string | null
  spotify?: string | null
}

export default function ArtistCardsGrid({ artists }: { artists: ArtistCardItem[] }) {
  const shouldReduce = useReducedMotion()

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {artists.map((artist, index) => (
        <motion.article
          key={artist.id}
          initial={shouldReduce ? undefined : { opacity: 0, y: 20 }}
          whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
          viewport={shouldReduce ? undefined : { once: true }}
          transition={shouldReduce ? undefined : { delay: index * 0.05 }}
          className="group relative"
        >
          <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
            {artist.imageUrl && (
              <Image
                src={artist.imageUrl}
                alt={`Neurofunk artist ${artist.name}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                placeholder="blur"
                blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex gap-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
              {artist.soundcloud && (
                <a
                  href={artist.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white hover:text-purple-500 transition-colors"
                >
                  <FaSoundcloud className="inline-block mr-2" />
                  SoundCloud
                </a>
              )}
              {artist.spotify && (
                <a
                  href={artist.spotify}
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

          <Link href={`/artists/${artist.slug}`} className="block">
            <h2 className="text-2xl font-bold group-hover:text-purple-500 transition-colors">
              {artist.name}
            </h2>
          </Link>
        </motion.article>
      ))}
    </div>
  )
}

