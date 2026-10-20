'use client'

import { useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { plainTitle } from '@/app/components/hero/releaseMeta'
import styles from './NeurofunkDnBMixesSection.module.css'
import { shortDate } from '@/app/utils/shortDate'

type NewsItem = {
  id: string
  slug: string
  title: string
  coverImageUrl?: string | null
  publishedAt?: string | null
}

type NewsResponse = {
  items?: NewsItem[]
  total?: number
}

type Mix = NewsItem & { name: string; series: string | null; vol: string | null; dj: string | null }

const BARS = 48

function formatDate(date?: string | null) {
  if (!date) return ''
  return shortDate(date)
}

/** "NEUROBANGERZ, Vol. 11 - DVS | Neurofunk Drum & Bass Mix" -> series / vol / dj. */
function parseMix(item: NewsItem): Mix {
  const name = plainTitle(item.title).split('|')[0].trim()
  const m = name.match(/^(.*?)[\s,]*Vol[.,]?\s*(\d+)\s*[-–—:]\s*(.+)$/i)
  if (!m) return { ...item, name, series: null, vol: null, dj: null }
  return { ...item, name, series: m[1].trim() || null, vol: m[2], dj: m[3].trim() }
}

/** Deterministic waveform per mix so each episode has its own silhouette. */
function wave(seed: string) {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return Array.from({ length: BARS }, (_, i) => {
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    const env = 0.55 + 0.45 * Math.sin((i / BARS) * Math.PI)
    return Math.round((0.25 + ((h >>> 0) % 1000) / 1333) * env * 100)
  })
}

const proxied = (src: string, w = 1200) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`

export default function NeurofunkDnBMixesSection() {
  const rootRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLOListElement>(null)

  const { data, isLoading } = useSWR(['mixesSection'], async () => {
    const params = new URLSearchParams({ page: '1', limit: '7', category: 'Mixes' })
    const res = await fetch(`/api/news?${params}`)
    if (!res.ok) throw new Error('Failed to fetch mixes')
    return (await res.json()) as NewsResponse
  })

  const mixes = useMemo(() => (data?.items || []).map(parseMix), [data])
  const total = data?.total ?? mixes.length
  const [lead, ...rest] = mixes
  const leadWave = useMemo(() => (lead ? wave(lead.slug) : []), [lead])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      el.toggleAttribute('data-in', e.isIntersecting)
      if (e.isIntersecting) el.setAttribute('data-seen', '')
    }, { rootMargin: '0px 0px -15% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const scrollRail = (dir: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.querySelector('li')
    rail.scrollBy({ left: dir * ((card?.clientWidth ?? 300) + 12), behavior: 'smooth' })
  }

  return (
    <section
      ref={rootRef}
      className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}
      aria-labelledby="mixes-title"
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>
            <span className={styles.hot}>On air //</span> DJ sets &amp; showreels
            {total ? ` // ${total} episodes archived` : ''}
          </p>
          <h2 id="mixes-title" className={styles.title}>
            <span className={styles.outline}>Neurofunk DnB</span>
            <span className={styles.solid}>Mixes</span>
          </h2>
          <Link href="/neurofunk-dnb-mixes" className={styles.explore}>
            Explore all mixes <span aria-hidden="true">→</span>
          </Link>
        </header>

        {isLoading ? (
          <div className={styles.skeleton} role="status" aria-label="Loading mixes">
            <span />
          </div>
        ) : !lead ? (
          <div className={styles.empty}>
            <p>No mixes on air yet. New sets land here first.</p>
          </div>
        ) : (
          <>
            <Link href={`/news/${lead.slug}`} className={styles.lead} aria-label={`Play ${lead.name}`}>
              <span
                className={styles.leadArt}
                style={lead.coverImageUrl ? { backgroundImage: `url("${proxied(lead.coverImageUrl)}")` } : undefined}
                aria-hidden="true"
              />
              <span className={styles.leadShade} aria-hidden="true" />
              <span className={styles.vol} aria-hidden="true">{lead.vol ?? '∞'}</span>

              <span className={styles.leadTop}>
                <span className={styles.live}><i />Latest broadcast</span>
                <span>{formatDate(lead.publishedAt)}</span>
              </span>

              <span className={styles.leadBody}>
                <span className={styles.series}>
                  {lead.series ?? 'DnB Doctor'}{lead.vol ? ` // Vol. ${lead.vol}` : ''}
                </span>
                <span className={styles.leadTitle}>{lead.dj ?? lead.name}</span>
                <span className={styles.leadCta}>
                  <span className={styles.play} aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M7 4.5v15L19.5 12z" /></svg>
                  </span>
                  Play the set <span aria-hidden="true">→</span>
                </span>
              </span>

              <span className={styles.wave} aria-hidden="true">
                {leadWave.map((v, i) => (
                  <i key={i} style={{ '--h': `${v}%`, '--b': i } as React.CSSProperties} />
                ))}
              </span>
            </Link>

            {rest.length > 0 && (
              <div className={styles.archive}>
                <div className={styles.railHead}>
                  <p className={styles.railLabel}>Previous episodes</p>
                  <div className={styles.railNav}>
                    <button type="button" onClick={() => scrollRail(-1)} aria-label="Scroll to newer episodes">←</button>
                    <button type="button" onClick={() => scrollRail(1)} aria-label="Scroll to older episodes">→</button>
                  </div>
                </div>
                <ol ref={railRef} className={styles.rail}>
                  {rest.map((m, i) => (
                    <li key={m.id} style={{ '--i': i } as React.CSSProperties}>
                      <Link href={`/news/${m.slug}`} className={styles.ep}>
                        <span className={styles.epArt}>
                          <span
                            className={styles.epImg}
                            style={m.coverImageUrl ? { backgroundImage: `url("${proxied(m.coverImageUrl, 640)}")` } : undefined}
                            aria-hidden="true"
                          />
                          <span className={styles.epVol} aria-hidden="true">{m.vol ? `Vol.${m.vol}` : 'Special'}</span>
                          <span className={styles.epPlay} aria-hidden="true">
                            <svg viewBox="0 0 24 24"><path d="M7 4.5v15L19.5 12z" /></svg>
                          </span>
                        </span>
                        <span className={styles.epMeta}>
                          {(m.series ?? 'Mix')} {'//'} {formatDate(m.publishedAt)}
                        </span>
                        <span className={styles.epTitle}>{m.dj ?? m.name}</span>
                      </Link>
                    </li>
                  ))}
                  <li className={styles.more}>
                    <Link href="/neurofunk-dnb-mixes" className={styles.moreLink}>
                      <span className={styles.moreNum}>{total}</span>
                      <span>All episodes →</span>
                    </Link>
                  </li>
                </ol>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
