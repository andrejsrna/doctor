'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { FaDiscord, FaEnvelope, FaFacebook, FaInstagram, FaLink, FaPlay, FaSpotify, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { trackEvent } from '@/app/utils/analytics'
import { djLinks } from '@/lib/affiliates'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { plainTitle, splitTitle } from '@/app/components/hero/releaseMeta'
import MoreFromArtist from '@/app/components/MoreFromArtist'
import ChannelStack, { type Channel } from '@/app/components/ChannelStack'
import styles from './outro.module.css'
import { shortDate } from '@/app/utils/shortDate'

const OutroField = dynamic(() => import('@/app/components/hero/SignalBackdrop'), { ssr: false })

type Rec = { id: string; slug: string; title: string; artistName: string | null; previewUrl?: string | null; imageUrl?: string | null }
type News = { id: string; slug: string; title: string; publishedAt?: string | null }

const PAGE = 8

const CHANNELS: Channel[] = [
  { id: 'newsletter', icon: FaEnvelope, kicker: 'Direct line', word: 'Newsletter', note: 'No algorithm, no noise. Early access and exclusive updates straight to your inbox.', cta: 'Join the inner circle', href: '/newsletter', hue: '#39ff14', priority: true },
  { id: 'spotify', icon: FaSpotify, kicker: 'Playlist', word: 'Spotify', note: 'Curated selections of the sharpest neurofunk and drum & bass, updated continuously.', cta: 'Follow on Spotify', href: 'https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9', hue: '#1ed760' },
  { id: 'instagram', icon: FaInstagram, kicker: 'Social', word: 'Instagram', note: 'Behind-the-scenes, release previews and label life — follow along.', cta: 'Follow on Instagram', href: 'https://www.instagram.com/dnbdoctor', hue: '#ff3d9a' },
  { id: 'discord', icon: FaDiscord, kicker: 'Community', word: 'Discord', note: 'Connect with the DnB Doctor community, catch updates early and talk neurofunk with the crew.', cta: 'Join Discord', href: 'https://discord.gg/GE2HWFdgXG', hue: '#7b83ff' },
  { id: 'youtube', icon: FaYoutube, kicker: 'Video', word: 'YouTube', note: 'Exclusive premieres and visuals. Get notified the moment new drops land.', cta: 'Subscribe on YouTube', href: 'https://www.youtube.com/@dnbdoctor1', hue: '#ff004d' },
]

const SHARES: { name: string; icon: ComponentType; url: (u: string, t: string) => string }[] = [
  { name: 'Facebook', icon: FaFacebook, url: (u, t) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
  { name: 'X', icon: FaXTwitter, url: (u, t) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
  { name: 'WhatsApp', icon: FaWhatsapp, url: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}` },
]

const fmtDate = (iso?: string | null) =>
  shortDate(iso)

/** Mark [data-reveal] descendants as in-view once (CSS does the motion). */
function useReveal(root: React.RefObject<HTMLElement | null>, deps: unknown[]) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const targets = el.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** Side rail: lists only chapters that actually rendered; highlights the active one. */
function useChapters(content: React.RefObject<HTMLElement | null>) {
  const [chapters, setChapters] = useState<{ id: string; label: string }[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const el = content.current
    if (!el) return
    let io: IntersectionObserver | null = null
    const scan = () => {
      const nodes = [...el.querySelectorAll<HTMLElement>('[data-chapter]')].filter((n) => n.offsetHeight > 0)
      setChapters((prev) => {
        const next = nodes.map((n) => ({ id: n.id, label: n.dataset.chapter! }))
        return prev.length === next.length && prev.every((p, i) => p.id === next[i].id) ? prev : next
      })
      io?.disconnect()
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
        { rootMargin: '-45% 0px -50% 0px' },
      )
      nodes.forEach((n) => io!.observe(n))
    }
    scan()
    const ro = new ResizeObserver(scan)
    ro.observe(el)
    return () => { ro.disconnect(); io?.disconnect() }
  }, [content])

  return { chapters, active }
}

function ChapterHead({ id, kicker, title, outline, aside }: { id: string; kicker: string; title: string; outline?: string; aside?: React.ReactNode }) {
  return (
    <header className={styles.chHead} data-reveal="">
      <p className={styles.kicker}>
        <span className={styles.num} aria-hidden="true" />
        <span>{kicker}</span>
      </p>
      <h2 id={id} className={styles.chTitle}>
        {outline && <span className={styles.outline}>{outline}</span>}
        <span className={styles.solid}>{title}</span>
      </h2>
      {aside && <div className={styles.chAside}>{aside}</div>}
    </header>
  )
}

/* ---------------- 02 · You may also like ---------------- */
function Recommended({ slug }: { slug: string }) {
  const [items, setItems] = useState<Rec[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [playing, setPlaying] = useState<string | null>(null)
  const [failed, setFailed] = useState<string | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)
  const rail = useRef<HTMLOListElement>(null)
  const ref = useRef<HTMLElement>(null)

  const load = useCallback(async (p: number) => {
    const res = await fetch(`/api/releases/recommended?slug=${encodeURIComponent(slug)}&page=${p}&limit=${PAGE}`)
    if (!res.ok) throw new Error('Failed to load')
    return res.json() as Promise<{ items?: Rec[]; hasMore?: boolean }>
  }, [slug])

  useEffect(() => {
    let alive = true
    load(1)
      .then((d) => { if (alive) { setItems(d.items || []); setHasMore(!!d.hasMore) } })
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => { alive = false; audio.current?.pause() }
  }, [load])

  useReveal(ref, [items.length])

  const more = async () => {
    if (loadingMore) return
    setLoadingMore(true)
    try {
      const d = await load(page + 1)
      setItems((prev) => [...prev, ...(d.items || [])])
      setHasMore(!!d.hasMore)
      setPage((p) => p + 1)
    } catch {
      /* keep what we have */
    } finally {
      setLoadingMore(false)
    }
  }

  const toggle = async (it: Rec) => {
    if (!it.previewUrl) return
    setFailed(null)
    if (playing === it.id) { audio.current?.pause(); setPlaying(null); return }
    audio.current?.pause()
    const a = new Audio(it.previewUrl)
    a.onended = () => setPlaying((id) => (id === it.id ? null : id))
    audio.current = a
    try { await a.play(); setPlaying(it.id) } catch { setPlaying(null); setFailed(it.id) }
  }

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  if (loading || items.length === 0) return null

  return (
    <section ref={ref} id="outro-recommended" data-chapter="Also like" className={styles.chapter} aria-labelledby="rec-title">
      <ChapterHead
        id="rec-title" kicker="Infection vectors // matched by sound"
        outline="You may"
        title="Also like"
        aside={
          <div className={styles.railNav}>
            <button type="button" onClick={() => scrollBy(-1)} aria-label="Scroll recommendations left">←</button>
            <button type="button" onClick={() => scrollBy(1)} aria-label="Scroll recommendations right">→</button>
          </div>
        }
      />
      <ol ref={rail} className={styles.rail} data-reveal="">
        {items.map((it, i) => {
          const { artist, title } = splitTitle(plainTitle(it.title), it.artistName)
          const on = playing === it.id
          return (
            <li key={it.id} className={styles.recCard} data-playing={on ? '' : undefined}>
              <Link href={`/music/${it.slug}`} className={styles.recLink}>
                <span className={styles.recCover}>
                  {it.imageUrl ? (
                    <Image src={it.imageUrl} alt="" fill sizes="(max-width: 640px) 70vw, 300px" className={styles.recImg} />
                  ) : (
                    <span className={styles.noCover}>No signal</span>
                  )}
                  <span className={styles.scan} aria-hidden="true" />
                  <span className={styles.recIdx} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className={styles.recArtist}>{artist ?? 'DnB Doctor'}</span>
                <span className={styles.recTitle}>{title}</span>
              </Link>
              {it.previewUrl && (
                <button type="button" className={styles.play} onClick={() => toggle(it)} aria-pressed={on} aria-label={`${on ? 'Pause' : 'Play'} preview of ${title}`}>
                  {on ? <span className={styles.eq} aria-hidden="true"><i /><i /><i /><i /></span> : <FaPlay aria-hidden="true" />}
                </button>
              )}
              {failed === it.id && <p className={styles.err} role="status">Preview unavailable</p>}
            </li>
          )
        })}
        {hasMore && (
          <li className={styles.recMore}>
            <button type="button" onClick={more} disabled={loadingMore}>
              <span className={styles.recMorePlus} aria-hidden="true">+</span>
              {loadingMore ? 'Loading…' : `Load ${PAGE} more`}
            </button>
          </li>
        )}
      </ol>
    </section>
  )
}

/* ---------------- 03 · Don't miss the next drop ---------------- */
function NextDrop() {
  return (
    <section id="outro-drop" data-chapter="Next drop" className={styles.chapter} aria-labelledby="drop-title">
      <ChapterHead id="drop-title" kicker="Stay connected // 5 channels" outline="Don't miss the" title="Next drop" />
      <ChannelStack channels={CHANNELS} />
    </section>
  )
}

/* ---------------- 04 · Spread the disease ---------------- */
function Spread({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const words = ['Spread', 'the', 'disease']

  const share = (method: string) => trackEvent('share', { method, content_type: 'music_release', content_name: title })

  const copy = async () => {
    share('copy_link')
    try {
      if (navigator.share) { await navigator.share({ title, url }); return }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* user cancelled share sheet or clipboard blocked */
    }
  }

  return (
    <section id="outro-spread" data-chapter="Spread" className={styles.chapter} aria-labelledby="spread-title">
      <header className={styles.chHead} data-reveal="">
        <p className={styles.kicker}><span className={styles.num} aria-hidden="true" /><span>Amplify the release // every share helps discovery</span></p>
      </header>
      <h2 id="spread-title" className={styles.spreadTitle} data-reveal="">
        {words.map((w, wi) => (
          <span key={w} className={styles.spreadWord}>
            {[...w].map((ch, ci) => (
              <span key={ci} className={styles.cell} style={{ '--d': (wi * 7 + ci) % 11 } as React.CSSProperties}>{ch}</span>
            ))}
          </span>
        ))}
      </h2>
      <p className={styles.spreadNote} data-reveal="">
        Share this release with your crew and push it into more sets, playlists and feeds.
      </p>
      <div className={styles.shareGrid} data-reveal="">
        {SHARES.map((s) => {
          const Icon = s.icon
          return (
            <a
              key={s.name}
              href={s.url(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.share}
              onClick={() => share(s.name)}
            >
              <span className={styles.shareIcon}><Icon /></span>
              <span className={styles.shareName}>{s.name}</span>
              <span aria-hidden="true">↗</span>
            </a>
          )
        })}
        <button type="button" className={`${styles.share} ${styles.shareCopy}`} onClick={copy} data-copied={copied ? '' : undefined}>
          <span className={styles.shareIcon}><FaLink /></span>
          <span className={styles.shareName}>{copied ? 'Copied' : 'Copy link'}</span>
          <span className={styles.shareUrl}>{url.replace('https://', '')}</span>
        </button>
      </div>
    </section>
  )
}

/* ---------------- 05 · Bulk sale ---------------- */
function Bulk() {
  return (
    <section id="outro-bulk" data-chapter="Bulk sale" className={`${styles.chapter} ${styles.bulk}`} aria-labelledby="bulk-title">
      <div className={styles.hazard} aria-hidden="true" />
      <div className={styles.bulkInner} data-reveal="">
        <div className={styles.bulkCopy}>
          <p className={styles.kicker}><span className={styles.num} aria-hidden="true" /><span>Limited offer // DJs, podcast sets, curators</span></p>
          <h2 id="bulk-title" className={styles.bulkTitle}>Bulk<br />sale</h2>
          <p className={styles.bulkNote}>
            Save <b>35%</b> when you buy multiple tracks. Instant access to discounted bundle pricing.
          </p>
          <Link
            href="/bulk-sale"
            className={styles.bulkCta}
            onClick={() => trackEvent('promotion_click', { promotion_type: 'bulk_sale', content_type: 'promotion', content_name: 'Bulk Sale Promotion' })}
          >
            Open bulk sale <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className={styles.bulkPct} aria-hidden="true">
          <span>−35</span><span>%</span>
        </p>
      </div>
      <div className={styles.hazard} aria-hidden="true" />
    </section>
  )
}

/* ---------------- 06 · Related news ---------------- */
function Intel({ relatedBy }: { relatedBy: string }) {
  const [posts, setPosts] = useState<News[]>([])
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    let alive = true
    const params = new URLSearchParams({ page: '1', limit: '6' })
    if (relatedBy) params.append('search', relatedBy)
    fetch(`/api/news?${params}`)
      .then((r) => r.json())
      .then((d: { items?: News[] }) => { if (alive) setPosts((d.items || []).slice(0, 3)) })
      .catch(() => {})
    return () => { alive = false }
  }, [relatedBy])
  useReveal(ref, [posts.length])

  if (posts.length === 0) return null
  return (
    <section ref={ref} id="outro-intel" data-chapter="Intel" className={styles.chapter} aria-labelledby="intel-title">
      <ChapterHead id="intel-title" kicker="Field reports // from the newsroom" outline="Related" title="Intel" />
      <ol className={styles.intel}>
        {posts.map((p, i) => (
          <li key={p.id} data-reveal="" style={{ '--i': i } as React.CSSProperties}>
            <Link href={`/news/${p.slug}`} className={styles.intelRow}>
              <time dateTime={p.publishedAt ?? undefined}>{fmtDate(p.publishedAt)}</time>
              <span className={styles.intelTitle}>{plainTitle(p.title)}</span>
              <span className={styles.intelGo} aria-hidden="true">Read →</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ---------------- 07 · Buy online ---------------- */
function Stores() {
  return (
    <section id="outro-stores" data-chapter="Buy online" className={styles.chapter} aria-labelledby="stores-title">
      <ChapterHead id="stores-title" kicker="Supply lines // where DJs buy" outline="Buy DnB tracks" title="Online" />
      <ul className={styles.stores}>
        {djLinks.map((l, i) => (
          <li key={l.name} data-reveal="" style={{ '--i': i } as React.CSSProperties}>
            <a href={l.url} target="_blank" rel="noopener noreferrer sponsored" className={styles.store}>
              <span className={styles.storeName}>{l.name}</span>
              <span className={styles.storeTag}>{l.tagline}</span>
              <span className={styles.storeDesc}>{l.description}</span>
              <span className={styles.storeGo} aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.disclaimer}>Some links are affiliate links. We may earn a commission at no extra cost to you.</p>
    </section>
  )
}

export default function ReleaseOutro({
  slug, releaseId, moreArtist, shareUrl, shareTitle, relatedBy,
}: {
  slug: string
  releaseId: string
  moreArtist: string
  shareUrl: string
  shareTitle: string
  relatedBy: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { chapters, active } = useChapters(contentRef)
  useReveal(rootRef, [])

  return (
    <div ref={rootRef} className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <div className={styles.fieldWrap} aria-hidden="true">
        <OutroField rootRef={rootRef} />
      </div>

      {chapters.length > 1 && (
        <div className={styles.railWrap}>
          <nav className={styles.chapterRail} aria-label="Sections">
            {chapters.map((c, i) => (
              <a key={c.id} href={`#${c.id}`} data-active={active === c.id ? '' : undefined}>
                <span className={styles.railNo}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.railLabel}>{c.label}</span>
              </a>
            ))}
          </nav>
        </div>
      )}

      <div ref={contentRef} className={styles.content}>
        {moreArtist && (
          <div id="outro-more" data-chapter="More from" className={`${styles.chapter} ${styles.moreWrap}`}>
            <MoreFromArtist artistName={moreArtist} currentPostId={releaseId} />
          </div>
        )}
        <Recommended slug={slug} />
        <NextDrop />
        <Spread url={shareUrl} title={shareTitle} />
        <Bulk />
        <Intel relatedBy={relatedBy} />
        <Stores />

        <p className={styles.eot} aria-hidden="true">
          <span>End of transmission</span>
          <span className={styles.cursor} />
        </p>
      </div>
    </div>
  )
}
