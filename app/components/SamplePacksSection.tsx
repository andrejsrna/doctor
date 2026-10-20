'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { FaPause, FaPlay } from 'react-icons/fa'
import { useCategories } from '@/app/hooks/useWordPress'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { plainTitle, splitTitle } from '@/app/components/hero/releaseMeta'
import styles from './SamplePacksSection.module.css'
import { shortDate } from '@/app/utils/shortDate'

type ReleaseItem = {
  id: string | number
  title: string
  slug: string
  artistName?: string | null
  imageUrl?: string | null
  coverImageUrl?: string | null
  previewUrl?: string | null
  publishedAt?: string | null
  content?: string | null
}

type ReleasesResponse = {
  items?: ReleaseItem[]
  total?: number
}

type Row = { count: number; label: string }

const STEPS = 16

function getSamplePackHref(slug: string) {
  if (!slug) return '/sample-packs'
  if (slug.startsWith('http')) return slug
  const normalized = slug.startsWith('/') ? slug.slice(1) : slug
  if (normalized.startsWith('sample-packs')) return `/${normalized}`
  return `/music/${normalized}`
}

const fmtDate = (iso?: string | null) =>
  shortDate(iso, { day: false })

/** Block tags become line breaks, inline tags vanish, entities decode. */
function toLines(html?: string | null) {
  if (!html) return []
  return plainTitle(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|h\d|li|ul|ol)>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

/** "15x Bass Loop" / "11 Serum presets + 6 Bass Loops" -> manifest rows. */
function manifest(lines: string[]): Row[] {
  const rows: Row[] = []
  for (const line of lines) {
    for (const part of line.split('+')) {
      const m = part.trim().match(/^(\d{1,3})\s*[x×]?\s+([A-Za-z][A-Za-z\- ]{2,28})$/i)
      if (m) rows.push({ count: Number(m[1]), label: m[2].trim() })
    }
  }
  return rows.slice(0, 6)
}

function blurb(lines: string[], max = 170) {
  const text = lines
    .filter((l) => !/^\d{1,3}\s*[x×]?\s+[A-Za-z]/.test(l) && !/contains:?$/i.test(l))
    .join(' ')
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const space = cut.lastIndexOf(' ')
  return `${space > max * 0.7 ? cut.slice(0, space) : cut}…`
}

/** Deterministic step pattern per row, so the grid looks programmed rather than random. */
function pattern(label: string, row: number) {
  let h = 2166136261
  for (const c of `${label}${row}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const kind = label.toLowerCase()
  return Array.from({ length: STEPS }, (_, s) => {
    if (/drum|kick|break/.test(kind)) return s % 8 === 0 || s % 8 === 4 || s === 10 || ((h >> s) & 7) === 0
    if (/bass/.test(kind)) return s % 4 === 2 || ((h >> s) & 3) === 0
    return ((h >> (s % 24)) & 3) === 0 || s === row * 2
  })
}

const proxied = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1080&q=75`

export default function SamplePacksSection() {
  const [category, setCategory] = useState('')
  const [playing, setPlaying] = useState<string | number | null>(null)
  const [previewError, setPreviewError] = useState<string | number | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)
  const rootRef = useRef<HTMLElement>(null)

  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  useEffect(() => {
    if (!Array.isArray(categories) || !categories.length) return
    const preferred = ['sample pack', 'sample-pack']
    const found = categories.find((c: string) => preferred.some((p) => c.toLowerCase().includes(p)))
    if (found) setCategory(found)
  }, [categories])

  const { data, isLoading } = useSWR(category ? ['samplePacksSection', category] : null, async () => {
    const params = new URLSearchParams({ page: '1', limit: '6', category })
    const response = await fetch(`/api/releases?${params}`)
    if (!response.ok) throw new Error('Failed to fetch sample packs')
    return (await response.json()) as ReleasesResponse
  })

  const kits = useMemo(
    () =>
      (data?.items || []).map((item) => {
        const lines = toLines(item.content)
        const rows = manifest(lines)
        const { artist, title } = splitTitle(plainTitle(item.title), item.artistName ?? null)
        return {
          item,
          artist,
          title: title.replace(/\s*\bfree\b\s*/i, ' ').trim(),
          free: /\bfree\b/i.test(item.title),
          rows,
          total: rows.reduce((n, r) => n + r.count, 0),
          blurb: blurb(lines),
          href: getSamplePackHref(item.slug),
          img: item.imageUrl || item.coverImageUrl || null,
        }
      }),
    [data],
  )
  const totalSounds = kits.reduce((n, k) => n + k.total, 0)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    // data-seen reveals once; data-in runs the sequencer only while on screen
    const io = new IntersectionObserver(([e]) => {
      el.toggleAttribute('data-in', e.isIntersecting)
      if (e.isIntersecting) el.setAttribute('data-seen', '')
    }, { rootMargin: '0px 0px -15% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => () => audio.current?.pause(), [])

  const toggle = async (item: ReleaseItem) => {
    if (!item.previewUrl) return
    setPreviewError(null)
    if (playing === item.id) {
      audio.current?.pause()
      setPlaying(null)
      return
    }
    audio.current?.pause()
    const a = new Audio(item.previewUrl)
    a.onended = () => setPlaying((id) => (id === item.id ? null : id))
    audio.current = a
    try {
      await a.play()
      setPlaying(item.id)
    } catch {
      setPlaying(null)
      setPreviewError(item.id)
    }
  }

  const loading = categoriesLoading || (!!category && isLoading)

  return (
    <section
      ref={rootRef}
      className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}
      aria-labelledby="sample-packs-title"
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>
            <span className={styles.hot}>Production ammo //</span> Loops, one-shots &amp; presets
            {totalSounds ? ` // ${totalSounds} sounds loaded` : ''}
          </p>
          <h2 id="sample-packs-title" className={styles.title}>
            <span className={styles.outline}>Sample</span>
            <span className={styles.solid}>Packs</span>
          </h2>
          <Link href="/sample-packs" className={styles.explore}>
            Explore sample packs <span aria-hidden="true">→</span>
          </Link>
        </header>

        {loading ? (
          <div className={styles.skeleton} role="status" aria-label="Loading sample packs">
            <span />
            <span />
          </div>
        ) : kits.length === 0 ? (
          <div className={styles.empty}>
            <p>Sample packs are coming soon.</p>
            <Link href="/sample-packs" className={styles.explore}>Open sample packs <span aria-hidden="true">→</span></Link>
          </div>
        ) : (
          <div className={styles.rack}>
            {kits.map((k, i) => {
              const external = k.href.startsWith('http')
              const isPlaying = playing === k.item.id
              const cta = (
                <>
                  {k.free ? 'Download free' : 'Get pack'} <span aria-hidden="true">→</span>
                </>
              )
              return (
                <article key={k.item.id} className={styles.kit} style={{ '--i': i } as React.CSSProperties}>
                  <div className={styles.cover}>
                    {k.img ? (
                      <span className={styles.coverArt} style={{ backgroundImage: `url("${proxied(k.img)}")` }} role="img" aria-label={`${k.title} cover art`} />
                    ) : (
                      <span className={styles.noCover}>No signal</span>
                    )}
                    <span className={styles.scan} aria-hidden="true" />
                    <span className={styles.slot} aria-hidden="true">Kit {String(i + 1).padStart(2, '0')}</span>
                    {k.free && <span className={styles.free}>Free</span>}
                  </div>

                  <div className={styles.panel}>
                    <p className={styles.meta}>
                      {k.artist && <span className={styles.artist}>{k.artist}</span>}
                      <span>{fmtDate(k.item.publishedAt)}</span>
                      {k.total > 0 && <span>{k.total} files</span>}
                    </p>
                    <h3 className={styles.kTitle}>{k.title}</h3>
                    {k.blurb && <p className={styles.blurb}>{k.blurb}</p>}

                    {k.rows.length > 0 && (
                      <div className={styles.seq} role="table" aria-label={`${k.title} contents`}>
                        {k.rows.map((r, ri) => (
                          <div key={r.label} className={styles.track} role="row">
                            <span className={styles.count} role="cell">{r.count}<small>×</small></span>
                            <span className={styles.label} role="cell">{r.label}</span>
                            <span className={styles.steps} aria-hidden="true">
                              {pattern(r.label, ri).map((on, s) => (
                                <i key={s} data-on={on ? '' : undefined} style={{ '--s': s } as React.CSSProperties} />
                              ))}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.actions}>
                      {external ? (
                        <a href={k.href} className={styles.get} target="_blank" rel="noopener noreferrer">{cta}</a>
                      ) : (
                        <Link href={k.href} className={styles.get}>{cta}</Link>
                      )}
                      {k.item.previewUrl && (
                        <button
                          type="button"
                          className={styles.preview}
                          onClick={() => toggle(k.item)}
                          aria-pressed={isPlaying}
                          aria-label={`${isPlaying ? 'Pause' : 'Play'} preview of ${k.title}`}
                        >
                          {isPlaying ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
                          <span>{isPlaying ? 'Pause' : 'Preview'}</span>
                        </button>
                      )}
                    </div>
                    {previewError === k.item.id && <p className={styles.err} role="status">Preview unavailable</p>}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
