'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaBox, FaMusic, FaCompactDisc } from 'react-icons/fa'
import Button from '../../components/Button'

type Props = {
  onBrowse: () => void
}

export default function MusicPacksHero({ onBrowse }: Props) {
  return (
    <div className="relative h-[75vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/music-bg.jpeg" 
          alt="Music Packs - DNB Doctor Collections" 
          fill 
          sizes="100vw"
          className="object-cover" 
          priority 
          quality={90}
        />
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/50 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-[1] opacity-20">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear" 
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0] 
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "linear" 
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Icon Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center gap-4 mb-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaMusic className="w-12 h-12 text-purple-400" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <FaCompactDisc className="w-12 h-12 text-pink-400" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <FaBox className="w-12 h-12 text-purple-500" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2, duration: 0.8 }} 
          className="text-5xl md:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 animate-gradient">
            Music Packs
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4, duration: 0.8 }} 
          className="text-xl md:text-3xl text-gray-200 mb-4 font-light"
        >
          Curated Collections & Albums
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5, duration: 0.8 }} 
          className="text-base md:text-lg text-gray-400 mb-10 max-w-2xl mx-auto"
        >
          Discover exclusive music collections featuring the best neurofunk tracks from DNB Doctor artists
        </motion.p>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6, duration: 0.8 }} 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            variant="infected" 
            onClick={onBrowse} 
            className="group text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300"
          >
            <span>Browse Collections</span>
            <FaBox className="w-5 h-5 ml-2 group-hover:rotate-180 transition-transform duration-500" />
          </Button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[2]" />
    </div>
  )
}

