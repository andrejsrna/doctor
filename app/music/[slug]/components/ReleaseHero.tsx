'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { FaYoutube, FaHeadphonesAlt, FaDownload } from 'react-icons/fa'
import Button from '@/app/components/Button'
import { trackStreamingClick } from '@/app/utils/analytics'
import OutboundInterstitial, { getOutboundDismissed } from '@/app/components/OutboundInterstitial'
import { useState } from 'react'
import { ENABLE_OUTBOUND_INTERSTITIAL } from '@/app/utils/flags'
import { useProgressiveImage } from '@/app/hooks/useProgressiveImage'
import Link from 'next/link'

interface ReleaseHeroProps {
  title: string
  imageUrl: string | undefined
  beatportUrl: string | undefined
  youtubeUrl: string | undefined
  soundcloudUrl?: string
  artworkUrl?: string
  descriptionExcerptInlineHtml: string
  showReadFullStory?: boolean
  gumroadUrl?: string
  slug: string
  releaseType?: 'NORMAL' | 'FREE_DOWNLOAD'
}

export default function ReleaseHero({
  title,
  imageUrl,
  beatportUrl,
  youtubeUrl,
  soundcloudUrl,
  artworkUrl,
  descriptionExcerptInlineHtml,
  showReadFullStory,
  gumroadUrl,
  slug,
  releaseType,
}: ReleaseHeroProps) {
  const shouldReduce = useReducedMotion()
  const [interstitialOpen, setInterstitialOpen] = useState(false)
  const [pending, setPending] = useState<{ platform: string; href: string } | null>(null)
  const [downloadEmail, setDownloadEmail] = useState('')
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [downloadError, setDownloadError] = useState<string>('')
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptNewsletter, setAcceptNewsletter] = useState(false)

  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 700], [0, 140])
  
  // Progressive image loading
  const { src, blurDataURL, isLoaded } = useProgressiveImage({
    src: imageUrl || '',
  })
  const hasBlurPlaceholder = !!imageUrl && !!blurDataURL && !isLoaded

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
    if (ENABLE_OUTBOUND_INTERSTITIAL && !getOutboundDismissed()) {
      e.preventDefault()
      setPending({ platform, href })
      setInterstitialOpen(true)
      return
    }
    trackStreamingClick(platform, slug)
  }

  const isFreeDownload = releaseType === 'FREE_DOWNLOAD'
  const soundcloudEmbedSrc = soundcloudUrl
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&color=%23a855f7&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`
    : null

  const loopTransition = { duration: 2.6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
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
      {imageUrl && (
        <>
          {/* Blur placeholder */}
          {hasBlurPlaceholder && (
            <motion.div style={{ y: parallaxY }} className="absolute inset-0 scale-110">
              <Image
                src={blurDataURL}
                alt=""
                fill
                className="object-cover object-center z-0 transition-opacity duration-500 opacity-100"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                quality={10}
              />
            </motion.div>
          )}
          {/* Main image */}
          <motion.div style={{ y: parallaxY }} className="absolute inset-0 scale-110">
            <Image
              src={src}
              alt={title}
              fill
              className={`object-cover object-center z-0 transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
              quality={85}
            />
          </motion.div>
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/50 z-10" />

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
            <div className="flex flex-row items-center justify-center gap-3 flex-wrap">
              {youtubeUrl && (
                <motion.div animate={loopAnim} transition={{ ...loopTransition, delay: 0.1 }}>
                  <Button
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleStreamingClick('YouTube', youtubeUrl, e as unknown as React.MouseEvent)}
                    variant="toxic"
                    size="lg"
                    className="group from-red-900/80 via-red-700/80 to-red-900/80 text-red-200"
                  >
                    <FaYoutube className="w-6 h-6 mr-3" />
                    Listen on YouTube
                  </Button>
                </motion.div>
              )}
              {beatportUrl && (
                <motion.div animate={loopAnim} transition={{ ...loopTransition, delay: 0.5 }}>
                  <Button
                    href={beatportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleStreamingClick('Beatport', beatportUrl, e as unknown as React.MouseEvent)}
                    variant="toxic"
                    size="lg"
                    className="group"
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
