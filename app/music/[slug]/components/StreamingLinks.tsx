'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { FaHeadphonesAlt, FaAngleRight, FaSpotify, FaApple, FaDeezer, FaSoundcloud, FaDownload } from 'react-icons/fa'
import OutboundInterstitial, { getOutboundDismissed } from '@/app/components/OutboundInterstitial'
import { useState } from 'react'
import { ENABLE_OUTBOUND_INTERSTITIAL } from '@/app/utils/flags'
import { StreamingLink } from '@/app/types/release'
import { trackStreamingClick } from '@/app/utils/analytics'
import Button from '@/app/components/Button'

interface StreamingLinksProps {
  links: StreamingLink[]
  gumroadUrl?: string
  slug: string
}

type EmbedConfig = {
  name: string
  src: string
  title: string
  className: string
  allow?: string
}

function getSpotifyEmbed(url: string): string | null {
  const match = url.match(/open\.spotify\.com\/(?:embed\/)?(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/i)
  if (!match) return null
  return `https://open.spotify.com/embed/${match[1].toLowerCase()}/${match[2]}?utm_source=generator`
}

function getAppleMusicEmbed(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('music.apple.com')) return null
    parsed.hostname = 'embed.music.apple.com'
    return parsed.toString()
  } catch {
    return null
  }
}

function getYoutubeEmbed(url: string): string | null {
  try {
    const parsed = new URL(url)
    let videoId = ''
    let playlistId = ''
    if (parsed.hostname === 'youtu.be') {
      videoId = parsed.pathname.replace('/', '')
    } else if (parsed.hostname.includes('youtube.com')) {
      playlistId = parsed.searchParams.get('list') || ''
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v') || ''
      } else if (parsed.pathname === '/playlist') {
        playlistId = parsed.searchParams.get('list') || ''
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/')[2] || ''
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/')[2] || ''
      }
    }
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
    if (playlistId) return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}`
    return null
  } catch {
    return null
  }
}

function getSoundcloudEmbed(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('soundcloud.com')) return null
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(parsed.toString())}`
  } catch {
    return null
  }
}

function toEmbedConfig(link: StreamingLink): EmbedConfig | null {
  if (!link.url) return null
  const lowerName = link.name.toLowerCase()
  const isSpotify = lowerName.includes('spotify') || link.url.includes('open.spotify.com')
  const isApple = lowerName.includes('apple') || link.url.includes('music.apple.com')
  const isYoutube = lowerName.includes('youtube') || link.url.includes('youtube.com') || link.url.includes('youtu.be')
  const isSoundcloud = lowerName.includes('soundcloud') || link.url.includes('soundcloud.com')

  if (isSpotify) {
    const src = getSpotifyEmbed(link.url)
    if (!src) return null
    return {
      name: 'Spotify',
      src,
      title: 'Spotify player',
      className: 'h-[352px]',
      allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
    }
  }
  if (isApple) {
    const src = getAppleMusicEmbed(link.url)
    if (!src) return null
    return {
      name: 'Apple Music',
      src,
      title: 'Apple Music player',
      className: 'h-[450px]',
      allow: 'autoplay; encrypted-media; fullscreen; picture-in-picture',
    }
  }
  if (isYoutube) {
    const src = getYoutubeEmbed(link.url)
    if (!src) return null
    return {
      name: 'YouTube',
      src,
      title: 'YouTube player',
      className: 'aspect-video',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    }
  }
  if (isSoundcloud) {
    const src = getSoundcloudEmbed(link.url)
    if (!src) return null
    return {
      name: 'SoundCloud',
      src,
      title: 'SoundCloud player',
      className: 'h-[166px]',
      allow: 'autoplay',
    }
  }
  return null
}

const StreamingLinks = ({ links, gumroadUrl, slug }: StreamingLinksProps) => {
  const shouldReduce = useReducedMotion()
  const availableLinks = links.filter((link) => !!link.url)
  const sortedLinks = [...availableLinks].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
  const embedConfigs = sortedLinks
    .map((link) => toEmbedConfig(link))
    .filter((embed): embed is EmbedConfig => !!embed)
    .slice(0, 3)
  const secondaryEmbeds = embedConfigs.slice(1)
  const primaryLink = sortedLinks[0]
  const secondaryLinks = sortedLinks.slice(1)
  const heroDelay = shouldReduce ? undefined : { delay: 0.05 }
  const linkMotion = (index: number) => (shouldReduce ? undefined : { delay: index * 0.05 })
  const [interstitialOpen, setInterstitialOpen] = useState(false)
  const [pending, setPending] = useState<{ platform: string; href: string } | null>(null)

  const shouldDebugAds = () => {
    if (typeof window === 'undefined') return false
    if (process.env.NODE_ENV !== 'production') return true
    try {
      return window.localStorage.getItem('__dd_debug_ads') === '1'
    } catch {
      return false
    }
  }

  const handleStreamingClick = (platform: string, href: string, e: React.MouseEvent) => {
    if (shouldDebugAds()) console.log('[Ads] StreamingLinks click', { platform, slug, href })

    // Always prevent default navigation so we have a chance to fire conversion.
    e.preventDefault()

    if (ENABLE_OUTBOUND_INTERSTITIAL && !getOutboundDismissed()) {
      setPending({ platform, href })
      setInterstitialOpen(true)
      return
    }

    // Fire internal tracking (DB click counter + Meta CAPI etc.)
    trackStreamingClick(platform, slug)

    // Navigation
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const renderIcon = (icon: StreamingLink['icon']) => {
    if (typeof icon === 'string') {
      if (icon.startsWith('/')) {
        return (
          <Image
            src={icon}
            alt=""
            width={24}
            height={24}
            className="w-6 h-6"
          />
        )
      }
      const map: Record<string, React.ComponentType<{ className?: string }>> = {
        spotify: FaSpotify,
        apple: FaApple,
        deezer: FaDeezer,
        soundcloud: FaSoundcloud,
        download: FaDownload,
      }
      const Mapped = map[icon.toLowerCase()] || null
      return Mapped ? <Mapped className="w-6 h-6" /> : null
    }
    const Comp = icon
    return <Comp className="w-6 h-6" />
  }

  return (
    <motion.div
      initial={shouldReduce ? undefined : { opacity: 0, y: 20 }}
      animate={shouldReduce ? undefined : { opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-green-300/80">Stream now</p>
        <h2 className="text-3xl font-bold mb-2">Where to listen</h2>
        <p className="text-gray-400">
          Play instantly here or open your preferred platform in one click.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div
          initial={shouldReduce ? undefined : { opacity: 0, x: -20 }}
          animate={shouldReduce ? undefined : { opacity: 1, x: 0 }}
          transition={heroDelay}
          className="lg:col-span-2 space-y-3"
        >
          {primaryLink && (
            <a
              href={primaryLink.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleStreamingClick(primaryLink.name, primaryLink.url!, e)}
              className={`group block rounded-xl border border-green-400/35 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-black/60 p-4 transition-colors hover:border-green-300/70 ${primaryLink.bgColor}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center ${primaryLink.color}`}>
                  {renderIcon(primaryLink.icon)}
                </div>
                <div className="flex-grow">
                  <p className="text-xs uppercase tracking-widest text-gray-300">Primary platform</p>
                  <p className={`text-lg font-semibold ${primaryLink.color}`}>{primaryLink.name}</p>
                </div>
                <FaAngleRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity text-white" />
              </div>
            </a>
          )}

          {secondaryLinks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {secondaryLinks.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={shouldReduce ? undefined : { opacity: 0, x: -20 }}
                  animate={shouldReduce ? undefined : { opacity: 1, x: 0 }}
                  transition={linkMotion(index + 1)}
                >
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block group rounded-lg border border-white/10 backdrop-blur-sm transition-colors ${platform.bgColor}`}
                    onClick={(e) => handleStreamingClick(platform.name, platform.url!, e)}
                  >
                    <div className="w-full p-3 flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center ${platform.color}`}>
                        {renderIcon(platform.icon)}
                      </div>
                      <span className={`font-semibold text-md text-left flex-grow ${platform.color}`}>{platform.name}</span>
                      <FaAngleRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity text-white/70" />
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500 text-center lg:text-left">All links open in a new tab.</p>
        </motion.div>

        <div className="lg:col-span-3 space-y-4">
          {secondaryEmbeds.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {secondaryEmbeds.map((embed) => (
                <div key={embed.src} className="rounded-xl border border-white/10 bg-black/50 p-2">
                  <div className="px-2 pt-2 pb-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">{embed.name}</p>
                  </div>
                  <iframe
                    src={embed.src}
                    title={embed.title}
                    loading="lazy"
                    allow={embed.allow}
                    allowFullScreen
                    className={`w-full rounded-lg border-0 ${embed.className}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {gumroadUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex justify-center"
        >
          <a
            href={gumroadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
            onClick={(e) => handleStreamingClick('Gumroad', gumroadUrl, e)}
          >
            <Button
              variant="toxic"
              size="lg"
              className="w-full group text-xl py-4 px-8"
            >
              <FaHeadphonesAlt className="w-6 h-6 mr-3" />
              <span>Get Sample Pack on Gumroad</span>
            </Button>
          </a>
        </motion.div>
      )}
      <OutboundInterstitial
        isOpen={interstitialOpen}
        onClose={() => setInterstitialOpen(false)}
        onContinue={() => {
          const next = pending
          setInterstitialOpen(false)
          setPending(null)
          if (next?.href) {
            trackStreamingClick(next.platform, slug)
            window.open(next.href, '_blank', 'noopener,noreferrer')
          }
        }}
      />
    </motion.div>
  )
}

export default StreamingLinks 
