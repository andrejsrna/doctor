'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import AudioPreview from '@/app/components/AudioPreview'

interface ReleaseHeroProps {
  title: string
  imageUrl: string | undefined
  previewUrl: string | null
  isPlaying: boolean
  onPlayPause: () => void
}

const ReleaseHero = ({ title, imageUrl, previewUrl, isPlaying, onPlayPause }: ReleaseHeroProps) => (
  <div className="relative">
    <div className="fixed inset-0 z-0">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
    </div>
    <div className="relative z-10 min-h-[60vh] flex items-center justify-center px-4 py-32">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.01,
            skewX: 0.5,
            skewY: -0.5
          }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mb-8
            drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] cursor-pointer"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AudioPreview
              url={previewUrl}
              isPlaying={isPlaying}
              onPlayPause={onPlayPause}
            />
          </motion.div>
        )}
      </div>
    </div>
  </div>
)

export default ReleaseHero 