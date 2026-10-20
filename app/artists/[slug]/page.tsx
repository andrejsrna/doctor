import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FaEnvelope, FaFacebookF, FaInstagram, FaSoundcloud, FaSpotify } from 'react-icons/fa'
import { prisma } from '@/lib/prisma'
import { sanitizeHtml } from '@/lib/sanitize'
import { plainTitle, splitTitle } from '@/app/components/hero/releaseMeta'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import MoreFromArtist, { type Item } from '@/app/components/MoreFromArtist'
import styles from './artist.module.css'
import { shortDate } from '@/app/utils/shortDate'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

const SITE = 'https://dnbdoctor.com'

const toText = (html: string) =>
  plainTitle(html.replace(/<\/(p|h\d|li|div)>|<br\s*\/?>/gi, ' '))
    .replace(/\s+/g, ' ')
    .trim()

function excerpt(html: string | null, max = 160) {
  const text = toText(html || '')
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]$/, '') + '…'
}

const fmtDate = (d: Date) => shortDate(d)

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Whole-name match: "Damo" must not hit "Damon". */
const mentions = (text: string, name: string) =>
  new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(name)}($|[^\\p{L}\\p{N}])`, 'iu').test(text)

const titleOf = (raw: string) => splitTitle(plainTitle(raw), null).title

function spotifyArtistId(url?: string | null) {
  return url?.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?artist\/([A-Za-z0-9]{22})/)?.[1] ?? null
}

type Social = { name: string; url: string; icon: typeof FaSpotify }

/** Profile links that point at this artist — not placeholders to the label's own accounts. */
function socials(a: { soundcloud: string | null; spotify: string | null; facebook: string | null; instagram: string | null }): Social[] {
  const own = (u: string | null) => (u && !/(soundcloud|instagram|facebook)\.com\/dnbdoctor\/?(\?.*)?$/i.test(u) ? u : null)
  const all = [
    { name: 'Spotify', url: own(a.spotify), icon: FaSpotify },
    { name: 'SoundCloud', url: own(a.soundcloud), icon: FaSoundcloud },
    { name: 'Instagram', url: own(a.instagram), icon: FaInstagram },
    { name: 'Facebook', url: own(a.facebook), icon: FaFacebookF },
  ]
  return all.filter((s): s is Social => !!s.url)
}

/* ---------------- data ---------------- */

async function load(slug: string) {
  const artist = await prisma.artist.findUnique({ where: { slug } })
  if (!artist) return null

  const [releases, news, roster] = await Promise.all([
    prisma.release.findMany({
      where: {
        OR: [
          { artistName: { contains: artist.name, mode: 'insensitive' } },
          { title: { contains: artist.name, mode: 'insensitive' } },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      select: { id: true, slug: true, title: true, artistName: true, coverImageUrl: true, previewUrl: true, publishedAt: true },
    }),
    prisma.news.findMany({
      where: {
        OR: [
          { mixArtistId: artist.id },
          { relatedArtistName: { equals: artist.name, mode: 'insensitive' } },
          { tracklist: { contains: artist.name, mode: 'insensitive' } },
          { title: { contains: artist.name, mode: 'insensitive' } },
          { content: { contains: artist.name, mode: 'insensitive' } },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      select: {
        slug: true,
        title: true,
        coverImageUrl: true,
        publishedAt: true,
        categories: true,
        tracklist: true,
        content: true,
        mixArtistId: true,
        relatedArtistName: true,
      },
    }),
    prisma.artist.findMany({ where: { id: { not: artist.id } }, select: { name: true, slug: true, imageUrl: true } }),
  ])

  // the DB queries are substring matches — keep whole-name credits only
  const credited = releases.filter((r) => mentions(`${r.artistName ?? ''} ${plainTitle(r.title)}`, artist.name))

  const featured = news
    .map((n) => {
      const decks = n.mixArtistId === artist.id || n.relatedArtistName?.toLowerCase() === artist.name.toLowerCase()
      const plays = (n.tracklist || '').split(/\r?\n/).filter((l) => mentions(l, artist.name)).length
      const named = mentions(plainTitle(n.title), artist.name) || mentions(toText(n.content || ''), artist.name)
      return { slug: n.slug, title: n.title, coverImageUrl: n.coverImageUrl, publishedAt: n.publishedAt, categories: n.categories, decks, plays, named }
    })
    .filter((n) => n.decks || n.plays > 0 || n.named)

  // other roster acts credited on the same releases
  const collab = new Map<string, { name: string; slug: string; imageUrl: string | null; count: number }>()
  for (const r of credited) {
    const credit = r.artistName || splitTitle(plainTitle(r.title), null).artist || ''
    for (const o of roster) {
      if (mentions(credit, o.name)) collab.set(o.slug, { ...o, count: (collab.get(o.slug)?.count ?? 0) + 1 })
    }
  }

  return { artist, releases: credited, featured, collaborators: [...collab.values()].sort((a, b) => b.count - a.count) }
}

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return []
  try {
    return (await prisma.artist.findMany({ select: { slug: true } })).map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

/* ---------------- page ---------------- */

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params
  const data = await load(slug)
  if (!data) notFound()
  const { artist, releases, featured, collaborators } = data

  const url = `${SITE}/artists/${slug}`
  const links = socials(artist)
  const spotifyId = spotifyArtistId(artist.spotify)
  const dated = releases.filter((r) => r.publishedAt)
  const latest = dated[0] ?? releases[0]
  const firstYear = dated.length ? dated[dated.length - 1].publishedAt!.getUTCFullYear() : null
  const mixPlays = featured.reduce((n, f) => n + f.plays, 0)
  const items: Item[] = releases.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    coverImageUrl: r.coverImageUrl,
    previewUrl: r.previewUrl,
    publishedAt: r.publishedAt?.toISOString() ?? null,
  }))
  const bio = artist.bio && toText(artist.bio).length > 20 ? sanitizeHtml(artist.bio) : null
  const fallbackBio =
    releases.length > 0
      ? `${artist.name} is part of the DnB Doctor family${firstYear ? ` since ${firstYear}` : ''}, with ${releases.length} ${
          releases.length === 1 ? 'release' : 'releases'
        } on the label${latest ? ` — most recently “${titleOf(latest.title)}”` : ''}.`
      : `${artist.name} is part of the DnB Doctor neurofunk family.`
  let n = 1
  const num = () => String(n++).padStart(2, '0')

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'MusicGroup',
      '@id': `${url}#artist`,
      name: artist.name,
      url,
      genre: ['Drum and Bass', 'Neurofunk'],
      description: excerpt(artist.bio, 200) || fallbackBio,
      ...(artist.imageUrl && { image: artist.imageUrl }),
      ...(links.length > 0 && { sameAs: links.map((l) => l.url) }),
      ...(releases.length > 0 && {
        track: releases.slice(0, 20).map((r) => ({
          '@type': 'MusicRecording',
          name: titleOf(r.title),
          url: `${SITE}/music/${r.slug}`,
          ...(r.publishedAt && { datePublished: r.publishedAt.toISOString().slice(0, 10) }),
        })),
      }),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'DnB Doctor', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Artists', item: `${SITE}/artists` },
        { '@type': 'ListItem', position: 3, name: artist.name, item: url },
      ],
    },
  ]

  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`} data-photo={artist.imageUrl ? '' : undefined}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- hero ---------- */}
      <header className={styles.hero}>
        {artist.imageUrl ? (
          <div className={styles.photo}>
            <Image src={artist.imageUrl} alt={artist.name} fill priority sizes="(max-width: 960px) 100vw, 55vw" />
          </div>
        ) : (
          <div className={styles.monogram} aria-hidden="true">
            {artist.name.slice(0, 1)}
          </div>
        )}
        <div className={styles.heroInner}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <Link href="/artists">Artists</Link>{' '}
            <span aria-hidden="true">/</span> <span aria-current="page">{artist.name}</span>
          </nav>

          <div className={styles.heroMain}>
            <p className={styles.kicker}>
              <span className={styles.dot} aria-hidden="true" /> DnB Doctor roster
            </p>
            <h1 className={styles.name} data-len={artist.name.length > 12 ? 'l' : artist.name.length > 8 ? 'm' : undefined}>
              {artist.name}
            </h1>

            <dl className={styles.stats}>
              <div>
                <dt>Releases</dt>
                <dd>{String(releases.length).padStart(2, '0')}</dd>
              </div>
              {firstYear && (
                <div>
                  <dt>On the label since</dt>
                  <dd>{firstYear}</dd>
                </div>
              )}
              {mixPlays > 0 && (
                <div>
                  <dt>Played in our mixes</dt>
                  <dd>{String(mixPlays).padStart(2, '0')}×</dd>
                </div>
              )}
            </dl>

            <div className={styles.actions}>
              {latest && (
                <Link href={`/music/${latest.slug}`} className={styles.primary}>
                  Latest: {titleOf(latest.title)} <span aria-hidden="true">→</span>
                </Link>
              )}
              {links.length > 0 && (
                <ul className={styles.socials} aria-label={`${artist.name} on the web`}>
                  {links.map(({ name, url: href, icon: Icon }) => (
                    <li key={name}>
                      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${artist.name} on ${name}`}>
                        <Icon aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ---------- bio ---------- */}
      <section className={styles.section} aria-labelledby="bio-title">
        <div className={styles.sideHead}>
          <p className={styles.label}>{num()} / Profile</p>
          <h2 id="bio-title" className={styles.h2}>
            About <span className={styles.outline}>{artist.name}</span>
          </h2>
        </div>
        <div className={styles.bioBody}>
          {bio ? <div className={styles.prose} dangerouslySetInnerHTML={{ __html: bio }} /> : <p className={styles.lede}>{fallbackBio}</p>}

          {latest && (
            <Link href={`/music/${latest.slug}`} className={styles.latest}>
              <span className={styles.latestImg}>{latest.coverImageUrl && <Image src={latest.coverImageUrl} alt="" fill sizes="96px" />}</span>
              <span className={styles.latestText}>
                <span className={styles.label}>Latest transmission</span>
                <span className={styles.latestTitle}>{titleOf(latest.title)}</span>
                {latest.publishedAt && <span className={styles.meta}>{fmtDate(latest.publishedAt)}</span>}
              </span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          )}
        </div>
      </section>

      {/* ---------- spotify ---------- */}
      {spotifyId && (
        <section className={styles.section} aria-labelledby="listen-title">
          <div className={styles.sideHead}>
            <p className={styles.label}>{num()} / Listen</p>
            <h2 id="listen-title" className={styles.h2}>
              Top <span className={styles.outline}>tracks</span>
            </h2>
            <a href={artist.spotify!} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
              Follow on Spotify ↗
            </a>
          </div>
          <iframe
            className={styles.spotify}
            src={`https://open.spotify.com/embed/artist/${spotifyId}?theme=0`}
            title={`${artist.name} — top tracks on Spotify`}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </section>
      )}

      {/* ---------- discography ---------- */}
      {items.length > 0 && (
        <div className={styles.disco}>
          <MoreFromArtist artistName={artist.name} currentPostId="" initialItems={items} lead="Releases by" />
        </div>
      )}

      {/* ---------- mixes & news ---------- */}
      {featured.length > 0 && (
        <section className={styles.block} aria-labelledby="feat-title">
          <div className={styles.rowHead}>
            <p className={styles.label}>{num()} / On the air</p>
            <h2 id="feat-title" className={styles.h2}>
              Featured <span className={styles.outline}>in</span>
            </h2>
          </div>
          <ul className={styles.featGrid}>
            {featured.slice(0, 6).map((f) => (
              <li key={f.slug}>
                <Link href={`/news/${f.slug}`} className={styles.featCard}>
                  <span className={styles.featImg}>
                    {f.coverImageUrl ? (
                      <Image src={f.coverImageUrl} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" />
                    ) : (
                      <span className={styles.featFallback} aria-hidden="true">
                        DnB
                      </span>
                    )}
                    <span className={styles.badge}>
                      {f.decks ? 'Behind the decks' : f.plays > 0 ? `${f.plays} ${f.plays === 1 ? 'track' : 'tracks'} in the mix` : 'Mentioned'}
                    </span>
                  </span>
                  <span className={styles.meta}>
                    {f.categories[0] ?? 'News'}
                    {f.publishedAt && ` · ${fmtDate(f.publishedAt)}`}
                  </span>
                  <span className={styles.featTitle}>{plainTitle(f.title)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- collaborators ---------- */}
      {collaborators.length > 0 && (
        <section className={styles.block} aria-labelledby="collab-title">
          <div className={styles.rowHead}>
            <p className={styles.label}>{num()} / Collaborations</p>
            <h2 id="collab-title" className={styles.h2}>
              Shared <span className={styles.outline}>frequencies</span>
            </h2>
          </div>
          <ul className={styles.collabList}>
            {collaborators.map((c) => (
              <li key={c.slug}>
                <Link href={`/artists/${c.slug}`} className={styles.collabCard}>
                  <span className={styles.collabImg}>
                    {c.imageUrl ? <Image src={c.imageUrl} alt="" fill sizes="56px" /> : <span aria-hidden="true">{c.name.slice(0, 1)}</span>}
                  </span>
                  <span className={styles.collabName}>{c.name}</span>
                  <span className={styles.meta}>
                    {c.count} joint release{c.count > 1 ? 's' : ''}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- booking ---------- */}
      <section className={styles.booking} aria-labelledby="book-title">
        <div>
          <p className={styles.label}>Booking &amp; collaboration</p>
          <h2 id="book-title" className={styles.h2}>
            Work with <span className={styles.accent}>{artist.name}.</span>
          </h2>
          <p className={styles.lede}>Booking inquiries, remixes, collaborations or press — reach the label team and we connect you directly.</p>
        </div>
        <div className={styles.bookActions}>
          <a href={`mailto:booking@dnbdoctor.com?subject=${encodeURIComponent(`Inquiry about ${artist.name}`)}`} className={styles.primary}>
            <FaEnvelope aria-hidden="true" /> booking@dnbdoctor.com
          </a>
          <Link href="/contact" className={styles.secondary}>
            Contact form <span aria-hidden="true">→</span>
          </Link>
          <Link href="/artists" className={styles.textLink}>
            ← All artists
          </Link>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const artist = await prisma.artist.findUnique({ where: { slug }, select: { name: true, bio: true, imageUrl: true } })
  if (!artist) return { title: 'Artist not found | DnB Doctor', robots: { index: false } }
  const title = `${artist.name} — Neurofunk Artist | DnB Doctor`
  const description =
    excerpt(artist.bio) || `${artist.name} on DnB Doctor: neurofunk and drum & bass releases, mixes and news from the label roster.`
  const url = `${SITE}/artists/${slug}`
  const image = artist.imageUrl || `${SITE}/og-image.jpg`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'profile', title, description, url, siteName: 'DnB Doctor', locale: 'en_US', images: [{ url: image, alt: artist.name }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}
