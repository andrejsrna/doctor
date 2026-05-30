'use client'

import { motion } from 'framer-motion'
import { FaSpotify, FaYoutube, FaEnvelope, FaInstagram } from 'react-icons/fa'
import Button from './Button'
import { trackEvent } from '@/app/utils/analytics'

const ctaItems: {
  icon: React.ElementType
  iconColor: string
  cardStyle: string
  kicker: string
  title: string
  description: string
  buttonText: string
  href: string
  variant: 'infected' | 'decayed' | 'toxic'
  priority?: 'high' | 'normal'
}[] = [
  {
    icon: FaEnvelope,
    iconColor: 'text-cyan-300',
    cardStyle: 'border-cyan-500/40 bg-gradient-to-br from-cyan-900/30 via-black/60 to-black/80',
    kicker: 'Direct',
    title: 'Join the Newsletter',
    description: 'No algorithm, no noise. Early access and exclusive updates straight to your inbox.',
    buttonText: 'Join the Inner Circle',
    href: '/newsletter',
    variant: 'toxic',
    priority: 'high',
  },
  {
    icon: FaSpotify,
    iconColor: 'text-green-300',
    cardStyle: 'border-green-500/35 bg-gradient-to-br from-green-900/35 via-black/65 to-black/80',
    kicker: 'Playlist',
    title: 'Follow on Spotify',
    description: 'Curated selections of the sharpest neurofunk and drum & bass, updated continuously.',
    buttonText: 'Follow on Spotify',
    href: 'https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9',
    variant: 'infected',
  },
  {
    icon: FaInstagram,
    iconColor: 'text-pink-300',
    cardStyle: 'border-pink-500/35 bg-gradient-to-br from-pink-900/30 via-black/65 to-black/80',
    kicker: 'Social',
    title: 'Follow on Instagram',
    description: 'Behind-the-scenes, release previews and label life — follow along.',
    buttonText: 'Follow on Instagram',
    href: 'https://www.instagram.com/dnbdoctor',
    variant: 'infected',
  },
  {
    icon: FaYoutube,
    iconColor: 'text-red-300',
    cardStyle: 'border-red-500/35 bg-gradient-to-br from-red-900/30 via-black/65 to-black/80',
    kicker: 'Video',
    title: 'Subscribe on YouTube',
    description: 'Exclusive premieres and visuals. Get notified the moment new drops land.',
    buttonText: 'Subscribe on YouTube',
    href: 'https://www.youtube.com/@dnbdoctor1',
    variant: 'decayed',
  },
]

export default function EngagementCTA() {
  const handleEngagementClick = (platform: string) => {
    trackEvent('engagement', {
      method: platform,
      content_type: 'cta',
      content_name: platform,
    })
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-black/80 via-black/65 to-black/85 p-6 md:p-8">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_0%,rgba(59,130,246,0.15),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(16,185,129,0.15),transparent_45%)]" />
      <div className="relative space-y-5">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">Stay Connected</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Don&apos;t Miss the Next Drop</h2>
        </div>

        <div className="flex flex-col gap-3">
          {ctaItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.07, duration: 0.3 }}
              className={`rounded-xl border p-4 flex items-center gap-4 ${item.cardStyle} ${
                item.priority === 'high' ? 'ring-1 ring-cyan-300/35 shadow-[0_8px_30px_rgba(6,182,212,0.15)]' : ''
              }`}
            >
              <item.icon className={`w-8 h-8 shrink-0 ${item.iconColor}`} />

              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 mb-0.5">{item.kicker}</p>
                <h3 className="text-base font-bold text-white leading-tight">{item.title}</h3>
                <p className="text-gray-300 text-sm mt-0.5 leading-snug">{item.description}</p>
              </div>

              <div className="shrink-0">
                <Button
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : '_self'}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={() => handleEngagementClick(item.buttonText)}
                  variant={item.variant}
                  size="md"
                  className="whitespace-nowrap"
                >
                  {item.buttonText}
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
