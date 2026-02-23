'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { FaYoutube, FaHeadphonesAlt, FaDownload, FaSpotify, FaApple, FaDeezer, FaSoundcloud } from 'react-icons/fa'
import Button from '@/app/components/Button'
import { trackStreamingClick } from '@/app/utils/analytics'
import OutboundInterstitial, { getOutboundDismissed } from '@/app/components/OutboundInterstitial'
import { useState } from 'react'
import { ENABLE_OUTBOUND_INTERSTITIAL } from '@/app/utils/flags'
import Link from 'next/link'
import type { StreamingLink } from '@/app/types/release'
import type { ComponentType } from 'react'

interface ReleaseHeroProps {
  title: string
  beatportUrl: string | undefined
  youtubeUrl: string | undefined
  soundcloudUrl?: string
  artworkUrl?: string
  descriptionExcerptInlineHtml: string
  showReadFullStory?: boolean
  gumroadUrl?: string
  slug: string
  releaseType?: 'NORMAL' | 'FREE_DOWNLOAD'
  streamingLinks?: StreamingLink[]
}

function getYoutubeEmbed(url?: string): string | null {
  if (!url) return null
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

function getPlatformChipTheme(name: string) {
  const lower = name.toLowerCase()
  if (lower.includes('spotify')) return 'border-green-400/40 bg-green-500/15 text-green-200 hover:border-green-300/60'
  if (lower.includes('apple')) return 'border-pink-400/40 bg-pink-500/15 text-pink-200 hover:border-pink-300/60'
  if (lower.includes('soundcloud')) return 'border-orange-400/40 bg-orange-500/15 text-orange-200 hover:border-orange-300/60'
  if (lower.includes('deezer')) return 'border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200 hover:border-fuchsia-300/60'
  if (lower.includes('tidal')) return 'border-cyan-400/40 bg-cyan-500/15 text-cyan-200 hover:border-cyan-300/60'
  if (lower.includes('bandcamp') || lower.includes('juno')) return 'border-blue-400/40 bg-blue-500/15 text-blue-200 hover:border-blue-300/60'
  return 'border-white/20 bg-white/5 text-gray-200 hover:border-white/35'
}

function renderStreamingIcon(icon: StreamingLink['icon']) {
  if (typeof icon === 'string') {
    if (icon.startsWith('/')) {
      return <Image src={icon} alt="" width={14} height={14} className="w-3.5 h-3.5" />
    }
    const map: Record<string, ComponentType<{ className?: string }>> = {
      spotify: FaSpotify,
      apple: FaApple,
      deezer: FaDeezer,
      soundcloud: FaSoundcloud,
      download: FaDownload,
    }
    const Icon = map[icon.toLowerCase()] || FaHeadphonesAlt
    return <Icon className="w-3.5 h-3.5" />
  }
  const Icon = icon
  return <Icon className="w-3.5 h-3.5" />
}

export default function ReleaseHero({
  title,
  beatportUrl,
  youtubeUrl,
  soundcloudUrl,
  artworkUrl,
  descriptionExcerptInlineHtml,
  showReadFullStory,
  gumroadUrl,
  slug,
  releaseType,
  streamingLinks = [],
}: ReleaseHeroProps) {
  const shouldReduce = useReducedMotion()
  const [interstitialOpen, setInterstitialOpen] = useState(false)
  const [pending, setPending] = useState<{ platform: string; href: string } | null>(null)
  const [downloadEmail, setDownloadEmail] = useState('')
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [downloadError, setDownloadError] = useState<string>('')
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptNewsletter, setAcceptNewsletter] = useState(false)

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
    if (shouldDebugAds()) {
      console.debug('[Ads] ReleaseHero click', { platform, slug, interstitial: ENABLE_OUTBOUND_INTERSTITIAL })
    }

    // Always prevent default navigation so conversion has time to fire.
    e.preventDefault()

    if (ENABLE_OUTBOUND_INTERSTITIAL && !getOutboundDismissed()) {
      setPending({ platform, href })
      setInterstitialOpen(true)
      return
    }

    trackStreamingClick(platform, slug)
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const isFreeDownload = releaseType === 'FREE_DOWNLOAD'
  const visibleStreamingLinks = streamingLinks
    .filter((link) => !!link.url)
    .filter((link) => !['youtube', 'beatport'].includes(link.name.toLowerCase()))
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
  const youtubeEmbedSrc = getYoutubeEmbed(youtubeUrl)
  const soundcloudEmbedSrc = soundcloudUrl
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&color=%23a855f7&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`
    : null

  const loopTransition = { duration: 2.6, repeat: Infinity, repeatType: 'mirror' as const, ease: 'easeInOut' as const }
  const loopAnim = shouldReduce
    ? undefined
    : {
        scale: [1, 1.04, 1],
        filter: [
          'drop-shadow(0 0 0px rgba(255,255,255,0))',
          'drop-shadow(0 0 22px rgba(168,85,247,0.45))',
          'drop-shadow(0 0 0px rgba(255,255,255,0))',
        ],
      }

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center text-center px-4 pt-32 pb-24 overflow-hidden">
      <div className="relative z-20 space-y-6 max-w-3xl">
        <motion.h1
          initial={shouldReduce ? undefined : { opacity: 0, y: 20 }}
          animate={shouldReduce ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduce ? undefined : { type: 'spring', stiffness: 300, damping: 20 }}
          className="text-4xl md:text-7xl font-extrabold text-white
            drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <motion.p
          initial={shouldReduce ? undefined : { opacity: 0, y: 20 }}
          animate={shouldReduce ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduce ? undefined : { delay: 0.1, type: 'spring', stiffness: 300 }}
          className="text-xl md:text-2xl text-gray-200 mx-auto leading-relaxed pl-2 sm:pl-3 [&_a]:underline [&_a]:text-purple-200/90 hover:[&_a]:text-purple-100 [&_strong]:text-white [&_em]:text-gray-100"
        >
          <span dangerouslySetInnerHTML={{ __html: descriptionExcerptInlineHtml }} />
          {showReadFullStory && (
            <span className="sr-only">Read full story</span>
          )}
        </motion.p>

        <motion.div
          initial={shouldReduce ? undefined : { opacity: 0, scale: 0.8 }}
          animate={shouldReduce ? undefined : { opacity: 1, scale: 1 }}
          transition={shouldReduce ? undefined : { delay: 0.2, type: 'spring', stiffness: 300 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          {isFreeDownload ? (
            <div className="w-full max-w-md space-y-3">
              {soundcloudEmbedSrc && (
                <div className="w-full overflow-hidden rounded-xl border border-purple-500/20 bg-black/40">
                  <iframe
                    title="SoundCloud player"
                    src={soundcloudEmbedSrc}
                    className="w-full h-[300px]"
                    allow="autoplay"
                    loading="lazy"
                  />
                </div>
              )}

              <form
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setDownloadError('')
                  if (!acceptPrivacy || !acceptNewsletter) {
                    setDownloadStatus('error')
                    setDownloadError('Please accept the privacy policy and newsletter subscription to continue.')
                    return
                  }
                  setDownloadStatus('loading')
                  try {
                    const res = await fetch(`/api/releases/${slug}/request-download`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: downloadEmail,
                        acceptPrivacy,
                        acceptNewsletter,
                      }),
                    })
                    if (!res.ok) {
                      const json = await res.json().catch(() => null)
                      throw new Error(json?.error || 'Failed to send download email')
                    }
                    setDownloadStatus('sent')
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Failed to send download email'
                    setDownloadError(message)
                    setDownloadStatus('error')
                  }
                }}
              >
                <input
                  type="email"
                  required
                  value={downloadEmail}
                  onChange={(e) => {
                    setDownloadEmail(e.target.value)
                    if (downloadStatus !== 'idle') setDownloadStatus('idle')
                  }}
                  placeholder="Enter your email to download"
                  className="sm:col-span-2 px-4 py-3 bg-black/60 border border-purple-500/30 rounded-lg text-white placeholder:text-gray-500"
                />

                <Button
                  type="submit"
                  variant="infected"
                  size="lg"
                  disabled={downloadStatus === 'loading' || downloadStatus === 'sent'}
                  className="justify-center"
                >
                  {downloadStatus === 'sent' ? 'Email sent' : downloadStatus === 'loading' ? 'Sending…' : 'Get download link'}
                </Button>

                <div className="sm:col-span-2 text-left text-xs text-gray-300 space-y-2">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={acceptPrivacy}
                      onChange={(e) => {
                        setAcceptPrivacy(e.target.checked)
                        if (downloadStatus !== 'idle') setDownloadStatus('idle')
                      }}
                      className="mt-0.5 accent-purple-500"
                      required
                    />
                    <span>
                      I agree to the{' '}
                      <Link href="/privacy-policy" className="underline text-purple-200 hover:text-purple-100">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={acceptNewsletter}
                      onChange={(e) => {
                        setAcceptNewsletter(e.target.checked)
                        if (downloadStatus !== 'idle') setDownloadStatus('idle')
                      }}
                      className="mt-0.5 accent-purple-500"
                      required
                    />
                    <span>Add me to the DnB Doctor newsletter (you can unsubscribe anytime).</span>
                  </label>
                </div>
                {(downloadStatus === 'sent' || downloadStatus === 'error') && (
                  <div className="sm:col-span-2 text-sm text-gray-300">
                    {downloadStatus === 'sent'
                      ? 'Check your inbox for the download link.'
                      : downloadError || 'Something went wrong.'}
                  </div>
                )}
              </form>
            </div>
          ) : gumroadUrl ? (
            <Button
              href={gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleStreamingClick('Gumroad', gumroadUrl, e as unknown as React.MouseEvent)}
              variant="infected"
              size="lg"
              className="group"
            >
              <FaHeadphonesAlt className="w-6 h-6 mr-3" />
              Get on Gumroad
            </Button>
          ) : (
            <motion.div
              initial={shouldReduce ? undefined : { opacity: 0, y: 12 }}
              animate={shouldReduce ? undefined : { opacity: 1, y: 0 }}
              transition={shouldReduce ? undefined : { delay: 0.15, type: 'spring', stiffness: 260, damping: 22 }}
              className="w-full max-w-3xl rounded-2xl border border-white/15 bg-black/45 backdrop-blur-md p-3 sm:p-4 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {youtubeUrl && (
                  <motion.div animate={loopAnim} transition={{ ...loopTransition, delay: 0.1 }} className="w-full">
                    <Button
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleStreamingClick('YouTube', youtubeUrl, e as unknown as React.MouseEvent)}
                      variant="toxic"
                      size="lg"
                      className="group w-full justify-center from-red-900/80 via-red-700/80 to-red-900/80 text-red-200"
                    >
                      <FaYoutube className="w-6 h-6 mr-3" />
                      Listen on YouTube
                    </Button>
                  </motion.div>
                )}
                {beatportUrl && (
                  <motion.div animate={loopAnim} transition={{ ...loopTransition, delay: 0.5 }} className="w-full">
                    <Button
                      href={beatportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleStreamingClick('Beatport', beatportUrl, e as unknown as React.MouseEvent)}
                      variant="toxic"
                      size="lg"
                      className="group w-full justify-center"
                    >
                      <Image
                        src="/beatport.svg"
                        alt=""
                        width={24}
                        height={24}
                        className="w-6 h-6 mr-3"
                      />
                      Buy on Beatport
                    </Button>
                  </motion.div>
                )}
              </div>

              {(youtubeEmbedSrc || soundcloudEmbedSrc) && (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50">
                  {youtubeEmbedSrc ? (
                    <iframe
                      title="YouTube player"
                      src={youtubeEmbedSrc}
                      className="w-full aspect-video"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <iframe
                      title="SoundCloud player"
                      src={soundcloudEmbedSrc || undefined}
                      className="w-full h-[220px]"
                      allow="autoplay"
                      loading="lazy"
                    />
                  )}
                </div>
              )}

              {visibleStreamingLinks.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {visibleStreamingLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleStreamingClick(link.name, link.url!, e as unknown as React.MouseEvent)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${getPlatformChipTheme(link.name)}`}
                    >
                      <span className="opacity-90">{renderStreamingIcon(link.icon)}</span>
                      {link.name}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {artworkUrl && (
            <div className="w-full flex justify-center pt-1">
              <a
                href={artworkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/0 hover:bg-white/5 text-white/60 hover:text-white/75 backdrop-blur-sm transition-colors"
              >
                <FaDownload className="w-4 h-4" />
                <span className="text-sm font-medium">Download Cover Art For Free</span>
              </a>
            </div>
          )}
        </motion.div>
      </div>
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
    </div>
  )
}
