'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight, FaPlay, FaSoundcloud } from 'react-icons/fa'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { plainTitle } from '@/app/components/hero/releaseMeta'
import styles from './news.module.css'
import { shortDate } from '@/app/utils/shortDate'

export type FeedPost = {
  id: string
  slug: string
  title: string
  coverImageUrl?: string | null
  publishedAt?: string | null
  categories?: string[]
  excerpt?: string | null
  video?: boolean
  audio?: boolean
}

const ALL = 'All'

const pad = (n: number) => String(n).padStart(2, '0')

const fmtDate = (iso?: string | null) => shortDate(iso)

const catsOf = (p: FeedPost) => (p.categories?.length ? p.categories : ['News'])

/** one accent per channel, cycling the brand palette */
const tone = (cat: string) => {
  const c = cat.toLowerCase()
  if (c.includes('mix')) return 'green'
  if (c.includes('growth') || c.includes('production')) return 'crimson'
  if (c.includes('press') || c.includes('release')) return 'white'
  return 'purple'
}

function Meta({ post, wide = false }: { post: FeedPost; wide?: boolean }) {
  const cat = catsOf(post)[0]
  return (
    <p className={styles.meta}>
      <span className={styles.cat} data-tone={tone(cat)}>
        {cat}
      </span>
      <time dateTime={post.publishedAt ?? undefined}>{fmtDate(post.publishedAt)}</time>
      {wide && post.video && (
        <span className={styles.media}>
          <FaPlay aria-hidden="true" /> Video
        </span>
      )}
      {wide && post.audio && (
        <span className={styles.media}>
          <FaSoundcloud aria-hidden="true" /> Audio
        </span>
      )}
    </p>
  )
}

function Cover({ post, sizes, priority = false }: { post: FeedPost; sizes: string; priority?: boolean }) {
  return post.coverImageUrl ? (
    <Image src={post.coverImageUrl} alt={post.title} fill sizes={sizes} priority={priority} />
  ) : (
    <span className={styles.noCover} aria-hidden="true">
      DnB<br />Doctor
    </span>
  )
}

export default function NewsFeed({
  posts,
  total,
  counts,
  pageSize,
}: {
  posts: FeedPost[]
  total: number
  counts: [string, number][]
  pageSize: number
}) {
  const [items, setItems] = useState(posts)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState(ALL)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const hasMore = items.length < total

  const visible = useMemo(() => (filter === ALL ? items : items.filter((p) => catsOf(p).includes(filter))), [items, filter])
  const [lead, ...others] = visible
  const pair = others.slice(0, 2)
  const log = others.slice(2)

  const mixes = counts.find(([c]) => c.toLowerCase().includes('mix'))?.[1] ?? 0

  const loadMore = async () => {
    setLoadError(false)
    setLoading(true)
    try {
      const res = await fetch(`/api/news?page=${page + 1}&limit=${pageSize}`, { cache: 'no-store' })
      const data = res.ok ? await res.json() : null
      if (!Array.isArray(data?.items)) throw new Error('bad payload')
      setItems((prev) => [
        ...prev,
        ...data.items
          .filter((p: FeedPost) => !prev.some((q) => q.id === p.id))
          .map((p: FeedPost) => ({ ...p, title: plainTitle(p.title) })),
      ])
      setPage((n) => n + 1)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <header className={styles.head}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <span aria-current="page">News</span>
          <span className={styles.crumbMeta}>
            <span className={styles.dot} aria-hidden="true" /> Live feed {'//'} 174 BPM
          </span>
        </nav>

        <h1 className={styles.title}>
          <span className={styles.outline}>Latest</span>
          <span className={styles.solid}>News</span>
        </h1>

        <div className={styles.side}>
          <p className={styles.lede}>Drum &amp; Bass · Neurofunk · Electronic Music</p>
          <dl className={styles.stats}>
            <div>
              <dt>Posts</dt>
              <dd>{pad(total)}</dd>
            </div>
            <div>
              <dt>Mixes</dt>
              <dd>{pad(mixes)}</dd>
            </div>
            <div>
              <dt>Last update</dt>
              <dd className={styles.statDate}>{fmtDate(posts[0]?.publishedAt) || '—'}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className={styles.channels} role="toolbar" aria-label="Filter news by category">
        {[[ALL, total] as [string, number], ...counts].map(([c, n]) => (
          <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)} data-tone={c === ALL ? 'green' : tone(c)}>
            {c} <span>{pad(n)}</span>
          </button>
        ))}
      </div>

      <div className={styles.feed}>
        {!lead ? (
          <p className={styles.empty}>
            Nothing on this channel yet{hasMore ? ' among loaded posts — load more below.' : '.'}
          </p>
        ) : (
          <>
            <article className={styles.lead} key={`lead-${lead.id}`}>
              <Link href={`/news/${lead.slug}`} className={styles.leadCover} tabIndex={-1} aria-hidden="true">
                <Cover post={lead} sizes="(max-width: 900px) 100vw, 58vw" priority />
                <span className={styles.flag}>{filter === ALL ? 'Latest' : 'Top'} transmission</span>
              </Link>
              <div className={styles.leadBody}>
                <Meta post={lead} wide />
                <h2 className={styles.leadTitle} data-long={lead.title.length > 40 || undefined}>
                  <Link href={`/news/${lead.slug}`}>{lead.title}</Link>
                </h2>
                {lead.excerpt && <p className={styles.excerpt}>{lead.excerpt}</p>}
                <Link href={`/news/${lead.slug}`} className={styles.read}>
                  Read more <FaArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>

            {pair.length > 0 && (
              <div className={styles.pair}>
                {pair.map((p) => (
                  <article key={p.id} className={styles.card}>
                    <div className={styles.cardCover}>
                      <Cover post={p} sizes="(max-width: 700px) 100vw, 45vw" />
                    </div>
                    <div className={styles.cardBody}>
                      <Meta post={p} wide />
                      <h3 className={styles.cardTitle}>
                        <Link href={`/news/${p.slug}`} className={styles.stretch}>
                          {p.title}
                        </Link>
                      </h3>
                      {p.excerpt && <p className={styles.cardExcerpt}>{p.excerpt}</p>}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {log.length > 0 && (
              <section aria-labelledby="archive-title">
                <h2 id="archive-title" className={styles.logHead}>
                  Archive <span>{pad(log.length)} entries</span>
                </h2>
                <ol className={styles.log}>
                  {log.map((p, i) => (
                    <li key={p.id} className={styles.row}>
                      <span className={styles.rowIndex} aria-hidden="true">
                        {pad(i + 4)}
                      </span>
                      <div className={styles.rowMain}>
                        <Meta post={p} />
                        <h3 className={styles.rowTitle}>
                          <Link href={`/news/${p.slug}`} className={styles.stretch}>
                            {p.title}
                          </Link>
                        </h3>
                        {p.excerpt && <p className={styles.rowExcerpt}>{p.excerpt}</p>}
                      </div>
                      <div className={styles.rowThumb}>
                        <Cover post={p} sizes="200px" />
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </>
        )}

        {hasMore && (
          <div className={styles.more}>
            <button type="button" onClick={loadMore} disabled={loading}>
              {loading ? 'Receiving…' : 'Load older transmissions'}
            </button>
            {loadError && <p role="alert">Failed to load — please try again.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
