'use client'

import { motion } from 'framer-motion'
import { FaFacebook, FaTwitter, FaLink, FaWhatsapp } from 'react-icons/fa'

interface ShareButton {
  name: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  shareUrl: (url: string, title: string) => string
  color: string
}

const shareButtons: ShareButton[] = [
  {
    name: 'Facebook',
    icon: FaFacebook,
    shareUrl: (url, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    color: 'hover:text-blue-500'
  },
  {
    name: 'Twitter',
    icon: FaTwitter,
    shareUrl: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    color: 'hover:text-sky-500'
  },
  {
    name: 'WhatsApp',
    icon: FaWhatsapp,
    shareUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    color: 'hover:text-green-500'
  }
]

export default function SocialShare({ url, title }: { url: string; title: string }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6"
        >
          <h2 className="text-2xl font-bold text-purple-500">Share This Release</h2>
          <div className="flex justify-center gap-4">
            {shareButtons.map((button, index) => (
              <motion.a
                key={button.name}
                href={button.shareUrl(url, title)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-full bg-white/5 border-2 border-white/10 ${button.color} 
                  hover:bg-white/10 hover:scale-110 transition-all duration-300 group backdrop-blur-sm`}
              >
                <button.icon size={32} className="transition-transform group-hover:scale-110" />
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={handleCopyLink}
              className="p-6 rounded-full bg-white/5 border-2 border-white/10 hover:text-purple-500 
                hover:bg-white/10 hover:scale-110 transition-all duration-300 group backdrop-blur-sm"
            >
              <FaLink size={32} className="transition-transform group-hover:scale-110" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 