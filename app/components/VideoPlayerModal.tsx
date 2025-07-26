'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import Button from './Button'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  youtubeUrl: string | undefined
  soundcloudUrl: string | undefined
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  youtubeUrl,
  soundcloudUrl,
}: VideoPlayerModalProps) {
  const getEmbedUrl = () => {
    if (youtubeUrl) {
      const videoId = new URL(youtubeUrl).searchParams.get('v')
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
    if (soundcloudUrl) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(
        soundcloudUrl
      )}&auto_play=true`
    }
    return ''
  }

  const embedUrl = getEmbedUrl()

  return (
    <AnimatePresence>
      {isOpen && embedUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-3xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="toxic"
              onClick={onClose}
              className="absolute -top-12 right-0 !p-2 z-10"
            >
              <FaTimes className="w-6 h-6" />
            </Button>
            <iframe
              src={embedUrl}
              className="w-full h-full rounded-lg shadow-2xl shadow-purple-500/20"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 