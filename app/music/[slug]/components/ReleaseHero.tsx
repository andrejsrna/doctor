'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { FaYoutube, FaHeadphonesAlt } from 'react-icons/fa'
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
  description: string
  gumroadUrl?: string
  slug: string
  releaseType?: 'NORMAL' | 'FREE_DOWNLOAD'
}

export default function ReleaseHero({
  title,
  imageUrl,
  beatportUrl,
  youtubeUrl,
  description,
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
  
  // Progressive image loading
  const { src, blurDataURL, isLoaded } = useProgressiveImage({
    src: imageUrl || '',
  })
  const handleStreamingClick = (platform: string, href: string, e: React.MouseEvent) => {
    if (ENABLE_OUTBOUND_INTERSTITIAL && !getOutboundDismissed()) {
      e.preventDefault()
      setPending({ platform, href })
      setInterstitialOpen(true)
      return
    }
    trackStreamingClick(platform, slug)
  }

  const isFreeDownload = releaseType === 'FREE_DOWNLOAD'

  return (
    <div className="relative flex items-center justify-center text-center px-4 pt-48 pb-24">
      {imageUrl && (
        <>
          {/* Blur placeholder */}
          <Image
            src={blurDataURL}
            alt=""
            fill
            className={`object-cover object-center z-0 transition-opacity duration-500 ${
              isLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            quality={10}
          />
          {/* Main image */}
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

        <motion.div
          initial={shouldReduce ? undefined : { opacity: 0, y: 20 }}
          animate={shouldReduce ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduce ? undefined : { delay: 0.1, type: 'spring', stiffness: 300 }}
          className="prose prose-invert prose-lg text-gray-300 mx-auto"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        <motion.div
          initial={shouldReduce ? undefined : { opacity: 0, scale: 0.8 }}
          animate={shouldReduce ? undefined : { opacity: 1, scale: 1 }}
          transition={shouldReduce ? undefined : { delay: 0.2, type: 'spring', stiffness: 300 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {isFreeDownload ? (
            <form
              className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3"
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
          ) : gumroadUrl ? (
            <a
              href={gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleStreamingClick('Gumroad', gumroadUrl, e)}
            >
              <Button variant="infected" size="lg" className="group">
                <FaHeadphonesAlt className="w-6 h-6 mr-3" />
                Get on Gumroad
              </Button>
            </a>
          ) : (
            <>
              {youtubeUrl && (
                <a 
                  href={youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => handleStreamingClick('YouTube', youtubeUrl, e)}
                >
                  <Button variant="toxic" size="lg" className="group">
                    <FaYoutube className="w-6 h-6 mr-3" />
                    Listen on YouTube
                  </Button>
                </a>
              )}
              {beatportUrl && (
                <a 
                  href={beatportUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => handleStreamingClick('Beatport', beatportUrl, e)}
                >
                  <Button variant="toxic" size="lg" className="group">
                    <Image
                      src="/beatport.svg"
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6 mr-3"
                    />
                    Buy on Beatport
                  </Button>
                </a>
              )}
            </>
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
