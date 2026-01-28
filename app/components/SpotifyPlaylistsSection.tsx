'use client'

import { motion } from 'framer-motion'
import { FaSpotify } from 'react-icons/fa'
import Button from '@/app/components/Button'
import type { SpotifyPlaylist } from '@/app/components/data/spotifyPlaylists'
import { spotifyPlaylistEmbedUrl, spotifyPlaylistUrl } from '@/app/components/data/spotifyPlaylists'

type Cta = {
  href: string
  label: string
  variant?: 'toxic' | 'infected' | 'decayed'
  external?: boolean
}

type Props = {
  title: React.ReactNode
  description?: string
  playlists: SpotifyPlaylist[]
  ctas?: Cta[]
  showEmbeds?: boolean
}

export default function SpotifyPlaylistsSection({
  title,
  description,
  playlists,
  ctas = [],
  showEmbeds = true,
}: Props) {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {title}
            </motion.h2>
            {description ? <p className="text-gray-300 text-lg leading-relaxed">{description}</p> : null}
          </div>

          {ctas.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap gap-4">
              {ctas.map((cta) => (
                <Button
                  key={`${cta.href}-${cta.label}`}
                  href={cta.href}
                  variant={cta.variant ?? 'toxic'}
                  target={cta.external ? '_blank' : undefined}
                  rel={cta.external ? 'noopener noreferrer' : undefined}
                >
                  <FaSpotify className="w-4 h-4" />
                  {cta.label}
                </Button>
              ))}
            </motion.div>
          ) : null}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{playlist.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{playlist.description}</p>
                  </div>
                  <a
                    href={spotifyPlaylistUrl(playlist.playlistId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors border border-green-500/30 whitespace-nowrap"
                  >
                    <FaSpotify className="w-4 h-4" />
                    <span className="text-sm">Open</span>
                  </a>
                </div>
              </div>

              {showEmbeds ? (
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: 0 }}
                  src={spotifyPlaylistEmbedUrl(playlist.playlistId)}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`Spotify playlist: ${playlist.title}`}
                />
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

