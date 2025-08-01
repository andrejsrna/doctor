'use client'

import { motion } from 'framer-motion'
import { FaSpotify, FaYoutube, FaEnvelope } from 'react-icons/fa'
import Link from 'next/link'
import Button from './Button'
import { trackEvent } from '@/app/utils/analytics'

const ctaItems: {
  icon: React.ElementType
  title: string
  description: string
  buttonText: string
  href: string
  variant: 'infected' | 'decayed' | 'toxic'
}[] = [
  {
    icon: FaSpotify,
    title: 'Dive Deeper with Spotify',
    description: 'Follow our curated playlist for the latest razor-sharp drums and rolling basslines.',
    buttonText: 'Follow on Spotify',
    href: 'https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9',
    variant: 'infected',
  },
  {
    icon: FaYoutube,
    title: 'Join the YouTube Channel',
    description: 'Subscribe for exclusive premieres, production tutorials, and mind-bending visuals.',
    buttonText: 'Subscribe on YouTube',
    href: 'https://www.youtube.com/@dnbdoctor1',
    variant: 'decayed',
  },
  {
    icon: FaEnvelope,
    title: 'Join the Newsletter',
    description: 'Join our inner circle for exclusive content, early access, and special offers.',
    buttonText: 'Join the Inner Circle',
    href: '/newsletter',
    variant: 'toxic',
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
    <div className="">
      <div className="grid md:grid-cols-3 gap-6">
        {ctaItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/50 border border-purple-500/20 rounded-xl p-6 text-center flex flex-col"
          >
            <div className="flex-grow">
              <div className="flex justify-center mb-4">
                <item.icon className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 mb-4 text-sm">{item.description}</p>
            </div>
            <div className="mt-auto">
              <Link href={item.href} passHref legacyBehavior>
                <a 
                  target={item.href.startsWith('http') ? '_blank' : '_self'} 
                  rel="noopener noreferrer"
                  onClick={() => handleEngagementClick(item.buttonText)}
                >
                  <Button variant={item.variant} size="md">
                    {item.buttonText}
                  </Button>
                </a>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 