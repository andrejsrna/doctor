'use client'

import { motion } from 'framer-motion'
import { FaSpotify, FaYoutube, FaEnvelope } from 'react-icons/fa'
import Button from './Button'
import { trackEvent } from '@/app/utils/analytics'

const ctaItems: {
  icon: React.ElementType
  iconColor: string
  cardStyle: string
  kicker: string
  title: string
  description: string
  microBenefit: string
  buttonText: string
  href: string
  variant: 'infected' | 'decayed' | 'toxic'
  priority?: 'high' | 'normal'
}[] = [
  {
    icon: FaSpotify,
    iconColor: 'text-green-300',
    cardStyle: 'border-green-500/35 bg-gradient-to-br from-green-900/35 via-black/65 to-black/80',
    kicker: 'Playlist',
    title: 'Dive Deeper with Spotify',
    description: 'Follow our curated playlist for the latest razor-sharp drums and rolling basslines.',
    microBenefit: 'Fresh selections updated continuously.',
    buttonText: 'Follow on Spotify',
    href: 'https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9',
    variant: 'infected',
  },
  {
    icon: FaYoutube,
    iconColor: 'text-red-300',
    cardStyle: 'border-red-500/35 bg-gradient-to-br from-red-900/30 via-black/65 to-black/80',
    kicker: 'Video',
    title: 'Join the YouTube Channel',
    description: 'Subscribe for exclusive premieres, production tutorials, and mind-bending visuals.',
    microBenefit: 'Get notified when new drops land.',
    buttonText: 'Subscribe on YouTube',
    href: 'https://www.youtube.com/@dnbdoctor1',
    variant: 'decayed',
  },
  {
    icon: FaEnvelope,
    iconColor: 'text-cyan-300',
    cardStyle: 'border-cyan-500/40 bg-gradient-to-br from-cyan-900/30 via-black/60 to-black/80',
    kicker: 'Direct',
    title: 'Join the Newsletter',
    description: 'Join our inner circle for exclusive content, early access, and special offers.',
    microBenefit: 'No algorithm, no noise, just important updates.',
    buttonText: 'Join the Inner Circle',
    href: '/newsletter',
    variant: 'toxic',
    priority: 'high',
  },
]

export default function EngagementCTA() {
  const handleEngagementClick = (platform: string) => {
    trackEvent('engagement', {
      method: platform,
      content_type: 'cta',
      content_name: platform
    })
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-black/80 via-black/65 to-black/85 p-6 md:p-8">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_0%,rgba(59,130,246,0.15),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(16,185,129,0.15),transparent_45%)]" />
      <div className="relative space-y-6">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">Stay Connected</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Don&apos;t Miss the Next Drop</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            Pick your preferred channel and stay in sync with releases, premieres, and exclusive updates.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-xs text-gray-200">Release alerts</span>
            <span className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-xs text-gray-200">Behind-the-scenes</span>
            <span className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-xs text-gray-200">Early access drops</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {ctaItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className={`rounded-xl border p-5 text-center flex flex-col ${item.cardStyle} ${
                item.priority === 'high' ? 'ring-1 ring-cyan-300/35 shadow-[0_18px_45px_rgba(6,182,212,0.18)]' : ''
              }`}
            >
              <div className="flex-grow space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                  <span className="text-[11px] uppercase tracking-[0.18em] text-gray-300">{item.kicker}</span>
                  {item.priority === 'high' && (
                    <span className="text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full border border-cyan-300/40 text-cyan-200 bg-cyan-500/10">
                      Recommended
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
                <p className="text-xs text-gray-400">{item.microBenefit}</p>
              </div>

              <div className="mt-4">
                <Button
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : '_self'}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={() => handleEngagementClick(item.buttonText)}
                  variant={item.variant}
                  size="md"
                  className="w-full justify-center"
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
