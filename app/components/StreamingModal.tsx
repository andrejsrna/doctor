'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaSoundcloud, FaTimes, FaApple, FaSyringe, FaVirus, FaBiohazard, FaSkull } from 'react-icons/fa'
import Image from 'next/image'
import Button from './Button'

interface StreamingModalProps {
  isOpen: boolean
  onClose: () => void
}

const streamingServices = [
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/dnbdoctor',
    icon: FaSoundcloud,
    description: 'Infect your ears with exclusive content'
  },
  {
    name: 'Spotify',
    url: 'https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP?si=22189a0e625f4768',
    icon: ({ className }: { className?: string }) => (
      <svg viewBox="0 0 24 24" className={className}>
        <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
    description: 'Let the rhythm disease spread'
  },
  {
    name: 'TIDAL',
    url: 'https://tidal.com/browse/artist/42587754?u',
    icon: ({ className }: { className?: string }) => (
      <svg viewBox="0 0 24 24" className={className}>
        <path fill="currentColor" d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l-4.004 4.004 4.004 4.004 4.004-4.004L12.012 12l4.004-4.004-4.004-4.004zM16.016 7.996l4.004-4.004L24.024 7.996l-4.004 4.004z" />
      </svg>
    ),
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
    description: 'Stream and create playlists'
  },
  {
    name: 'Apple Music',
    url: 'https://music.apple.com/us/artist/dnb-doctor/1669888444',
    icon: FaApple,
    description: 'Contaminate your playlists'
  }
]

export default function StreamingModal({ isOpen, onClose }: StreamingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with animated infection spread */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Infection Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: -20,
                    opacity: 0
                  }}
                  animate={{ 
                    y: window.innerHeight + 20,
                    opacity: [0, 1, 1, 0],
                    rotate: 360
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute text-purple-500/30"
                >
                  <FaVirus className="w-8 h-8" />
                </motion.div>
              ))}
            </div>

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-black/95 border border-purple-500/30 rounded-2xl 
                backdrop-blur-sm relative overflow-hidden my-4
                shadow-[0_0_30px_rgba(168,85,247,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Background Effects */}
              <div className="absolute inset-0">
                {/* Pulsing gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30 animate-pulse" />
                
                {/* Animated grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Moving infection spots */}
                <div className="absolute inset-0">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-32 h-32 rounded-full bg-purple-500/5 blur-xl"
                      initial={{
                        x: Math.random() * 100 - 50,
                        y: Math.random() * 100 - 50,
                      }}
                      animate={{
                        x: Math.random() * 100 - 50,
                        y: Math.random() * 100 - 50,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                  ))}
                </div>

                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-2xl border border-purple-500/20 shadow-[inset_0_0_30px_rgba(168,85,247,0.2)]" />
              </div>

              {/* Content */}
              <div className="relative p-4 sm:p-8">
                {/* Close Button */}
                <Button
                  variant="toxic"
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 !p-2 group"
                >
                  <FaTimes className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </Button>

                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20 
                    }}
                    className="inline-flex items-center justify-center w-20 h-20 
                      rounded-full bg-purple-500/20 mb-4 relative group
                      before:absolute before:inset-0 before:rounded-full 
                      before:bg-gradient-to-r before:from-purple-500/20 before:to-pink-500/20 
                      before:animate-spin-slow"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                      blur-xl group-hover:blur-2xl transition-all duration-500" />
                    
                    <FaBiohazard className="w-10 h-10 text-purple-500 relative z-10 
                      group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent 
                      bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500
                      pb-1"
                    >
                      Choose Your Infection Vector
                    </h2>
                    <p className="text-gray-400 flex items-center justify-center gap-2">
                      <FaSyringe className="w-4 h-4 text-purple-500 rotate-45" />
                      <span>Select your preferred method of contamination</span>
                      <FaSyringe className="w-4 h-4 text-purple-500 -rotate-45" />
                    </p>
                  </motion.div>
                </div>

                {/* Streaming Services Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {streamingServices.map((service, index) => (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <a
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          variant="infected"
                          className="w-full group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4 p-4">
                            {/* Service Icon */}
                            <div className="relative">
                              <div className="absolute inset-0 bg-purple-500/20 blur-xl 
                                group-hover:bg-purple-500/40 transition-all duration-500" />
                              {typeof service.icon === 'string' ? (
                                <Image 
                                  src={service.icon}
                                  alt={service.name}
                                  width={24}
                                  height={24}
                                  className="w-8 h-8 relative z-10"
                                />
                              ) : (
                                <service.icon className="w-8 h-8 relative z-10" />
                              )}
                            </div>
                            
                            {/* Service Info */}
                            <div className="flex flex-col items-start flex-1">
                              <span className="text-sm opacity-70 group-hover:opacity-90 transition-opacity
                                flex items-center gap-2"
                              >
                                <FaSkull className="w-3 h-3" />
                                <span>Spread through</span>
                              </span>
                              <span className="text-xl font-bold">
                                {service.name}
                              </span>
                              <span className="text-sm opacity-50 mt-1 text-left">
                                {service.description}
                              </span>
                            </div>

                            {/* Arrow indicator */}
                            <FaSyringe className="w-5 h-5 transform rotate-45 
                              group-hover:translate-x-1 group-hover:-translate-y-1 
                              transition-transform duration-300" />
                          </div>
                        </Button>
                      </a>
                    </motion.div>
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