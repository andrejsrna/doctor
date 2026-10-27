'use client'

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, type ComponentType } from 'react'
import { FaApple, FaDeezer, FaDownload, FaHeadphonesAlt, FaSoundcloud, FaSpotify, FaYoutube } from 'react-icons/fa'
import { trackStreamingClick } from '@/app/utils/analytics'
import OutboundInterstitial, { getOutboundDismissed } from '@/app/components/OutboundInterstitial'
import { ENABLE_OUTBOUND_INTERSTITIAL } from '@/app/utils/flags'
import type { StreamingLink } from '@/app/types/release'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import styles from './release.module.css'
import { shortDate } from '@/app/utils/shortDate'
import BuyButton, { type BuyOffer } from '@/app/components/shop/BuyButton'
import AddToCartButton from '@/app/components/shop/AddToCartButton'

const SignalField = dynamic(() => import('@/app/components/hero/SignalField'), { ssr: false })

export type AdjacentRelease = { slug: string; artist: string | null; title: string } | null

interface ReleaseHeroProps {
  slug: string
  artist: string | null
  title: string
  fullTitle: string
  coverUrl?: string
  artworkUrl?: string
  typeLabel: string
  catalogue: string | null
  publishedAt: string | null
  index: number | null
  total: number
  beatportUrl?: string
  youtubeUrl?: string
  soundcloudUrl?: string
  gumroadUrl?: string
  offer?: BuyOffer | null
  releaseType?: 'NORMAL' | 'FREE_DOWNLOAD'
  streamingLinks?: StreamingLink[]
  storyHtml?: string
  prev: AdjacentRelease
  next: AdjacentRelease
}

const proxied = (url: string) => `/_next/image?url=${encodeURIComponent(url)}&w=1080&q=75`

const fmtDate = (iso: string | null) =>
  iso ? shortDate(iso) : 'TBA'

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
      if (parsed.pathname === '/watch') videoId = parsed.searchParams.get('v') || ''
      else if (parsed.pathname.startsWith('/shorts/') || parsed.pathname.startsWith('/embed/')) videoId = parsed.pathname.split('/')[2] || ''
    }
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
    if (playlistId) return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}`
    return null
  } catch {
    return null
  }
}

function PlatformIcon({ icon }: { icon: StreamingLink['icon'] }) {
  if (typeof icon === 'string') {
    if (icon.startsWith('/')) return <Image src={icon} alt="" width={22} height={22} className={styles.svgIcon} />
    const map: Record<string, ComponentType<{ className?: string }>> = {
      spotify: FaSpotify, apple: FaApple, deezer: FaDeezer, soundcloud: FaSoundcloud, download: FaDownload, youtube: FaYoutube,
    }
    const Icon = map[icon.toLowerCase()] || FaHeadphonesAlt
    return <Icon />
  }
  const Icon = icon
  return <Icon />
}

const verbFor = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('beatport') || n.includes('bandcamp') || n.includes('gumroad')) return 'Buy'
  if (n.includes('juno')) return 'Archive'
  if (n.includes('youtube')) return 'Watch'
  return 'Stream'
}

/** Adds data-in to sections as they scroll into view (CSS handles the reveal). */
function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const targets = el.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      targets.forEach((t) => t.setAttribute('data-in', ''))
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.setAttribute('data-in', '')
          io.unobserve(e.target)
        }
      }),
      { rootMargin: '0px 0px -12% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [root])
}

function FreeDownloadForm({ slug }: { slug: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptNewsletter, setAcceptNewsletter] = useState(false)
  const reset = () => { if (status !== 'idle') setStatus('idle') }

  return (
    <form
      className={styles.form}
      onSubmit={async (e) => {
        e.preventDefault()
        setError('')
        if (!acceptPrivacy || !acceptNewsletter) {
          setStatus('error')
          setError('Please accept the privacy policy and newsletter subscription to continue.')
          return
        }
        setStatus('loading')
        try {
          const res = await fetch(`/api/releases/${slug}/request-download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, acceptPrivacy, acceptNewsletter }),
          })
          if (!res.ok) {
            const json = await res.json().catch(() => null)
            throw new Error(json?.error || 'Failed to send download email')
          }
          setStatus('sent')
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Failed to send download email')
          setStatus('error')
        }
      }}
    >
      <label className={styles.fieldLabel} htmlFor="dl-email">Free download — enter your email</label>
      <div className={styles.inputRow}>
        <input
          id="dl-email"
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); reset() }}
          placeholder="you@domain.com"
          className={styles.input}
        />
        <button type="submit" className={styles.submit} disabled={status === 'loading' || status === 'sent'}>
          {status === 'sent' ? 'Sent' : status === 'loading' ? 'Sending…' : 'Get link'}
        </button>
      </div>
      <label className={styles.check}>
        <input type="checkbox" required checked={acceptPrivacy} onChange={(e) => { setAcceptPrivacy(e.target.checked); reset() }} />
        <span>I agree to the <Link href="/privacy-policy">Privacy Policy</Link>.</span>
      </label>
      <label className={styles.check}>
        <input type="checkbox" required checked={acceptNewsletter} onChange={(e) => { setAcceptNewsletter(e.target.checked); reset() }} />
        <span>Add me to the DnB Doctor newsletter (unsubscribe anytime).</span>
      </label>
      {(status === 'sent' || status === 'error') && (
        <p className={styles.formMsg} data-state={status} role="status">
          {status === 'sent' ? 'Check your inbox for the download link.' : error || 'Something went wrong.'}
        </p>
      )}
    </form>
  )
}

export default function ReleaseHero(props: ReleaseHeroProps) {
  const {
    slug, artist, title, fullTitle, coverUrl, artworkUrl, typeLabel, catalogue, publishedAt, index, total,
    beatportUrl, youtubeUrl, soundcloudUrl, gumroadUrl, offer, releaseType, streamingLinks = [], storyHtml, prev, next,
  } = props
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLElement>(null)
  const slotRef = useRef<HTMLAnchorElement>(null)
  const [glReady, setGlReady] = useState(false)
  const [storyOpen, setStoryOpen] = useState(false)
  const [storyClipped, setStoryClipped] = useState(true)
  const logRef = useRef<HTMLDivElement>(null)
  const [interstitialOpen, setInterstitialOpen] = useState(false)
  const [pending, setPending] = useState<{ platform: string; href: string } | null>(null)
  useReveal(rootRef)

  // Only offer "decrypt" when the log is actually taller than the preview.
  useEffect(() => {
    const el = logRef.current
    if (!el) return
    const preview = 15 * parseFloat(getComputedStyle(document.documentElement).fontSize) // .logText max-height
    const check = () => setStoryClipped((el.firstElementChild?.scrollHeight ?? 0) > preview + 8)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [storyHtml])

  const handleOut = (platform: string, href: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (ENABLE_OUTBOUND_INTERSTITIAL && !getOutboundDismissed()) {
      setPending({ platform, href })
      setInterstitialOpen(true)
      return
    }
    trackStreamingClick(platform, slug)
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const isFree = releaseType === 'FREE_DOWNLOAD'
  const coverSrc = coverUrl ? proxied(coverUrl) : null
  const artSrc = artworkUrl ? proxied(artworkUrl) : coverSrc
  const youtubeEmbed = getYoutubeEmbed(youtubeUrl)
  const soundcloudEmbed = soundcloudUrl
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&color=%2339ff14&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`
    : null

  // One ordered list of exits: buy first, then streaming by priority.
  const access: { name: string; url: string; icon: StreamingLink['icon']; deprecated?: boolean }[] = []
  // Sold on-site: the native Buy button replaces the Gumroad exit.
  if (gumroadUrl && !offer) access.push({ name: 'Gumroad', url: gumroadUrl, icon: 'download' })
  if (beatportUrl) access.push({ name: 'Beatport', url: beatportUrl, icon: '/beatport.svg' })
  streamingLinks
    .filter((l) => !!l.url && !['beatport', 'youtube'].includes(l.name.toLowerCase()))
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .forEach((l) => access.push({ name: l.name, url: l.url!, icon: l.icon, deprecated: l.deprecated }))
  if (youtubeUrl) access.push({ name: 'YouTube', url: youtubeUrl, icon: 'youtube' })

  const primary = isFree || offer ? undefined : access.find((a) => !a.deprecated)
  const ticker = `${artist ? `${artist} — ` : ''}${title}`
  const pad = (n: number) => String(n).padStart(3, '0')

  return (
    <div ref={rootRef} className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      {/* ============ STAGE ============ */}
      <section ref={stageRef} className={`${styles.stage} ${glReady ? styles.glReady : ''}`} aria-labelledby="release-title">
        <div className={styles.field}>
          {coverSrc && artSrc && (
            <SignalField coverSrc={coverSrc} artSrc={artSrc} slotRef={slotRef} rootRef={stageRef} onReady={() => setGlReady(true)} />
          )}
        </div>
        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.inner}>
          <div className={styles.meta}>
            <nav aria-label="Breadcrumb" className={styles.crumbs}>
              <Link href="/">DnB Doctor</Link>
              <span aria-hidden="true">/</span>
              <Link href="/music">Music</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{title}</span>
            </nav>
            {index !== null && (
              <span className={styles.tx}>
                Transmission <b>{pad(index)}</b>/{pad(total)}
              </span>
            )}
            <span className={styles.bpm} aria-hidden="true">174 BPM</span>
          </div>

          <div className={styles.grid}>
            <div className={styles.copy}>
              <p className={styles.tags}>
                {catalogue && <span>{catalogue}</span>}
                <span>{typeLabel}</span>
                <span>{fmtDate(publishedAt)}</span>
                {isFree && <span data-free="">Free download</span>}
              </p>
              {artist && <p className={styles.artist}>{artist}</p>}
              <h1 id="release-title" className={styles.title} data-size={title.length > 22 ? 'xl' : title.length > 12 ? 'l' : undefined}>
                <span>{title}</span>
              </h1>

              <div className={styles.actions}>
                {offer && !isFree && <BuyButton offer={offer} className={styles.primary} />}
                {offer && !isFree && <AddToCartButton offer={offer} className={styles.secondary} />}
                {primary && (
                  <a className={styles.primary} href={primary.url} target="_blank" rel="noopener noreferrer" onClick={(e) => handleOut(primary.name, primary.url, e)}>
                    <span className={styles.ico}><PlatformIcon icon={primary.icon} /></span>
                    {verbFor(primary.name)} on {primary.name}
                  </a>
                )}
                {isFree && (
                  <a className={styles.primary} href="#signal">
                    <FaDownload aria-hidden="true" /> Free download
                  </a>
                )}
                <a className={styles.secondary} href="#signal">
                  Listen <span aria-hidden="true">↓</span>
                </a>
                {storyHtml && (
                  <a className={styles.ghost} href="#log">
                    Read the log <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </div>

            <a
              ref={slotRef}
              href={artworkUrl || coverUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.slot}
              aria-label={`Open full artwork for ${fullTitle}`}
            >
              {coverUrl && (
                <Image src={coverUrl} alt={fullTitle} fill priority sizes="(max-width: 1024px) 80vw, 520px" className={styles.slotImg} />
              )}
              <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
              <span className={styles.slotTag} aria-hidden="true">{catalogue ?? 'DNB DOCTOR'} · ART</span>
            </a>
          </div>

          <dl className={styles.spec}>
            <div><dt>Cat. no.</dt><dd>{catalogue ?? '—'}</dd></div>
            <div><dt>Format</dt><dd>{typeLabel}</dd></div>
            <div><dt>Released</dt><dd>{fmtDate(publishedAt)}</dd></div>
            <div><dt>Label</dt><dd>DnB Doctor</dd></div>
            <div><dt>Genre</dt><dd>Neurofunk</dd></div>
            <div><dt>Tempo</dt><dd className={styles.tempo}>174</dd></div>
          </dl>
        </div>
      </section>

      {/* ============ TICKER ============ */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.track}>
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              {Array.from({ length: 4 }).map((__, i) => (
                <span key={i}>
                  <b>{ticker}</b> <i>✕</i> {isFree ? 'Free download' : 'Out now'} <i>✕</i> DnB Doctor <i>✕</i>{' '}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ============ SIGNAL: player + exits ============ */}
      <section id="signal" className={styles.signal} aria-label="Listen and buy">
        <div className={styles.monitor} data-reveal="">
          <header className={styles.panelHead}>
            <span>01 // Signal</span>
            <span>{youtubeEmbed ? 'Video feed' : soundcloudEmbed ? 'Audio feed' : 'No feed'}</span>
          </header>
          {youtubeEmbed || soundcloudEmbed ? (
            <div className={youtubeEmbed ? styles.screen : styles.screenAudio}>
              {youtubeEmbed ? (
                <iframe
                  title={`${fullTitle} — YouTube`}
                  src={youtubeEmbed}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <iframe title={`${fullTitle} — SoundCloud`} src={soundcloudEmbed!} loading="lazy" allow="autoplay" />
              )}
            </div>
          ) : (
            <div className={styles.noFeed}>Signal not yet broadcast.</div>
          )}
          {youtubeEmbed && soundcloudUrl && (
            <a className={styles.alt} href={soundcloudUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => handleOut('SoundCloud', soundcloudUrl, e)}>
              <FaSoundcloud aria-hidden="true" /> Also on SoundCloud →
            </a>
          )}
        </div>

        <div className={styles.exits} data-reveal="">
          <header className={styles.panelHead}>
            <span>02 // {isFree ? 'Download' : 'Access points'}</span>
            <span>{access.length} {access.length === 1 ? 'exit' : 'exits'}</span>
          </header>

          {isFree && <FreeDownloadForm slug={slug} />}

          {access.length > 0 && (
            <ol className={styles.exitList}>
              {access.map((a, i) => (
                <li key={a.name} style={{ '--i': i } as React.CSSProperties}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer" onClick={(e) => handleOut(a.name, a.url, e)} data-deprecated={a.deprecated ? '' : undefined}>
                    <span className={styles.exitNo}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.exitIco}><PlatformIcon icon={a.icon} /></span>
                    <span className={styles.exitName}>{a.name}</span>
                    <span className={styles.exitVerb}>{verbFor(a.name)} <span aria-hidden="true">→</span></span>
                  </a>
                  {a.deprecated && <p className={styles.exitNote}>New purchases no longer available. Previously bought tracks can still be downloaded via your Juno account.</p>}
                </li>
              ))}
            </ol>
          )}

          {artworkUrl && (
            <a className={styles.alt} href={artworkUrl} target="_blank" rel="noopener noreferrer">
              <FaDownload aria-hidden="true" /> Download cover art — free
            </a>
          )}
        </div>
      </section>

      {/* ============ LOG ============ */}
      {storyHtml && (
        <section id="log" className={styles.log} data-reveal="" aria-labelledby="log-title">
          <div className={styles.logHead}>
            <p className={styles.panelHeadPlain}>03 // Transmission log</p>
            <h2 id="log-title" className={styles.logTitle}>
              Story<br />protocol
            </h2>
            {catalogue && <p className={styles.logCat}>{catalogue}</p>}
          </div>
          <div className={styles.logBody}>
            <div ref={logRef} className={styles.logText} data-open={storyOpen || !storyClipped ? '' : undefined} id="log-text">
              <div className={styles.prose} dangerouslySetInnerHTML={{ __html: storyHtml }} />
            </div>
            {(storyClipped || storyOpen) && (
            <button type="button" className={styles.decrypt} onClick={() => setStoryOpen((v) => !v)} aria-expanded={storyOpen} aria-controls="log-text">
              {storyOpen ? 'Collapse log' : 'Decrypt full log'} <span aria-hidden="true">{storyOpen ? '↑' : '↓'}</span>
            </button>
            )}
          </div>
        </section>
      )}

      {/* ============ PREV / NEXT ============ */}
      {(prev || next) && (
        <nav className={styles.adjacent} aria-label="More releases">
          {prev ? (
            <Link href={`/music/${prev.slug}`} className={styles.adj}>
              <span className={styles.adjDir}>← Older</span>
              {prev.artist && <span className={styles.adjArtist}>{prev.artist}</span>}
              <span className={styles.adjTitle}>{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/music/${next.slug}`} className={`${styles.adj} ${styles.adjNext}`}>
              <span className={styles.adjDir}>Newer →</span>
              {next.artist && <span className={styles.adjArtist}>{next.artist}</span>}
              <span className={styles.adjTitle}>{next.title}</span>
            </Link>
          ) : <span />}
        </nav>
      )}

      <OutboundInterstitial
        isOpen={interstitialOpen}
        destination={pending?.platform}
        onClose={() => setInterstitialOpen(false)}
        onContinue={() => {
          const target = pending
          setInterstitialOpen(false)
          setPending(null)
          if (target?.href) {
            trackStreamingClick(target.platform, slug)
            window.open(target.href, '_blank', 'noopener,noreferrer')
          }
        }}
      />
    </div>
  )
}
