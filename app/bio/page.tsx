import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { plainTitle, splitTitle } from '@/app/components/hero/releaseMeta'
import styles from './bio.module.css'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Links – New Neurofunk, Events & Demo Submissions',
  description: 'DnB Doctor in one place: latest neurofunk releases, The Lab events, free sample pack, newsletter, demo submissions and socials.',
  alternates: { canonical: 'https://dnbdoctor.com/bio' },
  // Link-in-bio hub: duplicates other pages, so keep it out of the index but pass link equity.
  robots: { index: false, follow: true },
}

/** Pinned event — hides itself the morning after the party. */
const EVENT = {
  until: new Date('2026-10-31T05:00:00+01:00'),
  slug: 'dnb-doctor-the-lab-neurofunk-fact-club-bratislava',
  tag: 'Event // 30.10 // Free entry',
  title: 'The Lab — Fact Club, Bratislava',
  text: 'No headliners. No VIPs. Just neurofunk.',
}

const LINKS = [
  { href: 'https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15', label: 'Monthly Neurofunk Selection', tag: 'Spotify playlist', external: true },
  { href: '/sample-packs', label: 'Free neurofunk sample pack', tag: 'Download', external: false },
  { href: '/submit-demo', label: 'Send us your demo', tag: 'Producers', external: false },
  { href: '/newsletter', label: 'Join the newsletter', tag: 'Releases first', external: false },
  { href: '/neurofunk-dnb-mixes', label: 'Neurofunk DJ mixes', tag: 'Listen', external: false },
] as const

const SOCIALS = [
  ['Instagram', 'https://www.instagram.com/dnbdoctor/'],
  ['SoundCloud', 'https://soundcloud.com/dnbdoctor'],
  ['YouTube', 'https://www.youtube.com/@dnbdoctor1'],
  ['Bandcamp', 'https://dnbdoctor.bandcamp.com/'],
  ['Beatport', 'https://www.beatport.com/label/dnb-doctor/75618'],
  ['Facebook', 'https://www.facebook.com/dnbdoctor'],
] as const

type Item = { key: string; href: string; kind: 'Release' | 'News'; title: string; artist: string | null; cover: string | null; date: Date }

async function feed(showEvent: boolean): Promise<Item[]> {
  if (!process.env.DATABASE_URL) return []
  const now = new Date()
  try {
    const [releases, news] = await Promise.all([
      prisma.release.findMany({
        where: { publishedAt: { lte: now } },
        orderBy: { publishedAt: 'desc' },
        take: 12,
        select: { id: true, slug: true, title: true, artistName: true, coverImageUrl: true, publishedAt: true },
      }),
      prisma.news.findMany({
        where: { publishedAt: { lte: now }, ...(showEvent ? { slug: { not: EVENT.slug } } : {}) },
        orderBy: { publishedAt: 'desc' },
        take: 6,
        select: { id: true, slug: true, title: true, coverImageUrl: true, publishedAt: true },
      }),
    ])
    const items: Item[] = [
      ...releases.map((r) => {
        const { artist, title } = splitTitle(plainTitle(r.title), r.artistName)
        return { key: `r-${r.id}`, href: `/music/${r.slug}`, kind: 'Release' as const, title, artist, cover: r.coverImageUrl, date: r.publishedAt! }
      }),
      ...news.map((n) => ({ key: `n-${n.id}`, href: `/news/${n.slug}`, kind: 'News' as const, title: n.title, artist: null, cover: n.coverImageUrl, date: n.publishedAt! })),
    ]
    return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 14)
  } catch {
    return []
  }
}

const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default async function BioPage() {
  const showEvent = new Date() < EVENT.until
  const items = await feed(showEvent)

  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <div className={styles.wrap}>
        <header className={styles.head}>
          <h1 className={styles.title}>DnB Doctor</h1>
          <p className={styles.sub}>
            <span className={styles.dot} aria-hidden="true" /> Neurofunk drum &amp; bass label
          </p>
        </header>

        <nav aria-label="Main links">
          <ul className={styles.links}>
            {showEvent && (
              <li>
                <Link href={`/news/${EVENT.slug}`} className={`${styles.link} ${styles.event}`}>
                  <span className={styles.tag}>{EVENT.tag}</span>
                  <span className={styles.label}>{EVENT.title}</span>
                  <span className={styles.text}>{EVENT.text}</span>
                </Link>
              </li>
            )}
            {LINKS.map((l) => (
              <li key={l.href}>
                {l.external ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <span className={styles.tag}>{l.tag}</span>
                    <span className={styles.label}>
                      {l.label} <span aria-hidden="true">↗</span>
                    </span>
                  </a>
                ) : (
                  <Link href={l.href} className={styles.link}>
                    <span className={styles.tag}>{l.tag}</span>
                    <span className={styles.label}>
                      {l.label} <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <ul className={styles.socials} aria-label="DnB Doctor on social media">
          {SOCIALS.map(([name, href]) => (
            <li key={name}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            </li>
          ))}
        </ul>

        {items.length > 0 && (
          <section aria-labelledby="latest-title">
            <h2 id="latest-title" className={styles.h2}>
              Latest from the lab
            </h2>
            <ul className={styles.feed}>
              {items.map((it) => (
                <li key={it.key}>
                  <Link href={it.href} className={styles.item}>
                    <span className={styles.cover}>{it.cover && <Image src={it.cover} alt="" fill sizes="72px" />}</span>
                    <span className={styles.meta}>
                      <span className={styles.kind} data-kind={it.kind}>
                        {it.kind} · <time dateTime={it.date.toISOString()}>{fmt(it.date)}</time>
                      </span>
                      {it.artist && <span className={styles.artist}>{it.artist}</span>}
                      <span className={styles.itemTitle}>{it.title}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className={styles.more}>
              <Link href="/music">All releases →</Link>
              <Link href="/news">All news →</Link>
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
