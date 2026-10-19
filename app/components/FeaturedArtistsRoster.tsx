'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram, FaSoundcloud, FaSpotify } from 'react-icons/fa'
import { displayFont, monoFont } from './brandFonts'
import { plainTitle, splitTitle } from './hero/releaseMeta'
import styles from './FeaturedArtistsRoster.module.css'

export type RosterArtist = {
  id: string
  slug: string
  name: string
  imageUrl: string | null
  soundcloud: string | null
  spotify: string | null
  instagram: string | null
  releases: number
  latest: { slug: string; title: string } | null
}

/** 4 bars at 174 BPM */
const SCAN_MS = 5517

const pad = (n: number) => String(n).padStart(2, '0')
const releaseLabel = (n: number) => (n ? `${n} release${n === 1 ? '' : 's'}` : 'New signing')

export default function FeaturedArtistsRoster({ artists, total }: { artists: RosterArtist[]; total: number }) {
  const [active, setActive] = useState(0)
  const [hold, setHold] = useState(false)
  const [inView, setInView] = useState(false)
  const [reduce, setReduce] = useState(false)
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting)
        el.toggleAttribute('data-in', e.isIntersecting)
        if (e.isIntersecting) el.setAttribute('data-seen', '')
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const scanning = inView && !hold && !reduce && artists.length > 1
  useEffect(() => {
    if (!scanning) return
    const t = window.setTimeout(() => setActive((i) => (i + 1) % artists.length), SCAN_MS)
    return () => window.clearTimeout(t)
  }, [scanning, artists.length, active])

  const current = artists[active]

  return (
    <section
      ref={rootRef}
      className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}
      aria-labelledby="artists-title"
      data-scan={scanning ? '' : undefined}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>
            <span className={styles.hot}>Roster //</span> {total} artists signed // newest first
          </p>
          <h2 id="artists-title" className={styles.title}>
            <span className={styles.outline}>Featured</span>
            <span className={styles.solid}>Artists</span>
          </h2>
          <Link href="/artists" className={styles.explore}>
            Meet all artists <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className={styles.stage} onMouseLeave={() => setHold(false)}>
          {/* portrait monitor (desktop) */}
          <div className={styles.monitor} aria-hidden="true">
            <div className={styles.screen}>
              {artists.map((a, i) => (
                <span key={a.id} className={styles.shot} data-on={i === active ? '' : undefined}>
                  {a.imageUrl && (
                    <Image src={a.imageUrl} alt="" fill sizes="(min-width: 900px) 40vw, 1px" className={styles.shotImg} />
                  )}
                </span>
              ))}
              <span className={styles.scan} />
              <span className={styles.bigNum}>{pad(active + 1)}</span>
              <span className={styles.screenTop}>
                <span className={styles.rec}><i />Signal {pad(active + 1)}/{pad(artists.length)}</span>
                <span>{releaseLabel(current.releases)}</span>
              </span>
              <span className={styles.screenName}>{current.name}</span>
              <span key={`bar-${active}`} className={styles.progress} />
            </div>
          </div>

          <ol className={styles.list}>
            {artists.map((a, i) => {
              const latest = a.latest ? splitTitle(plainTitle(a.latest.title), null).title : null
              const socials = [
                a.spotify && { href: a.spotify, label: 'Spotify', Icon: FaSpotify },
                a.soundcloud && { href: a.soundcloud, label: 'SoundCloud', Icon: FaSoundcloud },
                a.instagram && { href: a.instagram, label: 'Instagram', Icon: FaInstagram },
              ].filter(Boolean) as { href: string; label: string; Icon: typeof FaSpotify }[]
              return (
                <li
                  key={a.id}
                  className={styles.row}
                  data-on={i === active ? '' : undefined}
                  style={{ '--i': i } as CSSProperties}
                  onMouseEnter={() => { setActive(i); setHold(true) }}
                  onFocus={() => { setActive(i); setHold(true) }}
                  onBlur={() => setHold(false)}
                >
                  <Link href={`/artists/${a.slug}`} className={styles.rowLink}>
                    <span className={styles.thumb} aria-hidden="true">
                      {a.imageUrl && <Image src={a.imageUrl} alt="" fill sizes="72px" />}
                    </span>
                    <span className={styles.idx}>{pad(i + 1)}</span>
                    <span className={styles.name}>{a.name}</span>
                    <span className={styles.meta}>
                      {a.releases ? <><b>{a.releases}</b> release{a.releases === 1 ? '' : 's'}</> : <b className={styles.fresh}>New signing</b>}
                      {latest && <> {'//'} latest: {latest}</>}
                    </span>
                    <span className={styles.go} aria-hidden="true">Profile →</span>
                  </Link>
                  {socials.length > 0 && (
                    <span className={styles.socials}>
                      {socials.map(({ href, label, Icon }) => (
                        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${a.name} on ${label}`}>
                          <Icon />
                        </a>
                      ))}
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
