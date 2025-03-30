'use client'

import { motion } from 'framer-motion'
import { FaFacebook, FaLink, FaWhatsapp } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

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
    shareUrl: (url, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    color: 'hover:text-blue-500'
  },
  {
    name: 'X',
    icon: FaXTwitter,
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
          <h2 className="text-2xl font-bold text-purple-500">Share This</h2>
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
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className={`p-5 rounded-full bg-white/10 border border-purple-500/30 ${button.color}
                  hover:bg-white/20 hover:border-purple-500/50 transition-all duration-300 group backdrop-blur-sm`}
              >
                <button.icon size={28} className="transition-transform group-hover:scale-105" />
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="p-5 rounded-full bg-white/10 border border-purple-500/30 hover:text-purple-400
                hover:bg-white/20 hover:border-purple-500/50 transition-all duration-300 group backdrop-blur-sm"
            >
              <FaLink size={28} className="transition-transform group-hover:scale-105" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
