'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { FaPause, FaPlay } from 'react-icons/fa'
import { useCategories } from '@/app/hooks/useWordPress'
import StreamingMenu from '@/app/components/StreamingMenu'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { plainTitle, splitTitle, typeLabel } from '@/app/components/hero/releaseMeta'
import styles from './MusicPacksSection.module.css'
import { shortDate } from '@/app/utils/shortDate'

type Pack = {
  id: string
  title: string
  slug: string
  artistName: string | null
  imageUrl?: string | null
  coverImageUrl?: string | null
  previewUrl?: string | null
  categories: string[]
  publishedAt: string | null
  content: string | null
  spotify: string | null
  appleMusic: string | null
  beatport: string | null
  bandcamp: string | null
  soundcloud: string | null
}

type ReleasesResponse = { items?: Pack[]; total?: number }

const COUNT = 6

const fmtDate = (iso: string | null) =>
  shortDate(iso)

/** Same-origin optimised URL used as the panel background. */
const proxied = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1080&q=75`

function excerpt(html: string | null, max = 190) {
  if (!html) return ''
  const text = plainTitle(html.replace(/<\/(p|div|h\d|li)>/gi, ' ')).replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const space = cut.lastIndexOf(' ')
  return `${space > max * 0.7 ? cut.slice(0, space) : cut}…`
}

export default function MusicPacksSection() {
  const [category, setCategory] = useState('')
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)
  const rootRef = useRef<HTMLElement>(null)

  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  useEffect(() => {
    if (!Array.isArray(categories) || !categories.length) return
    const preferred = ['music pack', 'music-pack', 'packs', 'pack']
    const found = categories.find((c: string) => preferred.some((p) => c.toLowerCase().includes(p)))
    if (found) setCategory(found)
  }, [categories])

  const { data, isLoading } = useSWR(category ? ['musicPacksSection', category] : null, async () => {
    const params = new URLSearchParams({ page: '1', limit: String(COUNT), category })
    const response = await fetch(`/api/releases?${params}`)
    if (!response.ok) throw new Error('Failed to fetch music packs')
    return (await response.json()) as ReleasesResponse
  })

  const packs = useMemo(() => data?.items || [], [data])
  const total = data?.total ?? packs.length

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.setAttribute('data-in', '')
        io.disconnect()
      }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => () => audio.current?.pause(), [])

  const toggle = async (p: Pack) => {
    if (!p.previewUrl) return
    setPreviewError(null)
    if (playing === p.id) {
      audio.current?.pause()
      setPlaying(null)
      return
    }
    audio.current?.pause()
    const a = new Audio(p.previewUrl)
    a.onended = () => setPlaying((id) => (id === p.id ? null : id))
    audio.current = a
    try {
      await a.play()
      setPlaying(p.id)
    } catch {
      setPlaying(null)
      setPreviewError(p.id)
    }
  }

  const loading = categoriesLoading || (!!category && isLoading)

  return (
    <section
      ref={rootRef}
      className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}
      aria-labelledby="music-packs-title"
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>
            <span className={styles.hot}>Long-form doses //</span> Compilations, mixes &amp; showcases
            {total ? ` // ${total} in the vault` : ''}
          </p>
          <h2 id="music-packs-title" className={styles.title}>
            <span className={styles.outline}>Music</span>
            <span className={styles.solid}>Packs</span>
          </h2>
          <Link href="/music-packs" className={styles.explore}>
            Explore all packs <span aria-hidden="true">→</span>
          </Link>
        </header>

        {loading ? (
          <div className={styles.skeleton} role="status" aria-label="Loading music packs">
            {[...Array(4)].map((_, i) => <span key={i} />)}
          </div>
        ) : packs.length === 0 ? (
          <div className={styles.empty}>
            <p>Music packs are coming soon.</p>
            <Link href="/music-packs" className={styles.explore}>Open music packs <span aria-hidden="true">→</span></Link>
          </div>
        ) : (
          <div className={styles.deck}>
            {packs.map((p, i) => {
              const { artist, title } = splitTitle(plainTitle(p.title), p.artistName)
              const img = p.imageUrl || p.coverImageUrl
              const on = i === active
              const isPlaying = playing === p.id
              const bodyId = `pack-body-${p.id}`
              return (
                <article
                  key={p.id}
                  className={styles.panel}
                  data-active={on ? '' : undefined}
                  style={{ '--i': i } as React.CSSProperties}
                  onPointerEnter={(e) => {
                    // hover-to-open only on the desktop row; on touch the layout shift would retarget taps
                    if (e.pointerType === 'mouse' && window.matchMedia('(min-width: 900px)').matches) setActive(i)
                  }}
                >
                  <span
                    className={styles.art}
                    style={img ? { backgroundImage: `url("${proxied(img)}")` } : undefined}
                    aria-hidden="true"
                  />
                  <span className={styles.shade} aria-hidden="true" />

                  <button
                    type="button"
                    className={styles.tab}
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={on}
                    aria-controls={bodyId}
                  >
                    <span className={styles.no}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.spine}>{title}</span>
                  </button>

                  <div id={bodyId} className={styles.body} hidden={!on}>
                    <p className={styles.meta}>
                      <span className={styles.tag}>{typeLabel(p.title, p.categories) === 'Album' ? 'Album' : 'Pack'}</span>
                      <span>Dose {String(i + 1).padStart(2, '0')}/{String(packs.length).padStart(2, '0')}</span>
                      <time dateTime={p.publishedAt ?? undefined}>{fmtDate(p.publishedAt)}</time>
                    </p>
                    {artist && <p className={styles.artist}>{artist}</p>}
                    <h3 className={styles.pTitle} data-size={title.length > 16 ? 'l' : undefined}>{title}</h3>
                    {p.content && <p className={styles.story}>{excerpt(p.content)}</p>}
                    <div className={styles.actions}>
                      <Link href={`/music/${p.slug}`} className={styles.open}>
                        Open pack <span aria-hidden="true">→</span>
                      </Link>
                      {p.previewUrl && (
                        <button
                          type="button"
                          className={styles.preview}
                          onClick={() => toggle(p)}
                          aria-pressed={isPlaying}
                          aria-label={`${isPlaying ? 'Pause' : 'Play'} preview of ${title}`}
                        >
                          {isPlaying ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
                          <span>{isPlaying ? 'Pause' : 'Preview'}</span>
                        </button>
                      )}
                      <div className={styles.menu}>
                        <StreamingMenu
                          spotify={p.spotify}
                          appleMusic={p.appleMusic}
                          beatport={p.beatport}
                          bandcamp={p.bandcamp}
                          soundcloud={p.soundcloud}
                        />
                      </div>
                    </div>
                    {previewError === p.id && <p className={styles.err} role="status">Preview unavailable</p>}
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
