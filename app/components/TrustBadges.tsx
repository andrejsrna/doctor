'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaApple, FaSpotify } from 'react-icons/fa'

interface Badge {
  name: string
  image: string | React.ComponentType<{ className?: string; size?: number }>
  description: string
}

const badges: Badge[] = [
  {
    name: 'Beatport Featured',
    image: 'beatport.svg',
    description: 'Featured on Beatport'
  },
  {
    name: 'Spotify Editorial',
    image: FaSpotify,
    description: 'Featured in Spotify Playlists'
  },
  {
    name: 'Apple Music',
    image: FaApple,
    description: 'Apple Music Partner'
  },
  {
    name: 'Quality Assured',
    image: '/badges/quality-assured.svg',
    description: 'High Quality Audio'
  }
]

export default function TrustBadges() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-lg bg-black/30 border border-white/5 
                hover:border-purple-500/30 transition-all duration-300 group backdrop-blur-sm"
            >
              {typeof badge.image === 'string' ? (
                <Image
                  src={badge.image}
                  alt=""
                  width={64}
                  height={64}
                  className="mb-3 transition-transform duration-300 group-hover:scale-110"
                  />
              ) : (
                <badge.image className="mb-3 w-16 h-16 transition-transform duration-300 group-hover:scale-110" size={64} />
              )}
              <h3 className="font-medium text-purple-500 mb-1">{badge.name}</h3>
              <p className="text-sm text-gray-400">{badge.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
} 