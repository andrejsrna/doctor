'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaSoundcloud, FaTimes, FaHeadphones, FaApple } from 'react-icons/fa'
import Image from 'next/image'

interface StreamingModalProps {
  isOpen: boolean
  onClose: () => void
}

const streamingServices = [
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/dnbdoctor',
    icon: FaSoundcloud,
    color: 'orange',
    bgGradient: 'from-orange-500/20 to-orange-600/20',
    borderColor: 'orange-500',
    description: 'Follow us for exclusive content and previews'
  },
  {
    name: 'Spotify',
    url: 'https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP?si=22189a0e625f4768',
    icon: ({ className }: { className?: string }) => (
      <svg viewBox="0 0 24 24" className={className}>
        <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
    color: 'green',
    bgGradient: 'from-green-500/20 to-green-600/20',
    borderColor: 'green-500',
    description: 'Stream our tracks and playlists'
  },
  {
    name: 'TIDAL',
    url: 'https://tidal.com/browse/artist/42587754?u',
    icon: ({ className }: { className?: string }) => (
      <svg viewBox="0 0 24 24" className={className}>
        <path fill="currentColor" d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l-4.004 4.004 4.004 4.004 4.004-4.004L12.012 12l4.004-4.004-4.004-4.004zM16.016 7.996l4.004-4.004L24.024 7.996l-4.004 4.004z" />
      </svg>
    ),
    color: 'blue',
    bgGradient: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'blue-500',
    description: 'High-quality audio streaming'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@dnbdoctor1',
    icon: ({ className }: { className?: string }) => (
      <svg viewBox="0 0 24 24" className={className}>
        <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: 'red',
    bgGradient: 'from-red-500/20 to-red-600/20',
    borderColor: 'red-500',
    description: 'Watch music videos and live sessions'
  },
  {
    name: 'Deezer',
    url: 'https://deezer.page.link/8LkCsRmPWNVLgbGm9',
    icon: ({ className }: { className?: string }) => (
      <svg viewBox="0 0 24 24" className={className}>
        <path fill="currentColor" d="M18.81 4.16v3.03H24V4.16h-5.19zM6.27 8.38v3.027h5.189V8.38h-5.19zm12.54 0v3.027H24V8.38h-5.19zM6.27 12.594v3.027h5.189v-3.027h-5.19zm6.271 0v3.027h5.19v-3.027h-5.19zm6.27 0v3.027H24v-3.027h-5.19zM0 16.81v3.029h5.19v-3.03H0zm6.27 0v3.029h5.189v-3.03h-5.19zm6.271 0v3.029h5.19v-3.03h-5.19zm6.27 0v3.029H24v-3.03h-5.19z" />
      </svg>
    ),
    color: 'pink',
    bgGradient: 'from-pink-500/20 to-pink-600/20',
    borderColor: 'pink-500',
    description: 'Stream and create playlists'
  },
  {
    name: 'Apple Music',
    url: 'https://music.apple.com/us/artist/dnb-doctor/1669888444',
    icon: FaApple,
    color: 'purple',
    bgGradient: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'purple-500',
    description: 'Stream and create playlists'
  }
]

export default function StreamingModal({ isOpen, onClose }: StreamingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-gradient-to-b from-black/95 to-purple-900/20 
                border border-purple-500/20 rounded-2xl backdrop-blur-sm relative 
                shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden my-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <Image
                  src="/pattern.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="relative p-4 sm:p-8">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 text-purple-500/70 
                    hover:text-purple-500 transition-colors p-2 rounded-full hover:bg-purple-500/10"
                  aria-label="Close modal"
                >
                  <FaTimes className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 
                    rounded-full bg-purple-500/20 mb-3 sm:mb-4">
                    <FaHeadphones className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-clip-text text-transparent 
                    bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
                    Choose Your Platform
                  </h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    Listen to DnB Doctor on your favorite streaming service
                  </p>
                </div>

                {/* Streaming Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {streamingServices.map((service) => (
                    <motion.a
                      key={service.name}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl 
                        bg-gradient-to-br ${service.bgGradient} 
                        border border-${service.borderColor}/30 hover:border-${service.borderColor}/50 
                        transition-all duration-300 group hover:shadow-lg hover:-translate-y-0.5`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <service.icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${service.color}-500 flex-shrink-0`} />
                      <div>
                        <h3 className={`text-base sm:text-lg font-semibold text-${service.color}-500 mb-0.5 sm:mb-1`}>
                          {service.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          {service.description}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 