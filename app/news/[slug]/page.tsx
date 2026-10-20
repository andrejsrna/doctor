import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import parse, { type DOMNode, domToReact, Element } from 'html-react-parser'
import { prisma } from '@/lib/prisma'
import { sanitizeHtml } from '@/lib/sanitize'
import { plainTitle } from '@/app/components/hero/releaseMeta'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import NewsMedia from './NewsMedia'
import ShareBar from './ShareBar'
import styles from './post.module.css'
import { shortDate } from '@/app/utils/shortDate'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

const SITE = 'https://dnbdoctor.com'

const CHANNELS = [
  { name: 'Spotify playlist', href: 'https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9' },
  { name: 'YouTube', href: 'https://www.youtube.com/@dnbdoctor1' },
  { name: 'Discord', href: 'https://discord.gg/GE2HWFdgXG' },
  { name: 'Instagram', href: 'https://www.instagram.com/dnbdoctor' },
]

/* ---------------- helpers ---------------- */

function youtubeId(url?: string | null) {
  if (!url) return null
  try {
    const u = new URL(url.trim())
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null
    const parts = u.pathname.split('/')
    if (parts[1] === 'shorts' || parts[1] === 'embed') return parts[2] || null
    return u.searchParams.get('v')
  } catch {
    return null
  }
}

const SC_PARAMS = 'color=%2339ff14&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false'

/** Player URL from the `soundcloudUrl` field, else the src of the legacy WordPress `scsc` embed. */
function soundcloudSrc(url?: string | null, legacyEmbed?: string | null) {
  try {
    if (url) {
      const u = new URL(url.trim())
      if (u.hostname.endsWith('soundcloud.com')) return `https://w.soundcloud.com/player/?url=${encodeURIComponent(u.toString())}&${SC_PARAMS}`
    }
    const src = legacyEmbed?.match(/src="([^"]+)"/)?.[1]?.replace(/&amp;/g, '&')
    if (src && new URL(src).hostname === 'w.soundcloud.com') {
      const track = new URL(src).searchParams.get('url')
      if (track) return `https://w.soundcloud.com/player/?url=${encodeURIComponent(track)}&${SC_PARAMS}`
    }
  } catch {
    /* malformed URL — no player */
  }
  return null
}

const toText = (html: string) =>
  plainTitle(html.replace(/<\/(p|h\d|li|div|figcaption)>|<br\s*\/?>/gi, ' '))
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim()

function excerpt(html: string | null, max = 160) {
  const text = toText(html || '')
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]$/, '') + '…'
}

const fmtDate = (d: Date) => shortDate(d)

/** "NEUROBANGERZ, Vol, 11 - DVS | Neurofunk Drum & Bass Mix" → main line + kicker after the pipe. */
function splitHeadline(title: string) {
  const [main, ...rest] = title.split(/\s+\|\s+/)
  return { main: main.trim(), sub: rest.join(' | ').trim() || null }
}

type Roster = Map<string, { name: string; slug: string }>

const SEP = /(\s*,\s*|\s+&\s+|\s+x\s+|\s+(?:ft|feat)\.?\s+|\s+vs\.?\s+)/i

/** Split a credit into names and separators, marking names that are on the DnB Doctor roster. */
function credit(text: string, roster: Roster) {
  return text.split(SEP).map((part) => ({ part, artist: SEP.test(part) ? undefined : roster.get(part.trim().toLowerCase()) }))
}

/** One tracklist line → timestamp + two halves; roster names linked on the side that is clearly the artist credit. */
function parseTrack(raw: string, roster: Roster) {
  let line = raw.trim().replace(/^\d{1,3}\s*[.)]\s*/, '')
  const time = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s+/)?.[1] ?? null
  if (time) line = line.slice(time.length).trim()
  const cut = line.search(/\s+[-–—]\s+|\s+-(?=\S)|(?<=\S)-\s+/)
  if (cut < 0) return { time, a: credit(line, new Map()), b: null }
  const left = line.slice(0, cut).trim()
  const right = line.slice(cut).replace(/^\s*[-–—]\s*/, '').trim()
  const l = credit(left, roster)
  const r = credit(right, roster)
  const hits = (c: ReturnType<typeof credit>) => c.filter((x) => x.artist).length
  const lh = hits(l)
  const rh = hits(r)
  const plain = (c: ReturnType<typeof credit>) => c.map((x) => ({ part: x.part, artist: undefined }))
  // normalise to title first, artist credit second (lists mix "Title - Artist" and "Artist - Title")
  if (lh > rh) return { time, a: plain(r), b: l }
  return { time, a: plain(l), b: rh > lh ? r : plain(r) }
}

function Credit({ parts }: { parts: { part: string; artist?: { name: string; slug: string } }[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.artist ? (
          <Link key={i} href={`/artists/${p.artist.slug}`}>
            {p.part}
          </Link>
        ) : (
          <span key={i}>{p.part}</span>
        ),
      )}
    </>
  )
}

/** WordPress HTML → React: real headings (h1 demoted), optimised images, no inline styles. */
function Body({ html }: { html: string }) {
  return (
    <>
      {parse(sanitizeHtml(html), {
        replace: (node) => {
          if (!(node instanceof Element)) return undefined
          const kids = () => domToReact(node.children as DOMNode[])
          if (node.name === 'img') {
            const { src, alt, width, height } = node.attribs
            const w = parseInt(width, 10)
            const h = parseInt(height, 10)
            if (!src || !w || !h) return <></>
            return <Image src={src} alt={alt || ''} width={w} height={h} sizes="(max-width: 900px) 100vw, 760px" />
          }
          if (node.name === 'figure') return <figure>{kids()}</figure>
          if (node.name === 'h1') return <h2>{kids()}</h2>
          if (node.name === 'a') {
            const href = node.attribs.href || ''
            const external = /^https?:\/\//.test(href) && !href.startsWith(SITE)
            return (
              <a href={href.startsWith(SITE) ? href.slice(SITE.length) || '/' : href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {kids()}
              </a>
            )
          }
          if (node.attribs?.style) delete node.attribs.style
          return undefined
        },
      })}
    </>
  )
}

/* ---------------- data ---------------- */

async function load(slug: string) {
  const post = await prisma.news.findUnique({
    where: { slug },
    include: { mixArtist: { select: { slug: true, name: true, bio: true, imageUrl: true, soundcloud: true, spotify: true, instagram: true } } },
  })
  if (!post) return null

  const card = { slug: true, title: true, coverImageUrl: true, publishedAt: true, categories: true } as const
  const at = post.publishedAt ?? post.createdAt
  const [newer, older, related, roster] = await Promise.all([
    prisma.news.findFirst({ where: { publishedAt: { gt: at } }, orderBy: { publishedAt: 'asc' }, select: card }),
    prisma.news.findFirst({ where: { publishedAt: { lt: at } }, orderBy: { publishedAt: 'desc' }, select: card }),
    prisma.news.findMany({
      where: { id: { not: post.id }, ...(post.categories.length ? { categories: { hasSome: post.categories } } : {}) },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: card,
    }),
    post.tracklist ? prisma.artist.findMany({ select: { name: true, slug: true } }) : Promise.resolve([]),
  ])
  return { post, newer, older, related, roster: new Map(roster.map((a) => [a.name.toLowerCase(), a])) as Roster }
}

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return []
  try {
    return (await prisma.news.findMany({ select: { slug: true } })).map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

/* ---------------- page ---------------- */

export default async function NewsPostPage({ params }: PageProps) {
  const { slug } = await params
  const data = await load(slug)
  if (!data) notFound()
  const { post, newer, older, related, roster } = data

  const url = `${SITE}/news/${slug}`
  const title = plainTitle(post.title)
  const { main, sub } = splitHeadline(title)
  const isMix = post.categories.includes('Mixes')
  const category = post.categories[0] ?? 'News'
  const date = post.publishedAt ?? post.createdAt
  const words = toText(post.content || '').split(' ').filter(Boolean).length
  const readMin = Math.max(1, Math.round(words / 220))

  const yt = youtubeId(post.youtubeUrl)
  const sc = soundcloudSrc(post.soundcloudUrl, post.scsc)
  const tracks = (post.tracklist || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => parseTrack(l, roster))
  const rosterInMix = new Map<string, { name: string; slug: string }>()
  for (const t of tracks) for (const p of [...t.a, ...(t.b ?? [])]) if (p.artist) rosterInMix.set(p.artist.slug, p.artist)

  const download = isMix && post.mixDownloadUrl ? post.mixDownloadUrl : null
  const dlExt = download?.split('?')[0].split('.').pop()?.toUpperCase()
  const mixer = post.mixArtist?.name || post.relatedArtistName || null

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title.slice(0, 110),
      description: excerpt(post.content, 200),
      datePublished: date.toISOString(),
      dateModified: post.updatedAt.toISOString(),
      ...(post.coverImageUrl && { image: [post.coverImageUrl] }),
      author: post.mixArtist
        ? { '@type': 'Person', name: post.mixArtist.name, url: `${SITE}/artists/${post.mixArtist.slug}` }
        : { '@type': 'Organization', name: 'DnB Doctor', url: SITE },
      publisher: { '@type': 'Organization', name: 'DnB Doctor', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/logo-1.png` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      articleSection: category,
      keywords: ['Drum and Bass', 'Neurofunk', ...post.categories, mixer].filter(Boolean).join(', '),
      ...(words > 0 && { wordCount: words }),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'DnB Doctor', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE}/news` },
        { '@type': 'ListItem', position: 3, name: main, item: url },
      ],
    },
  ]

  return (
    <article className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`} data-kind={isMix ? 'mix' : 'article'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- hero ---------- */}
      <header className={styles.hero}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <Link href="/news">News</Link>{' '}
          <span aria-hidden="true">/</span> <span aria-current="page">{category}</span>
        </nav>

        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <p className={styles.meta}>
              <span className={styles.tag}>{category}</span>
              <time dateTime={date.toISOString()}>{fmtDate(date)}</time>
              {isMix && tracks.length > 0 ? <span>{tracks.length} tracks</span> : words > 120 ? <span>{readMin} min read</span> : null}
            </p>
            <h1 className={styles.title}>
              {main}
              {sub && <span className={styles.sub}>{sub}</span>}
            </h1>
            {mixer && (
              <p className={styles.byline}>
                {isMix ? 'Mixed by' : 'By'}{' '}
                {post.mixArtist ? <Link href={`/artists/${post.mixArtist.slug}`}>{mixer}</Link> : <strong>{mixer}</strong>}
              </p>
            )}
          </div>

          {yt ? (
            <NewsMedia title={title} youtubeId={yt} soundcloudSrc={sc} />
          ) : post.coverImageUrl && (
            <figure className={styles.cover}>
              <Image src={post.coverImageUrl} alt={title} fill priority sizes="(max-width: 960px) 100vw, 46vw" />
            </figure>
          )}
        </div>
      </header>

      {/* ---------- body ---------- */}
      <div className={styles.layout}>
        <div className={styles.main}>
          {!yt && sc && <NewsMedia title={title} youtubeId={null} soundcloudSrc={sc} />}

          {post.content && (
            <div className={styles.prose} data-story={isMix || undefined}>
              <Body html={post.content} />
            </div>
          )}

          {download && (
            <section className={styles.download} aria-labelledby="dl-title">
              <div>
                <p className={styles.label}>Download mix</p>
                <h2 id="dl-title" className={styles.h3}>
                  Take the full mix offline.
                </h2>
                <p className={styles.muted}>Keep it ready for the road, the studio or late-night listening.</p>
              </div>
              <a href={download} download className={styles.dlBtn}>
                <span aria-hidden="true">↓</span> Download {dlExt && dlExt.length <= 4 ? dlExt : 'mix'}
              </a>
            </section>
          )}

          {tracks.length > 0 && (
            <section className={styles.tracklist} aria-labelledby="tl-title">
              <div className={styles.tlHead}>
                <h2 id="tl-title" className={styles.label}>
                  Tracklist
                </h2>
                <span className={styles.muted}>
                  {tracks.length} tracks
                  {rosterInMix.size > 0 && ` · ${rosterInMix.size} DnB Doctor artists`}
                </span>
              </div>
              <ol className={styles.tracks}>
                {tracks.map((t, i) => (
                  <li key={i}>
                    <span className={styles.tn}>{t.time ?? String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.tt}>
                      <span className={styles.ta}>
                        <Credit parts={t.a} />
                      </span>
                      {t.b && (
                        <span className={styles.tb}>
                          <Credit parts={t.b} />
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {/* ---------- aside ---------- */}
        <aside className={styles.aside}>
          {post.mixArtist && (
            <div className={styles.card}>
              <p className={styles.label}>{isMix ? 'Behind the decks' : 'Artist'}</p>
              <Link href={`/artists/${post.mixArtist.slug}`} className={styles.artist}>
                {post.mixArtist.imageUrl && (
                  <span className={styles.artistImg}>
                    <Image src={post.mixArtist.imageUrl} alt="" fill sizes="96px" />
                  </span>
                )}
                <span className={styles.artistName}>{post.mixArtist.name}</span>
              </Link>
              {post.mixArtist.bio && <p className={styles.muted}>{excerpt(post.mixArtist.bio, 140)}</p>}
              <p className={styles.links}>
                <Link href={`/artists/${post.mixArtist.slug}`}>Profile</Link>
                {post.mixArtist.soundcloud && (
                  <a href={post.mixArtist.soundcloud} target="_blank" rel="noopener noreferrer">
                    SoundCloud
                  </a>
                )}
                {post.mixArtist.spotify && (
                  <a href={post.mixArtist.spotify} target="_blank" rel="noopener noreferrer">
                    Spotify
                  </a>
                )}
                {post.mixArtist.instagram && (
                  <a href={post.mixArtist.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                )}
              </p>
            </div>
          )}

          {rosterInMix.size > 0 && (
            <div className={styles.card}>
              <p className={styles.label}>Label artists in this mix</p>
              <p className={styles.chips}>
                {[...rosterInMix.values()].map((a) => (
                  <Link key={a.slug} href={`/artists/${a.slug}`}>
                    {a.name}
                  </Link>
                ))}
              </p>
            </div>
          )}

          <div className={styles.card}>
            <p className={styles.label}>Spread the disease</p>
            <ShareBar url={url} title={title} />
          </div>

          <div className={styles.card}>
            <p className={styles.label}>Follow the signal</p>
            <ul className={styles.channels}>
              {CHANNELS.map((c) => (
                <li key={c.name}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer">
                    {c.name} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {isMix && (
            <Link href="/neurofunk-dnb-mixes" className={styles.allMixes}>
              All Neurobangerz mixes <span aria-hidden="true">→</span>
            </Link>
          )}
        </aside>
      </div>

      {/* ---------- prev / next ---------- */}
      {(older || newer) && (
        <nav className={styles.pager} aria-label="More posts">
          {older ? (
            <Link href={`/news/${older.slug}`} className={styles.pageLink}>
              <span className={styles.label}>← Previous</span>
              <span className={styles.pageTitle}>{plainTitle(older.title)}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/news/${newer.slug}`} className={`${styles.pageLink} ${styles.pageNext}`}>
              <span className={styles.label}>Next →</span>
              <span className={styles.pageTitle}>{plainTitle(newer.title)}</span>
            </Link>
          )}
        </nav>
      )}

      {/* ---------- related ---------- */}
      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="rel-title">
          <div className={styles.relHead}>
            <h2 id="rel-title" className={styles.h2}>
              Keep <span className={styles.outline}>reading</span>
            </h2>
            <Link href="/news" className={styles.allNews}>
              All news <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className={styles.relGrid}>
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/news/${r.slug}`} className={styles.relCard}>
                  <span className={styles.relImg}>
                    {r.coverImageUrl ? (
                      <Image src={r.coverImageUrl} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" />
                    ) : (
                      <span className={styles.relFallback} aria-hidden="true">
                        DnB
                      </span>
                    )}
                  </span>
                  <span className={styles.relMeta}>
                    {(r.categories[0] ?? 'News') + ' · '}
                    {r.publishedAt && fmtDate(r.publishedAt)}
                  </span>
                  <span className={styles.relTitle}>{plainTitle(r.title)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.news.findUnique({ where: { slug }, select: { title: true, content: true, coverImageUrl: true, publishedAt: true, updatedAt: true, categories: true } })
  if (!post) return {}
  const title = plainTitle(post.title)
  const description = excerpt(post.content) || `${title} — news from DnB Doctor, the neurofunk drum & bass label.`
  const url = `${SITE}/news/${slug}`
  const images = post.coverImageUrl ? [{ url: post.coverImageUrl, alt: title }] : [{ url: `${SITE}/news-banner.jpg`, alt: 'DnB Doctor News' }]
  return {
    title: `${title} | DnB Doctor`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'DnB Doctor',
      type: 'article',
      locale: 'en_US',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      section: post.categories[0],
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
  }
}
