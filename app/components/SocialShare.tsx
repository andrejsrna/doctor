'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  FaFacebook,
  FaLink,
  FaWhatsapp,
  FaAngleRight,
  FaBullhorn,
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { trackEvent } from '@/app/utils/analytics'

interface ShareButton {
  name: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  shareUrl: (url: string, title: string) => string
  cardClass: string
  iconClass: string
}

const shareButtons: ShareButton[] = [
  {
    name: 'Facebook',
    icon: FaFacebook,
    shareUrl: (url, title) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
    cardClass: 'border-blue-400/35 bg-blue-500/15 hover:border-blue-300/60',
    iconClass: 'text-blue-200',
  },
  {
    name: 'X',
    icon: FaXTwitter,
    shareUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
    cardClass: 'border-white/25 bg-white/10 hover:border-white/45',
    iconClass: 'text-white',
  },
  {
    name: 'WhatsApp',
    icon: FaWhatsapp,
    shareUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    cardClass: 'border-green-400/35 bg-green-500/15 hover:border-green-300/60',
    iconClass: 'text-green-200',
  },
]

export default function SocialShare({
  url,
  title,
}: {
  url: string
  title: string
}) {
  const [copied, setCopied] = useState(false)

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
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
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
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-black/80 via-black/65 to-black/85 p-6 md:p-8">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.16),transparent_40%),radial-gradient(circle_at_88%_75%,rgba(168,85,247,0.2),transparent_42%)]" />
      <div className="relative z-10 space-y-6">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">Amplify The Release</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Spread the Disease</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            Share this release with your crew and help push it into more sets, playlists, and feeds.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-300/35 bg-purple-500/10 text-xs text-purple-200">
            <FaBullhorn className="w-3 h-3" />
            Every share helps discovery
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shareButtons.map((button, index) => (
            <motion.div
              key={button.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                type="button"
                onClick={() => {
                  handleShareClick(button.name)
                  window.open(button.shareUrl(url, title), '_blank')
                }}
                className={`w-full group rounded-xl border px-4 py-3 transition-colors text-left ${button.cardClass}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-8 h-8 flex items-center justify-center ${button.iconClass}`}>
                    <button.icon className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-md flex-grow text-left text-white">
                    {button.name}
                  </span>
                  <FaAngleRight className="w-5 h-5 opacity-50 group-hover:opacity-100 text-white/80" />
                </div>
              </button>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: shareButtons.length * 0.05 }}
          >
            <button
              type="button"
              onClick={handleCopyLink}
              className={`w-full group rounded-xl border px-4 py-3 transition-colors text-left ${
                copied
                  ? 'border-cyan-300/60 bg-cyan-500/20'
                  : 'border-cyan-400/35 bg-cyan-500/12 hover:border-cyan-300/60'
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 flex items-center justify-center text-cyan-200">
                  <FaLink className="w-6 h-6" />
                </div>
                <span className="font-semibold text-md flex-grow text-left text-white">
                  {copied ? 'Link copied' : 'Copy Link'}
                </span>
                <FaAngleRight className="w-5 h-5 opacity-50 group-hover:opacity-100 text-white/80" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
