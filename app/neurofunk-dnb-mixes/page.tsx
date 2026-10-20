import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { djLinks } from '@/lib/affiliates'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { plainTitle } from '@/app/components/hero/releaseMeta'
import { shortDate } from '@/app/utils/shortDate'
import { soundcloudSrc, youtubeId } from '@/app/news/media'
import { CollectionTabs } from '@/app/components/collections/CollectionView'
import { COLLECTIONS, KINDS, countMixes, excerpt, loadCollections, type CollectionKind } from '@/app/components/collections/collections'
import base from '@/app/components/collections/collections.module.css'
import MixPlayer from './MixPlayer'
import styles from './mixes.module.css'

export const revalidate = 600

const SITE = 'https://dnbdoctor.com'
const URL = `${SITE}/neurofunk-dnb-mixes`
const DESCRIPTION =
  'Listen to curated neurofunk DnB mixes packed with rolling basslines and cinematic energy. Fresh “Mixes” drops, artist features, and heavy drum & bass sets.'

export const metadata: Metadata = {
  title: { absolute: 'Neurofunk DnB Mixes | Dark Drum & Bass Sets by DnB Doctor' },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Neurofunk DnB Mixes | Dark Drum & Bass Sets',
    description: 'Curated drum & bass mixes from the DnB Doctor roster with relentless bass pressure.',
    url: URL,
    siteName: 'DnB Doctor',
    type: 'website',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'Neurofunk DnB Mixes' }],
  },
  twitter: { card: 'summary_large_image', images: [`${SITE}/og-image.jpg`] },
}

type Mix = {
  id: string
  slug: string
  /** headline without the "| Neurofunk Drum & Bass Mix" kicker */
  title: string
  vol: number | null
  dj: { name: string; slug: string | null } | null
  cover: string | null
  date: string | null
  excerpt: string | null
  player: string | null
  tracks: number
  download: boolean
  video: boolean
}

const SERIES = /^NEUROBANGERZ,?\s*Vol[.,]?\s*(\d+)\s*[-–]\s*(.+)$/i

async function loadMixes(): Promise<Mix[]> {
  if (!process.env.DATABASE_URL) return []
  try {
    const [posts, roster] = await Promise.all([
      prisma.news.findMany({
        where: { categories: { has: 'Mixes' } },
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
          coverImageUrl: true,
          publishedAt: true,
          soundcloudUrl: true,
          scsc: true,
          youtubeUrl: true,
          tracklist: true,
          mixDownloadUrl: true,
          relatedArtistName: true,
          mixArtist: { select: { name: true, slug: true } },
        },
      }),
      prisma.artist.findMany({ select: { name: true, slug: true } }),
    ])
    const bySlug = new Map(roster.map((a) => [a.name.trim().toLowerCase(), a.slug]))
    return posts.map((p) => {
      const title = plainTitle(p.title).split(/\s+\|\s+/)[0].trim()
      const m = title.match(SERIES)
      const name = p.mixArtist?.name ?? p.relatedArtistName ?? m?.[2]?.trim() ?? null
      return {
        id: p.id,
        slug: p.slug,
        title,
        vol: m ? Number(m[1]) : null,
        dj: name ? { name, slug: p.mixArtist?.slug ?? bySlug.get(name.toLowerCase()) ?? null } : null,
        cover: p.coverImageUrl,
        date: p.publishedAt ? p.publishedAt.toISOString() : null,
        excerpt: excerpt(p.content),
        player: soundcloudSrc(p.soundcloudUrl, p.scsc),
        tracks: (p.tracklist || '').split('\n').filter((l) => l.trim()).length,
        download: !!p.mixDownloadUrl,
        video: !!youtubeId(p.youtubeUrl),
      }
    })
  } catch (error) {
    console.error('Failed to load mixes', error)
    return []
  }
}

function MixRow({ mix, index }: { mix: Mix; index: number }) {
  const href = `/news/${mix.slug}`
  return (
    <li className={styles.row} style={{ '--i': index } as React.CSSProperties}>
      <span className={styles.vol} aria-hidden="true">
        {mix.vol != null ? String(mix.vol).padStart(2, '0') : 'SP'}
      </span>
      <Link href={href} className={styles.cover} tabIndex={-1} aria-hidden="true">
        {mix.cover ? <Image src={mix.cover} alt="" fill sizes="(max-width: 700px) 92vw, 300px" /> : <span>No signal</span>}
      </Link>
      <div className={styles.body}>
        <p className={styles.meta}>
          {mix.date && <time dateTime={mix.date}>{shortDate(mix.date)}</time>}
          {mix.tracks > 0 && <span>{mix.tracks} tracks</span>}
          {mix.download && <span className={styles.tagGreen}>WAV download</span>}
          {mix.video && <span className={styles.tagPurple}>Video</span>}
        </p>
        <h3 className={styles.rowTitle}>
          <Link href={href}>{mix.vol != null && mix.dj ? mix.dj.name : mix.title}</Link>
        </h3>
        <p className={styles.by}>
          {mix.vol != null ? `NEUROBANGERZ · Vol. ${mix.vol}` : mix.dj ? `Mixed by ${mix.dj.name}` : 'DnB Doctor special'}
          {mix.dj?.slug && (
            <>
              {' · '}
              <Link href={`/artists/${mix.dj.slug}`}>Artist profile →</Link>
            </>
          )}
        </p>
        {mix.excerpt && <p className={styles.excerpt}>{mix.excerpt}</p>}
        <div className={styles.actions}>
          {mix.player && <MixPlayer src={mix.player} slug={mix.slug} title={mix.title} className={base.primary} playerClass={styles.player} />}
          <Link href={href} className={base.secondary}>
            {mix.tracks > 0 ? 'Tracklist & story' : 'Open mix'} →
          </Link>
        </div>
      </div>
    </li>
  )
}

export default async function NeurofunkDnBMixesPage() {
  const [mixes, all, mixCount] = await Promise.all([loadMixes(), loadCollections(), countMixes()])
  const latest = mixes[0]
  const series = mixes.filter((m) => m.vol != null)
  const specials = mixes.filter((m) => m.vol == null)
  const tracks = mixes.reduce((n, m) => n + m.tracks, 0)
  const counts = { ...(Object.fromEntries(KINDS.map((k) => [k, all[k].length])) as Record<CollectionKind, number>), mixes: mixCount }

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Neurofunk DnB Mixes',
      url: URL,
      description: DESCRIPTION,
      isPartOf: { '@type': 'WebSite', name: 'DnB Doctor', url: SITE },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: mixes.length,
        itemListElement: mixes.map((m, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'MusicPlaylist',
            name: m.title,
            url: `${SITE}/news/${m.slug}`,
            genre: 'Neurofunk Drum and Bass',
            ...(m.tracks > 0 && { numTracks: m.tracks }),
            ...(m.dj && { creator: { '@type': 'Person', name: m.dj.name, ...(m.dj.slug && { url: `${SITE}/artists/${m.dj.slug}` }) } }),
            ...(m.cover && { image: m.cover }),
            ...(m.date && { datePublished: m.date.slice(0, 10) }),
          },
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'DnB Doctor', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Music', item: `${SITE}/music` },
        { '@type': 'ListItem', position: 3, name: 'Neurofunk DnB Mixes', item: URL },
      ],
    },
  ]

  return (
    <div className={`${base.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- hero ---------- */}
      <header className={base.hero}>
        {latest?.cover && (
          <div className={base.heroBg} aria-hidden="true">
            <Image src={latest.cover} alt="" fill priority sizes="100vw" />
          </div>
        )}
        <div className={base.heroInner}>
          <CollectionTabs current="mixes" counts={counts} />

          <div className={base.heroGrid}>
            <div className={base.heroCopy}>
              <p className={base.kicker}>
                <span className={base.dot} aria-hidden="true" /> Neurofunk DnB Mixes
              </p>
              <h1 className={`${base.title} ${styles.title}`}>
                <span>Dark, Rolling</span>
                <span className={base.outline}>Drum &amp; Bass Mixes</span>
                <small>with Cinematic Pressure</small>
              </h1>
              <p className={base.lede}>
                Curated sets from the DnB Doctor roster and allies. Expect relentless basslines, halftime detours, and warehouse-ready energy. Every
                mix is tagged under “Mixes” so you can binge the newest drops without digging.
              </p>
              <dl className={styles.stats}>
                <div>
                  <dt>Mixes</dt>
                  <dd>{String(mixes.length).padStart(2, '0')}</dd>
                </div>
                <div>
                  <dt>NEUROBANGERZ vols</dt>
                  <dd>{String(series.length).padStart(2, '0')}</dd>
                </div>
                {tracks > 0 && (
                  <div>
                    <dt>Tracks listed</dt>
                    <dd>{tracks}</dd>
                  </div>
                )}
              </dl>
              <div className={base.ctas}>
                <a href="#mixes" className={base.secondary}>
                  Explore Mixes ↓
                </a>
                <Link href="/news" className={base.ghost}>
                  All News
                </Link>
              </div>
            </div>

            {latest && (
              <aside className={styles.latest} aria-labelledby="latest-title">
                <Link href={`/news/${latest.slug}`} className={styles.latestCover} tabIndex={-1} aria-hidden="true">
                  {latest.cover && <Image src={latest.cover} alt="" fill priority sizes="(max-width: 960px) 80vw, 420px" />}
                  <span className={styles.eq}>
                    {Array.from({ length: 16 }, (_, i) => (
                      <i key={i} style={{ '--b': i, '--h': `${20 + ((i * 37) % 11) * 7}%` } as React.CSSProperties} />
                    ))}
                  </span>
                </Link>
                <div className={styles.latestBody}>
                  <p className={base.label}>Latest mix{latest.date && ` · ${shortDate(latest.date)}`}</p>
                  <h2 id="latest-title" className={styles.latestTitle}>
                    <Link href={`/news/${latest.slug}`}>{latest.title}</Link>
                  </h2>
                  {latest.player && (
                    <MixPlayer src={latest.player} slug={`hero-${latest.slug}`} title={latest.title} className={base.primary} playerClass={styles.player} />
                  )}
                </div>
              </aside>
            )}
          </div>
        </div>
      </header>

      {/* ---------- mixes ---------- */}
      <section className={styles.list} id="mixes" aria-labelledby="mixes-title">
        <div className={styles.listHead}>
          <h2 id="mixes-title" className={base.h2}>
            Fresh <span className={base.outline}>Neurofunk Mixes</span>
          </h2>
          <ul className={styles.notes}>
            <li>
              <b>What you get</b> High-impact neurofunk selections, double drops, cinematic intros, and techy rollers for late-night systems.
            </li>
            <li>
              <b>Updated often</b> Fresh “Mixes” news posts as they land — no stale listings, just the latest sets.
            </li>
          </ul>
        </div>

        {mixes.length === 0 ? (
          <p className={styles.empty}>No mixes published yet. Check back soon for fresh neurofunk sets.</p>
        ) : (
          <>
            {series.length > 0 && (
              <div className={styles.group}>
                <h3 className={base.label}>The NEUROBANGERZ series · a guest DJ every volume</h3>
                <ol className={styles.rows}>
                  {series.map((m, i) => (
                    <MixRow key={m.id} mix={m} index={i} />
                  ))}
                </ol>
              </div>
            )}
            {specials.length > 0 && (
              <div className={styles.group}>
                <h3 className={base.label}>Specials &amp; showcases</h3>
                <ol className={styles.rows}>
                  {specials.map((m, i) => (
                    <MixRow key={m.id} mix={m} index={i} />
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </section>

      {/* ---------- tracks for DJs ---------- */}
      <section className={base.extra} aria-labelledby="dj-title">
        <h2 id="dj-title" className={base.h2}>
          Need tracks <span className={base.outline}>for your sets?</span>
        </h2>
        <div className={base.tools}>
          <p className={base.label}>Get the latest DnB on Beatport and DJCity — the go-to sources for working DJs.</p>
          <div className={base.toolLinks}>
            {djLinks.map((l) => (
              <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer sponsored">
                <strong>{l.name}</strong>
                <span>{l.tagline ?? l.description}</span>
              </a>
            ))}
          </div>
          <p className={base.disclose}>Some links are affiliate links. We may earn a commission at no extra cost to you.</p>
        </div>
      </section>

      {/* ---------- keep digging ---------- */}
      <nav className={base.more} aria-labelledby="more-title">
        <h2 id="more-title" className={base.label}>
          Keep digging
        </h2>
        <ul>
          {KINDS.map((k) => (
            <li key={k}>
              <Link href={COLLECTIONS[k].path}>
                <strong>{COLLECTIONS[k].tab}</strong>
                <span>
                  {counts[k]} {counts[k] === 1 ? COLLECTIONS[k].noun[0] : COLLECTIONS[k].noun[1]}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/music">
              <strong>All releases</strong>
              <span>The full catalogue</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
