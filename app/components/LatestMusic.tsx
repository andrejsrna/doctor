'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import StreamingMenu from '@/app/components/StreamingMenu'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { plainTitle, splitTitle, typeLabel } from '@/app/components/hero/releaseMeta'
import styles from './LatestMusic.module.css'

const SignalBackdrop = dynamic(() => import('@/app/components/hero/SignalBackdrop'), { ssr: false })

interface Release {
  id: string
  title: string
  artistName: string | null
  imageUrl: string | null
  previewUrl: string | null
  slug: string
  spotify: string | null
  appleMusic: string | null
  beatport: string | null
  bandcamp: string | null
  soundcloud: string | null
  categories: string[]
  publishedAt: string | null
}

const COUNT = 6
/** Auto-scan advances one release every 4 bars at 174 BPM. */
const SCAN_MS = Math.round((16 * 60_000) / 174)

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric' }) : ''

/** One same-origin optimised URL shared by the monitor cover and its CSS slice layers (single download). */
const proxied = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1080&q=75`

export default function LatestMusic() {
  const [releases, setReleases] = useState<Release[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  const [hold, setHold] = useState(false)
  const [inView, setInView] = useState(false)
  const [reduce, setReduce] = useState(false)
  const [playing, setPlaying] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const audio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let alive = true
    fetch(`/api/releases?limit=${COUNT}`)
      .then((r) => r.json())
      .then((d: { items?: Release[]; total?: number }) => {
        if (!alive) return
        setReleases(d.items || [])
        setTotal(typeof d.total === 'number' ? d.total : null)
      })
      .catch((error) => console.error('Error fetching releases:', error))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
      audio.current?.pause()
    }
  }, [])

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting)
      if (e.isIntersecting) el.setAttribute('data-in', '')
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const scanning = inView && !hold && !playing && !reduce && releases.length > 1
  useEffect(() => {
    if (!scanning) return
    const t = window.setTimeout(() => setActive((i) => (i + 1) % releases.length), SCAN_MS)
    return () => window.clearTimeout(t)
  }, [scanning, releases.length, active])

  const toggle = useCallback(async (r: Release) => {
    if (!r.previewUrl) return
    setPreviewError(false)
    if (playing === r.id) {
      audio.current?.pause()
      setPlaying(null)
      return
    }
    audio.current?.pause()
    const a = new Audio(r.previewUrl)
    a.onended = () => setPlaying((id) => (id === r.id ? null : id))
    audio.current = a
    try {
      await a.play()
      setPlaying(r.id)
    } catch {
      setPlaying(null)
      setPreviewError(true)
    }
  }, [playing])

  const current = releases[active]
  const cur = current ? splitTitle(plainTitle(current.title), current.artistName) : null
  const curOn = !!current && playing === current.id

  return (
    <section
      ref={rootRef}
      className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}
      aria-labelledby="latest-releases-title"
    >
      <div className={styles.fieldWrap} aria-hidden="true">
        <SignalBackdrop rootRef={rootRef} crimson={false} />
      </div>

      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>
            <span className={styles.kickerHot}>Archive feed //</span> Latest transmissions
            {total ? ` // ${total} in the catalogue` : ''}
          </p>
          <h2 id="latest-releases-title" className={styles.title}>
            <span className={styles.outline}>Latest</span>
            <span className={styles.solid}>Releases</span>
          </h2>
          <Link href="/music" className={styles.browse}>
            Browse all{total ? ` ${total}` : ''} releases <span aria-hidden="true">→</span>
          </Link>
        </header>

        {loading ? (
          <div className={styles.skeleton} role="status" aria-label="Loading latest releases">
            {[...Array(COUNT)].map((_, i) => <span key={i} />)}
          </div>
        ) : releases.length === 0 ? (
          <p className={styles.empty}>No signal. New releases will appear here.</p>
        ) : (
          <div className={styles.grid}>
            {current && cur && (
              <div className={styles.monitor}>
                <div className={styles.screen}>
                  {releases.map((r, i) => (
                    <div key={r.id} className={styles.cover} data-active={i === active ? '' : undefined} aria-hidden={i !== active}>
                      {r.imageUrl ? (
                        <Image
                          src={proxied(r.imageUrl)}
                          alt={i === active ? `${cur.artist ? `${cur.artist} – ` : ''}${cur.title} cover art` : ''}
                          fill
                          unoptimized
                          className={styles.coverImg}
                        />
                      ) : (
                        <span className={styles.noCover}>No signal</span>
                      )}
                    </div>
                  ))}
                  {current.imageUrl && (
                    <div key={`slices-${current.id}`} className={styles.slices} aria-hidden="true">
                      {[0, 1, 2].map((n) => (
                        <span key={n} className={styles.slice} style={{ backgroundImage: `url("${proxied(current.imageUrl!)}")` }} />
                      ))}
                    </div>
                  )}
                  <span className={styles.scan} aria-hidden="true" />
                  <span className={styles.hudTl} aria-hidden="true">
                    CH {String(active + 1).padStart(2, '0')}/{String(releases.length).padStart(2, '0')}
                  </span>
                  <span className={styles.hudTr} aria-hidden="true"><i className={styles.rec} />{curOn ? 'Playing' : 'Live'}</span>
                  <span className={styles.hudBl} aria-hidden="true">174 BPM</span>
                  {scanning && (
                    <span key={`bar-${active}`} className={styles.scanBar} style={{ animationDuration: `${SCAN_MS}ms` }} aria-hidden="true" />
                  )}
                </div>

                <div className={styles.readout}>
                  <p className={styles.meta}>
                    <span className={styles.tag}>{typeLabel(current.title, current.categories)}</span>
                    <time dateTime={current.publishedAt ?? undefined}>{fmtDate(current.publishedAt)}</time>
                  </p>
                  <p className={styles.mArtist}>{cur.artist ?? 'DnB Doctor'}</p>
                  <p className={styles.mTitle} data-size={cur.title.length > 22 ? 'l' : undefined}>{cur.title}</p>
                  <div className={styles.actions}>
                    <Link href={`/music/${current.slug}`} className={styles.listen}>
                      Listen <span aria-hidden="true">→</span>
                    </Link>
                    {current.previewUrl && (
                      <button
                        type="button"
                        className={styles.preview}
                        onClick={() => toggle(current)}
                        aria-pressed={curOn}
                        aria-label={`${curOn ? 'Pause' : 'Play'} preview of ${cur.title}`}
                      >
                        {curOn ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
                        <span>{curOn ? 'Pause' : 'Preview'}</span>
                      </button>
                    )}
                    <div className={styles.menu}>
                      <StreamingMenu
                        spotify={current.spotify}
                        appleMusic={current.appleMusic}
                        beatport={current.beatport}
                        bandcamp={current.bandcamp}
                        soundcloud={current.soundcloud}
                      />
                    </div>
                  </div>
                  {previewError && <p className={styles.err} role="status">Preview unavailable</p>}
                </div>
              </div>
            )}

            <ol className={styles.list} onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
              {releases.map((r, i) => {
                const { artist, title } = splitTitle(plainTitle(r.title), r.artistName)
                return (
                  <li key={r.id} style={{ '--i': i } as React.CSSProperties} data-active={i === active ? '' : undefined}>
                    <Link
                      href={`/music/${r.slug}`}
                      className={styles.row}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => { setActive(i); setHold(true) }}
                      onBlur={() => setHold(false)}
                    >
                      <span className={styles.idx} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.thumb} aria-hidden="true">
                        {r.imageUrl && <Image src={r.imageUrl} alt="" fill sizes="96px" className={styles.thumbImg} />}
                      </span>
                      <span className={styles.body}>
                        <span className={styles.rArtist}>{artist ?? 'DnB Doctor'}</span>
                        <span className={styles.rTitle}>{title}</span>
                        <span className={styles.rMeta}>{typeLabel(r.title, r.categories)} {'//'} {fmtDate(r.publishedAt)}</span>
                      </span>
                      <span className={styles.go} aria-hidden="true">→</span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
