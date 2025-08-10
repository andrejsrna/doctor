'use client'

import { motion } from 'framer-motion'
import {
  FaFacebook,
  FaLink,
  FaWhatsapp,
  FaAngleRight,
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Button from './Button'
import { trackEvent } from '@/app/utils/analytics'

interface ShareButton {
  name: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  shareUrl: (url: string, title: string) => string
}

const shareButtons: ShareButton[] = [
  {
    name: 'Facebook',
    icon: FaFacebook,
    shareUrl: (url, title) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
  },
  {
    name: 'X',
    icon: FaXTwitter,
    shareUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
  },
  {
    name: 'WhatsApp',
    icon: FaWhatsapp,
    shareUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
]

export default function SocialShare({
  url,
  title,
}: {
  url: string
  title: string
}) {
  const handleShareClick = (platform: string) => {
    trackEvent('share', {
      method: platform,
      content_type: 'music_release',
      content_name: title
    })
  }

  const handleCopyLink = async () => {
    trackEvent('share', {
      method: 'copy_link',
      content_type: 'music_release',
      content_name: title
    })

    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
        return
      }
      const textArea = document.createElement('textarea')
      textArea.value = url
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative p-8 rounded-xl bg-black/50 border border-purple-500/20 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:24px_24px] animate-pulse" />
      <div className="relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Spread the Disease</h2>
          <p className="text-gray-400">Share this release with your friends.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shareButtons.map((button, index) => (
            <motion.div
              key={button.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="infected"
                onClick={() => {
                  handleShareClick(button.name)
                  window.open(button.shareUrl(url, title), '_blank')
                }}
                className="w-full group !p-3 !justify-start"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <button.icon className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-md flex-grow text-left">
                    {button.name}
                  </span>
                  <FaAngleRight className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                </div>
              </Button>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: shareButtons.length * 0.05 }}
          >
            <Button
              variant="infected"
              onClick={handleCopyLink}
              className="w-full group !p-3 !justify-start"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 flex items-center justify-center">
                  <FaLink className="w-6 h-6" />
                </div>
                <span className="font-semibold text-md flex-grow text-left">
                  Copy Link
                </span>
                <FaAngleRight className="w-5 h-5 opacity-50 group-hover:opacity-100" />
              </div>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
