'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaPlay } from 'react-icons/fa'
import { displayFont, monoFont } from './brandFonts'
import { plainTitle, splitTitle } from './hero/releaseMeta'
import styles from './MoreFromArtist.module.css'
import { shortDate } from '@/app/utils/shortDate'

export interface Item {
  id: string
  slug: string
  title: string
  coverImageUrl: string | null
  previewUrl: string | null
  publishedAt: string | null
}

interface MoreFromArtistProps {
  artistName: string
  currentPostId: string
  /** Server-loaded releases: rendered straight into the HTML, no client fetch. */
  initialItems?: Item[]
  /** Small line above the name, e.g. "Releases by" on the artist page. */
  lead?: string
}

const PAGE = 4

const fmtDate = (iso: string | null) => (iso ? shortDate(iso) : 'TBA')

const pad = (n: number) => String(n).padStart(2, '0')

export default function MoreFromArtist({ artistName, currentPostId, initialItems, lead = 'More from' }: MoreFromArtistProps) {
  const [items, setItems] = useState<Item[]>(initialItems ?? [])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(initialItems ? 'ready' : 'loading')
  const [visible, setVisible] = useState(PAGE)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [inView, setInView] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!artistName || initialItems) return
    let cancelled = false
    fetch(`/api/posts/by-artist?artist=${encodeURIComponent(artistName)}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch posts')
        return r.json()
      })
      .then((data: { items?: Item[] }) => {
        if (cancelled) return
        setItems((data.items || []).filter((p) => p.id !== currentPostId))
        setStatus('ready')
      })
      .catch((err) => {
        console.error('Error:', err)
        if (!cancelled) setStatus('error')
      })
    return () => { cancelled = true }
  }, [artistName, currentPostId, initialItems])

  useEffect(() => () => audioRef.current?.pause(), [])

  // Staggered entry once the section scrolls into view.
  useEffect(() => {
    const el = rootRef.current
    if (!el || inView || status !== 'ready') return
    if (!('IntersectionObserver' in window)) { setInView(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect() }
    }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [status, inView])

  const togglePreview = async (item: Item) => {
    if (!item.previewUrl) return
    setAudioError(null)
    if (playingId === item.id) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }
    audioRef.current?.pause()
    const audio = new Audio(item.previewUrl)
    audio.onended = () => setPlayingId((id) => (id === item.id ? null : id))
    audioRef.current = audio
    try {
      await audio.play()
      setPlayingId(item.id)
    } catch (err) {
      console.error('Audio playback error:', err)
      setPlayingId(null)
      setAudioError(item.id)
    }
  }

  const fonts = `${displayFont.variable} ${monoFont.variable}`

  if (status === 'loading') {
    return (
      <section className={`${styles.root} ${fonts}`} aria-busy="true" aria-label={`More from ${artistName}`}>
        <div className={styles.head}>
          <p className={styles.kicker}><span>Discography</span><span aria-hidden="true">{'//'}</span><span>scanning…</span></p>
          <div className={styles.skelTitle} />
        </div>
        <div className={styles.grid}>
          {Array.from({ length: PAGE }).map((_, i) => <div key={i} className={styles.skel} />)}
        </div>
      </section>
    )
  }

  if (status === 'error' || items.length === 0) return null

  return (
    <section ref={rootRef} className={`${styles.root} ${fonts}`} data-in={inView ? '' : undefined} aria-labelledby="more-from-title">
      <div className={styles.head}>
        <p className={styles.kicker}>
          <span>Discography</span>
          <span aria-hidden="true">{'//'}</span>
          <span>{pad(items.length)} {items.length === 1 ? 'transmission' : 'transmissions'}</span>
        </p>
        <h2 id="more-from-title" className={styles.title}>
          <span className={styles.more}>{lead}</span>
          <span className={styles.name} data-size={artistName.length > 14 ? 'l' : undefined}>{artistName}</span>
        </h2>
      </div>

      <ol className={styles.grid}>
        {items.slice(0, visible).map((item, i) => {
          const { artist, title } = splitTitle(plainTitle(item.title), null)
          const playing = playingId === item.id
          const proxied = item.coverImageUrl ? `/_next/image?url=${encodeURIComponent(item.coverImageUrl)}&w=640&q=75` : null
          return (
            <li key={item.id} className={styles.card} style={{ '--i': i % PAGE } as React.CSSProperties} data-playing={playing ? '' : undefined}>
              <Link href={`/music/${item.slug}`} className={styles.link}>
                <span className={styles.cover}>
                  {item.coverImageUrl ? (
                    <Image src={item.coverImageUrl} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 320px" className={styles.img} />
                  ) : (
                    <span className={styles.noCover} aria-hidden="true">No signal</span>
                  )}
                  {proxied && (
                    <>
                      <span className={`${styles.split} ${styles.splitR}`} aria-hidden="true" style={{ backgroundImage: `url(${proxied})` }} />
                      <span className={`${styles.split} ${styles.splitG}`} aria-hidden="true" style={{ backgroundImage: `url(${proxied})` }} />
                    </>
                  )}
                  <span className={styles.scan} aria-hidden="true" />
                  <span className={styles.idx} aria-hidden="true">{pad(i + 1)}</span>
                  <span className={styles.open} aria-hidden="true">Open <b>→</b></span>
                </span>
                <time className={styles.date} dateTime={item.publishedAt ?? undefined}>{fmtDate(item.publishedAt)}</time>
                <span className={styles.cardTitle}>{title}</span>
                {artist && artist.toLowerCase() !== artistName.toLowerCase() && <span className={styles.cardArtist}>{artist}</span>}
              </Link>
              {item.previewUrl && (
                <button
                  type="button"
                  className={styles.play}
                  onClick={() => togglePreview(item)}
                  aria-pressed={playing}
                  aria-label={`${playing ? 'Pause' : 'Play'} preview of ${title}`}
                >
                  {playing ? <span className={styles.eq} aria-hidden="true"><i /><i /><i /><i /></span> : <FaPlay aria-hidden="true" />}
                </button>
              )}
              {audioError === item.id && <p className={styles.err} role="status">Preview unavailable</p>}
            </li>
          )
        })}
      </ol>

      {items.length > visible && (
        <button type="button" className={styles.loadMore} onClick={() => setVisible((v) => v + PAGE)}>
          <span>Load more</span>
          <span className={styles.loadCount}>+{Math.min(PAGE, items.length - visible)}</span>
        </button>
      )}
    </section>
  )
}
