'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaYoutube } from 'react-icons/fa'
import Button from '@/app/components/Button'
import { trackStreamingClick } from '@/app/utils/analytics'

interface ReleaseHeroProps {
  title: string
  imageUrl: string | undefined
  beatportUrl: string | undefined
  youtubeUrl: string | undefined
  description: string
}

export default function ReleaseHero({
  title,
  imageUrl,
  beatportUrl,
  youtubeUrl,
  description,
}: ReleaseHeroProps) {
  const handleStreamingClick = (platform: string) => {
    trackStreamingClick(platform)
  }

  return (
    <div className="relative flex items-center justify-center text-center px-4 pt-48 pb-24">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center z-0"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          quality={85}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/50 z-10" />

      <div className="relative z-20 space-y-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-4xl md:text-7xl font-extrabold text-white
            drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
          className="prose prose-invert prose-lg text-gray-300 mx-auto"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {youtubeUrl && (
            <a 
              href={youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => handleStreamingClick('YouTube')}
            >
              <Button variant="infected" size="lg" className="group">
                <FaYoutube className="w-6 h-6 mr-3" />
                Listen on YouTube
              </Button>
            </a>
          )}
          {beatportUrl && (
            <a 
              href={beatportUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => handleStreamingClick('Beatport')}
            >
              <Button variant="toxic" size="lg" className="group">
                <Image
                  src="/beatport.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 mr-3"
                />
                Buy on Beatport
              </Button>
            </a>
          )}
        </motion.div>
      </div>
    </div>
  )
} 