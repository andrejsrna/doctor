'use client'

import { motion } from 'framer-motion'
import { FaPlay } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

interface PlaylistCard {
  id: string
  title: string
  description: string
  url: string
  imageUrl: string
  trackCount: number
  featured?: boolean
}

const playlists: PlaylistCard[] = [
  {
    id: 'monthly-selection',
    title: 'Monthly Neurofunk Selection',
    description: 'DNB Doctor Monthly Neurofunk Selection – Dive into the freshest, darkest, and most technical neurofunk cuts hand-picked each month by DNBDoctor.com. Perfect for rolling basslines, razor-sharp drums, and pure dancefloor energy.',
    url: 'https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9',
    imageUrl: '/playlists/monthly.jpg',
    trackCount: 40,
    featured: true
  },
  {
    id: 'our-releases',
    title: 'DNB Doctor Exclusives',
    description: 'Exclusive collection of tracks released by DNB Doctor artists. From YEHOR and Asana to Warp Fa2e and more - discover the best neurofunk from our label.',
    url: 'https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP?si=4857d6cfb8154f51',
    imageUrl: '/playlists/ours.jpg',
    trackCount: 30
  }
]

export default function SpotifyPlaylists() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.1)_0%,_transparent_100%)] opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(168,85,247,0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(168,85,247,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-purple-500/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Spotify Playlists
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Discover the finest neurofunk selections curated by DNB Doctor
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="relative bg-gradient-to-br from-purple-900/20 via-black/40 to-green-900/20 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {playlist.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-purple-500 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      FEATURED
                    </span>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-green-500 p-1">
                      <Image
                        src={playlist.imageUrl}
                        alt={playlist.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {playlist.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                    {playlist.description}
                  </p>

                  <Link
                    href={playlist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                  >
                    <FaPlay className="text-sm" />
                    Listen on Spotify
                  </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 text-sm">
            Follow our playlists for the latest neurofunk releases and exclusive DNB Doctor content
          </p>
        </motion.div>
      </div>
    </section>
  )
} 