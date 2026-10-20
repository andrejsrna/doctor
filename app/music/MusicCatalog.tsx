'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FaPlay, FaSearch, FaSpotify, FaTimes } from 'react-icons/fa'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { shortDate } from '@/app/utils/shortDate'
import { djLinks, withBeatportAffiliate } from '@/lib/affiliates'
import { trackEvent, trackStreamingClick } from '@/app/utils/analytics'
import { resolveCategory } from './slugify'
import styles from './music.module.css'

export type CatalogRelease = {
  id: string
  slug: string
  title: string
  artist: string | null
  cover: string | null
  preview: string | null
  date: string | null
  cats: string[]
  beatport: string | null
  spotify: string | null
  free: boolean
}

export type CatalogCategory = { slug: string; label: string; count: number }

type Sort = 'new' | 'old' | 'az'

const PAGE = 24
const SORTS: { value: Sort; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'old', label: 'Old' },
  { value: 'az', label: 'A–Z' },
]

const fold = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function typeOf(r: CatalogRelease) {
  if (r.cats.includes('eps')) return 'EP'
  if (r.cats.includes('albums')) return 'Album'
  if (r.cats.some((c) => c.includes('pack'))) return 'Pack'
  return 'Single'
}

/** Reports ?category / ?q / ?focus changes (nav links while already on /music). Isolated so only it bails out of SSR. */
function ParamSync({ onChange }: { onChange: (qs: URLSearchParams) => void }) {
  const params = useSearchParams()
  useEffect(() => {
    if (params) onChange(new URLSearchParams(params.toString()))
  }, [params, onChange])
  return null
}

export default function MusicCatalog({
  releases,
  categories,
  artists,
  since,
}: {
  releases: CatalogRelease[]
  categories: CatalogCategory[]
  artists: number
  since: number | null
}) {
  const [cat, setCat] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('new')
  const [visible, setVisible] = useState(PAGE)
  const [playing, setPlaying] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const written = useRef('')

  const known = useMemo(() => categories.map((c) => c.slug), [categories])
  /** catalogue number: oldest release is 001 */
  const number = useMemo(() => new Map(releases.map((r, i) => [r.id, releases.length - i])), [releases])
  const latest = releases[0]

  const applyParams = useCallback(
    (qs: URLSearchParams) => {
      if (qs.toString() === written.current) return
      setCat(resolveCategory(qs.get('category'), known))
      setQuery(qs.get('q') ?? '')
      setVisible(PAGE)
      if (qs.get('category') || qs.get('focus') === 'search') {
        requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      }
      if (qs.get('focus') === 'search') setTimeout(() => searchRef.current?.focus({ preventScroll: true }), 400)
    },
    [known],
  )

  // keep the address bar shareable (?category=eps&q=asana) without a navigation
  useEffect(() => {
    const t = setTimeout(() => {
      const qs = new URLSearchParams()
      if (cat) qs.set('category', cat)
      if (query.trim()) qs.set('q', query.trim())
      if (sort !== 'new') qs.set('sort', sort)
      const next = qs.toString()
      const current = window.location.search.replace(/^\?/, '')
      if (next === current) return
      written.current = next
      window.history.replaceState(window.history.state, '', next ? `?${next}` : window.location.pathname)
    }, 350)
    return () => clearTimeout(t)
  }, [cat, query, sort])

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('sort')
    if (s === 'old' || s === 'az') setSort(s)
  }, [])

  useEffect(() => () => audioRef.current?.pause(), [])

  const filtered = useMemo(() => {
    const q = fold(query.trim())
    const list = releases.filter((r) => (!cat || r.cats.includes(cat)) && (!q || fold(`${r.title} ${r.artist ?? ''}`).includes(q)))
    if (sort === 'old') return [...list].reverse()
    if (sort === 'az') return [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [releases, cat, query, sort])

  const shown = filtered.slice(0, visible)
  const grouped = sort !== 'az' && !query.trim()
  const groups = useMemo(() => {
    if (!grouped) return [{ year: null as string | null, items: shown }]
    const out: { year: string | null; items: CatalogRelease[] }[] = []
    for (const r of shown) {
      const y = r.date ? r.date.slice(0, 4) : 'TBA'
      if (out.at(-1)?.year !== y) out.push({ year: y, items: [] })
      out.at(-1)!.items.push(r)
    }
    return out
  }, [grouped, shown])
  const perYear = useMemo(() => {
    const m = new Map<string, number>()
    for (const r of filtered) {
      const y = r.date ? r.date.slice(0, 4) : 'TBA'
      m.set(y, (m.get(y) ?? 0) + 1)
    }
    return m
  }, [filtered])

  const toggle = async (r: CatalogRelease) => {
    if (!r.preview) return
    setAudioError(null)
    if (playing === r.id) {
      audioRef.current?.pause()
      setPlaying(null)
      return
    }
    audioRef.current?.pause()
    const audio = new Audio(r.preview)
    audio.onended = () => setPlaying((id) => (id === r.id ? null : id))
    audioRef.current = audio
    try {
      await audio.play()
      setPlaying(r.id)
      trackEvent('preview_play', { content_type: 'release', content_name: `${r.artist ?? ''} - ${r.title}`, item_id: r.slug, location: 'music_catalog' })
    } catch {
      setPlaying(null)
      setAudioError(r.id)
    }
  }

  const pickCat = (slug: string) => {
    setCat(slug)
    setVisible(PAGE)
  }

  const reset = () => {
    setCat('')
    setQuery('')
    setSort('new')
    setVisible(PAGE)
  }

  const activeLabel = categories.find((c) => c.slug === cat)?.label

  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <Suspense fallback={null}>
        <ParamSync onChange={applyParams} />
      </Suspense>

      {/* ---------- hero ---------- */}
      <header className={styles.hero}>
        {latest?.cover && (
          <div className={styles.heroBg} aria-hidden="true">
            <Image src={latest.cover} alt="" fill priority sizes="100vw" />
          </div>
        )}
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>
              <span className={styles.dot} aria-hidden="true" /> Catalogue <span aria-hidden="true">{'//'}</span> {releases.length} transmissions
            </p>
            <h1 className={styles.title}>
              <span>Drum and Bass</span>
              <span className={styles.outline}>New Releases</span>
            </h1>
            <p className={styles.lede}>
              Discover the latest drum and bass tracks updated daily. Stream new DnB releases, fresh neurofunk music, and the hottest tracks from top
              artists.
            </p>
            <dl className={styles.stats}>
              <div>
                <dt>Releases</dt>
                <dd>{releases.length}</dd>
              </div>
              <div>
                <dt>Artists</dt>
                <dd>{artists}</dd>
              </div>
              {since && (
                <div>
                  <dt>On the label since</dt>
                  <dd>{since}</dd>
                </div>
              )}
            </dl>
          </div>

          {latest && (
            <article className={styles.feature} data-playing={playing === latest.id ? '' : undefined}>
              <p className={styles.featureTag}>
                <span>Latest drop</span>
                <time dateTime={latest.date ?? undefined}>{shortDate(latest.date)}</time>
              </p>
              <Link href={`/music/${latest.slug}`} className={styles.featureCover}>
                {latest.cover && <Image src={latest.cover} alt={`${latest.artist ?? ''} – ${latest.title} cover`} fill priority sizes="(max-width: 960px) 90vw, 420px" />}
              </Link>
              <h2 className={styles.featureTitle}>
                <Link href={`/music/${latest.slug}`}>{latest.title}</Link>
              </h2>
              {latest.artist && <p className={styles.featureArtist}>{latest.artist}</p>}
              <div className={styles.featureActions}>
                {latest.preview && (
                  <button type="button" className={styles.primary} onClick={() => toggle(latest)} aria-pressed={playing === latest.id}>
                    {playing === latest.id ? (
                      <span className={styles.eq} aria-hidden="true">
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                    ) : (
                      <FaPlay aria-hidden="true" />
                    )}
                    {playing === latest.id ? 'Pause' : 'Preview'}
                  </button>
                )}
                <Link href={`/music/${latest.slug}`} className={styles.secondary}>
                  Open release →
                </Link>
              </div>
              {audioError === latest.id && (
                <p className={styles.err} role="status">
                  Preview unavailable
                </p>
              )}
            </article>
          )}
        </div>
      </header>

      {/* ---------- filters ---------- */}
      <div className={styles.bar} ref={listRef}>
        <div className={styles.barInner}>
          <div className={styles.chips} role="group" aria-label="Filter by type">
            <button type="button" aria-pressed={!cat} onClick={() => pickCat('')}>
              All <span>{releases.length}</span>
            </button>
            {categories.map((c) => (
              <button key={c.slug} type="button" aria-pressed={cat === c.slug} onClick={() => pickCat(c.slug)}>
                {c.label} <span>{c.count}</span>
              </button>
            ))}
          </div>
          <div className={styles.tools}>
            <label className={styles.search}>
              <FaSearch aria-hidden="true" />
              <span className={styles.sr}>Search releases</span>
              <input
                ref={searchRef}
                type="search"
                value={query}
                placeholder="Track or artist…"
                onChange={(e) => {
                  setQuery(e.target.value)
                  setVisible(PAGE)
                }}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                  <FaTimes aria-hidden="true" />
                </button>
              )}
            </label>
            <div className={styles.sort} role="group" aria-label="Sort">
              {SORTS.map((s) => (
                <button key={s.value} type="button" aria-pressed={sort === s.value} onClick={() => setSort(s.value)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- list ---------- */}
      <section className={styles.list} aria-labelledby="list-title">
        <div className={styles.listHead}>
          <h2 id="list-title" className={styles.h2}>
            {query.trim() ? (
              <>
                Results <span className={styles.outline}>for “{query.trim()}”</span>
              </>
            ) : (
              <>
                Latest <span className={styles.outline}>{activeLabel ?? 'Tracks'}</span>
              </>
            )}
          </h2>
          <p className={styles.count} aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'release' : 'releases'}
            {(cat || query) && (
              <button type="button" onClick={reset}>
                Reset
              </button>
            )}
          </p>
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <p>No signal for that search.</p>
            <button type="button" className={styles.secondary} onClick={reset}>
              Show all releases
            </button>
          </div>
        )}

        {groups.map((g) => (
          <div key={g.year ?? 'all'} className={styles.group}>
            {g.year && (
              <h3 className={styles.year}>
                <span>{g.year}</span>
                <small>
                  {perYear.get(g.year)} {perYear.get(g.year) === 1 ? 'release' : 'releases'}
                </small>
              </h3>
            )}
            <ol className={styles.grid}>
              {g.items.map((r, i) => {
                const on = playing === r.id
                const proxied = r.cover ? `/_next/image?url=${encodeURIComponent(r.cover)}&w=640&q=75` : null
                return (
                  <li key={r.id} className={styles.card} data-playing={on ? '' : undefined} style={{ '--i': i % 8 } as React.CSSProperties}>
                    <Link href={`/music/${r.slug}`} className={styles.link}>
                      <span className={styles.cover}>
                        {r.cover ? (
                          <Image src={r.cover} alt="" fill sizes="(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 300px" className={styles.img} />
                        ) : (
                          <span className={styles.noCover} aria-hidden="true">
                            No signal
                          </span>
                        )}
                        {proxied && (
                          <>
                            <span className={`${styles.split} ${styles.splitR}`} aria-hidden="true" style={{ backgroundImage: `url(${proxied})` }} />
                            <span className={`${styles.split} ${styles.splitG}`} aria-hidden="true" style={{ backgroundImage: `url(${proxied})` }} />
                          </>
                        )}
                        <span className={styles.scan} aria-hidden="true" />
                        <span className={styles.badges} aria-hidden="true">
                          <b>{typeOf(r)}</b>
                          {r.free && <b data-free="">Free</b>}
                        </span>
                        <span className={styles.open} aria-hidden="true">
                          Open <b>→</b>
                        </span>
                      </span>
                      <span className={styles.meta}>
                        <span>#{String(number.get(r.id)).padStart(3, '0')}</span>
                        <time dateTime={r.date ?? undefined}>{shortDate(r.date)}</time>
                      </span>
                      <span className={styles.cardTitle}>{r.title}</span>
                      {r.artist && <span className={styles.cardArtist}>{r.artist}</span>}
                    </Link>
                    {r.preview && (
                      <button
                        type="button"
                        className={styles.play}
                        onClick={() => toggle(r)}
                        aria-pressed={on}
                        aria-label={`${on ? 'Pause' : 'Play'} preview of ${r.title}`}
                      >
                        {on ? (
                          <span className={styles.eq} aria-hidden="true">
                            <i />
                            <i />
                            <i />
                            <i />
                          </span>
                        ) : (
                          <FaPlay aria-hidden="true" />
                        )}
                      </button>
                    )}
                    {(r.beatport || r.spotify) && (
                      <span className={styles.stores}>
                        {r.beatport && (
                          <a
                            href={withBeatportAffiliate(r.beatport)}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            onClick={() => trackStreamingClick('beatport', r.slug)}
                            aria-label={`Buy ${r.title} on Beatport`}
                          >
                            <Image src="/beatport.svg" alt="" width={12} height={12} /> Beatport
                          </a>
                        )}
                        {r.spotify && (
                          <a
                            href={r.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackStreamingClick('spotify', r.slug)}
                            aria-label={`Stream ${r.title} on Spotify`}
                          >
                            <FaSpotify aria-hidden="true" /> Spotify
                          </a>
                        )}
                      </span>
                    )}
                    {audioError === r.id && (
                      <p className={styles.err} role="status">
                        Preview unavailable
                      </p>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        ))}

        {filtered.length > visible ? (
          <button type="button" className={styles.loadMore} onClick={() => setVisible((v) => v + PAGE)}>
            <span>Load more</span>
            <span className={styles.loadCount}>+{Math.min(PAGE, filtered.length - visible)}</span>
          </button>
        ) : (
          filtered.length > 0 && <p className={styles.end}>End of transmission · {filtered.length} of {releases.length}</p>
        )}
      </section>

      {/* ---------- outro ---------- */}
      <section className={styles.outro} aria-labelledby="outro-title">
        <Link href="/bulk-sale" className={styles.bulk}>
          <span className={styles.bulkStamp}>−35%</span>
          <span>
            <span className={styles.label}>Bulk sale</span>
            <strong id="outro-title">Get the whole catalogue in one purchase</strong>
          </span>
          <span className={styles.bulkArrow} aria-hidden="true">
            →
          </span>
        </Link>
        <div className={styles.dj}>
          <p className={styles.label}>For DJs</p>
          <div className={styles.djLinks}>
            {djLinks.map((l) => (
              <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer sponsored">
                <strong>{l.name}</strong>
                <span>{l.tagline}</span>
              </a>
            ))}
          </div>
          <p className={styles.disclose}>Some links are affiliate links. We may earn a commission at no extra cost to you.</p>
        </div>
      </section>
    </div>
  )
}
