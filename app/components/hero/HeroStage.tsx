'use client'

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { Big_Shoulders, JetBrains_Mono } from 'next/font/google'
import { FaSpotify } from 'react-icons/fa'
import PreviewPlayer from '../PreviewPlayer'
import styles from './hero.module.css'

const SignalField = dynamic(() => import('./SignalField'), { ssr: false })

const display = Big_Shoulders({ subsets: ['latin'], weight: ['800', '900'], display: 'swap', variable: '--hero-display' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '700'], display: 'swap', variable: '--hero-mono' })

export type HeroRelease = {
  slug: string
  artist: string | null
  title: string
  fullTitle: string
  coverUrl: string | null
  artUrl: string | null
  publishedAt: string | null
  typeLabel: string
  catalogue: string | null
  spotify: string | null
  beatport: string | null
  previewUrl: string | null
}

export type HeroIncoming = {
  id: string
  artist: string | null
  title: string
  catalogue: string | null
  releaseDate: string
}

const proxied = (url: string) => `/_next/image?url=${encodeURIComponent(url)}&w=1080&q=75`

const fmtDate = (iso: string | null, opts: Intl.DateTimeFormatOptions) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts }) : ''

function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  if (now === null) return <span className={styles.countdown}>--d --:--:--</span>
  const diff = Math.max(0, new Date(target).getTime() - now)
  const s = Math.floor(diff / 1000)
  const d = Math.floor(s / 86400)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <span className={styles.countdown} aria-label={`${d} days ${Math.floor((s % 86400) / 3600)} hours`}>
      {pad(d)}d {pad(Math.floor((s % 86400) / 3600))}:{pad(Math.floor((s % 3600) / 60))}:{pad(s % 60)}
    </span>
  )
}

export default function HeroStage({ release, incoming }: { release: HeroRelease; incoming: HeroIncoming[] }) {
  const rootRef = useRef<HTMLElement>(null)
  const slotRef = useRef<HTMLAnchorElement>(null)
  const [glReady, setGlReady] = useState(false)
  const next = incoming[0]

  const coverSrc = release.coverUrl ? proxied(release.coverUrl) : null
  const artSrc = release.artUrl ? proxied(release.artUrl) : coverSrc

  return (
    <section
      ref={rootRef}
      className={`${styles.hero} ${display.variable} ${mono.variable} ${glReady ? styles.glReady : ''}`}
      aria-labelledby="hero-title"
    >
      <div className={styles.field}>
        {coverSrc && artSrc && (
          <SignalField coverSrc={coverSrc} artSrc={artSrc} slotRef={slotRef} rootRef={rootRef} onReady={() => setGlReady(true)} />
        )}
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.meta}>
          <span className={styles.live}>
            <i className={styles.dot} aria-hidden="true" />
            Out now
          </span>
          <span>DnB Doctor · neurofunk &amp; drum and bass label</span>
          <span className={styles.bpm} aria-hidden="true">174 BPM</span>
        </div>

        <div className={styles.stage}>
          <div className={styles.copy}>
            <p className={styles.tag}>
              {release.catalogue && <span>{release.catalogue}</span>}
              <span>{release.typeLabel}</span>
              {release.publishedAt && <span>{fmtDate(release.publishedAt, { day: '2-digit', month: 'short', year: 'numeric' })}</span>}
            </p>

            {release.artist && <p className={styles.artist}>{release.artist}</p>}
            <h1 id="hero-title" className={styles.title}>
              <Link href={`/music/${release.slug}`} data-text={release.title}>
                {release.title}
              </Link>
            </h1>

            <div className={styles.actions}>
              {release.spotify && (
                <a className={styles.primary} href={release.spotify} target="_blank" rel="noopener noreferrer">
                  <FaSpotify aria-hidden="true" />
                  Play on Spotify
                </a>
              )}
              {release.beatport && (
                <a className={styles.secondary} href={release.beatport} target="_blank" rel="noopener noreferrer">
                  <Image src="/beatport.svg" alt="" width={16} height={16} />
                  Buy on Beatport
                </a>
              )}
              {release.previewUrl && (
                <PreviewPlayer previewUrl={release.previewUrl} title={release.fullTitle} artistName={release.artist} />
              )}
              <Link className={styles.ghost} href={`/music/${release.slug}`}>
                Release notes <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <Link ref={slotRef} href={`/music/${release.slug}`} className={styles.slot} aria-label={`Open ${release.fullTitle}`}>
            {release.coverUrl && (
              <Image
                src={release.coverUrl}
                alt={release.fullTitle}
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 520px"
                className={styles.slotImg}
              />
            )}
            <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
          </Link>
        </div>

        {next && (
          <div className={styles.incoming}>
            <div className={styles.nextDrop}>
              <span className={styles.label}>Next drop in</span>
              <Countdown target={next.releaseDate} />
            </div>
            <ol className={styles.queue}>
              {incoming.map((item) => (
                <li key={item.id}>
                  <span className={styles.cat}>{item.catalogue ?? 'TBA'}</span>
                  <span className={styles.qTitle}>
                    {item.artist && <b>{item.artist}</b>}
                    {item.title}
                  </span>
                  <time dateTime={item.releaseDate}>{fmtDate(item.releaseDate, { day: '2-digit', month: 'short' })}</time>
                </li>
              ))}
            </ol>
            <div className={styles.links}>
              <Link href="/music">All releases</Link>
              <Link href="/submit-demo">Submit a demo</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
