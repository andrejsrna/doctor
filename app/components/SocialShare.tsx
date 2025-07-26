'use client'

import { motion } from 'framer-motion'
import { FaFacebook, FaLink, FaWhatsapp, FaSkull, FaSyringe, FaBiohazard } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Button from './Button'

interface ShareButton {
  name: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  shareUrl: (url: string, title: string) => string
  description: string
}

const shareButtons: ShareButton[] = [
  {
    name: 'Facebook',
    icon: FaFacebook,
    shareUrl: (url, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    description: 'Spread the infection on Facebook'
  },
  {
    name: 'X',
    icon: FaXTwitter,
    shareUrl: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    description: 'Contaminate your followers'
  },
  {
    name: 'WhatsApp',
    icon: FaWhatsapp,
    shareUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    description: 'Infect your contacts'
  }
]

export default function SocialShare({ url, title }: { url: string; title: string }) {
  const handleCopyLink = async () => {
    try {
      // Check if clipboard API is available and secure context
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
        alert('Link copied!')
      } else {
        // Fallback for Firefox or non-HTTPS contexts
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
          alert('Link copied!')
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr)
          // Show the URL for manual copying
          prompt('Copy this link:', url)
        } finally {
          document.body.removeChild(textArea)
        }
      }
    } catch (err) {
      console.error('Failed to copy:', err)
      // Final fallback - show URL in prompt
      prompt('Copy this link:', url)
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Background Effects */}
          <div className="absolute inset-0">
            {/* Pulsing gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30 animate-pulse rounded-xl" />
            
            {/* Animated grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:24px_24px] rounded-xl" />
            
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
            <div className="absolute inset-0 rounded-xl border border-purple-500/20 shadow-[inset_0_0_30px_rgba(168,85,247,0.2)]" />
          </div>

          {/* Content */}
          <div className="relative p-8 space-y-8">
            {/* Header with Biohazard Icon */}
            <div className="text-center">
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
                  Spread the Disease
                </h2>
                <p className="text-gray-400 flex items-center justify-center gap-2">
                  <FaSyringe className="w-4 h-4 text-purple-500 rotate-45" />
                  <span>Choose your transmission vector</span>
                  <FaSyringe className="w-4 h-4 text-purple-500 -rotate-45" />
                </p>
              </motion.div>
            </div>

            {/* Share Buttons Grid */}
            <div className="grid grid-cols-1 gap-3">
              {shareButtons.map((button, index) => (
                <motion.div
                  key={button.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="infected"
                    onClick={() => window.open(button.shareUrl(url, title), '_blank')}
                    className="w-full group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 p-4">
                      {/* Platform Icon */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/20 blur-xl 
                          group-hover:bg-purple-500/40 transition-all duration-500" />
                        <button.icon className="w-8 h-8 relative z-10" />
                      </div>
                      
                      {/* Platform Info */}
                      <div className="flex flex-col items-start flex-1">
                        <span className="text-sm opacity-70 group-hover:opacity-90 transition-opacity
                          flex items-center gap-2"
                        >
                          <FaSkull className="w-3 h-3" />
                          <span>Share through</span>
                        </span>
                        <span className="text-xl font-bold">
                          {button.name}
                        </span>
                        <span className="text-sm opacity-50 mt-1">
                          {button.description}
                        </span>
                      </div>

                      {/* Arrow indicator */}
                      <FaSyringe className="w-5 h-5 transform rotate-45 
                        group-hover:translate-x-1 group-hover:-translate-y-1 
                        transition-transform duration-300" />
                    </div>
                  </Button>
                </motion.div>
              ))}

              {/* Copy Link Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: shareButtons.length * 0.1 }}
              >
                <Button
                  variant="infected"
                  onClick={handleCopyLink}
                  className="w-full group relative overflow-hidden"
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Icon */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500/20 blur-xl 
                        group-hover:bg-purple-500/40 transition-all duration-500" />
                      <FaLink className="w-8 h-8 relative z-10" />
                    </div>
                    
                    {/* Info */}
                    <div className="flex flex-col items-start flex-1">
                      <span className="text-sm opacity-70 group-hover:opacity-90 transition-opacity
                        flex items-center gap-2"
                      >
                        <FaSkull className="w-3 h-3" />
                        <span>Copy infection vector</span>
                      </span>
                      <span className="text-xl font-bold">
                        Copy Link
                      </span>
                      <span className="text-sm opacity-50 mt-1">
                        Share the pathogen directly
                      </span>
                    </div>

                    {/* Arrow indicator */}
                    <FaSyringe className="w-5 h-5 transform rotate-45 
                      group-hover:translate-x-1 group-hover:-translate-y-1 
                      transition-transform duration-300" />
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
