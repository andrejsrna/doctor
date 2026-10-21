import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { plainTitle, splitTitle } from '@/app/components/hero/releaseMeta'
import styles from './guide.module.css'

/** Shared building blocks for the educational guide pages. */

export function GuideSection({
  id,
  n,
  label,
  children,
}: {
  id?: string
  n: string
  label: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={`${styles.wrap} ${styles.section}`}>
      <p className={styles.sideLabel} aria-hidden="true">
        <b>{n}</b>
        {label}
      </p>
      <div className={styles.body}>{children}</div>
    </section>
  )
}

export function GuideFaq({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className={styles.faq}>
      {items.map((f, i) => (
        <details key={f.question} open={i === 0}>
          <summary>{f.question}</summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </div>
  )
}

export const faqJsonLd = (items: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
})

export const PUBLISHER = {
  '@type': 'Organization',
  name: 'DnB Doctor',
  url: 'https://dnbdoctor.com',
  logo: { '@type': 'ImageObject', url: 'https://dnbdoctor.com/brand/dnb-doctor-logo.webp' },
}

type Credit = { name: string; slug: string | null }
type Recent = { slug: string; credits: Credit[]; title: string; cover: string | null }

/** "A & B feat. C" → separate names, each linked to its roster page when the act is on the label. */
const SPLIT = /\s*(?:,|&|\+|\bx\b|\bfeat\.?|\bft\.?|\bvs\.?|\band\b)\s*/i
function credits(artist: string | null, roster: Map<string, string>): Credit[] {
  if (!artist) return []
  return artist
    .split(SPLIT)
    .map((n) => n.trim())
    .filter(Boolean)
    .map((name) => ({ name, slug: roster.get(name.toLowerCase()) ?? null }))
}

async function recentReleases(take: number): Promise<Recent[]> {
  if (!process.env.DATABASE_URL) return []
  try {
    const [rows, artists] = await Promise.all([
      prisma.release.findMany({
        where: { publishedAt: { not: null } },
        orderBy: { publishedAt: 'desc' },
        take,
        select: { slug: true, title: true, artistName: true, coverImageUrl: true },
      }),
      prisma.artist.findMany({ select: { name: true, slug: true } }),
    ])
    const roster = new Map(artists.map((a) => [a.name.toLowerCase(), a.slug]))
    return rows.map((r) => {
      const { artist, title } = splitTitle(plainTitle(r.title), r.artistName)
      return { slug: r.slug, credits: credits(artist, roster), title, cover: r.coverImageUrl }
    })
  } catch {
    return []
  }
}

/** Roster acts with the most label releases, as links to their artist pages. */
export async function GuideRoster({ take = 12 }: { take?: number }) {
  if (!process.env.DATABASE_URL) return null
  let top: { name: string; slug: string; n: number }[] = []
  try {
    const [rows, artists] = await Promise.all([
      prisma.release.findMany({ where: { publishedAt: { not: null } }, select: { title: true, artistName: true } }),
      prisma.artist.findMany({ select: { name: true, slug: true } }),
    ])
    const roster = new Map(artists.map((a) => [a.name.toLowerCase(), a]))
    const count = new Map<string, number>()
    for (const r of rows) {
      const { artist } = splitTitle(plainTitle(r.title), r.artistName)
      for (const c of new Set(credits(artist, new Map()).map((c) => c.name.toLowerCase()))) {
        if (roster.has(c)) count.set(c, (count.get(c) ?? 0) + 1)
      }
    }
    top = [...count]
      .sort((a, b) => b[1] - a[1])
      .slice(0, take)
      .map(([k, n]) => ({ ...roster.get(k)!, n }))
  } catch {
    return null
  }
  if (top.length === 0) return null
  return (
    <ul className={styles.chips} aria-label="DnB Doctor roster artists">
      {top.map((a) => (
        <li key={a.slug}>
          <Link href={`/artists/${a.slug}`}>{a.name}</Link>
        </li>
      ))}
    </ul>
  )
}

/** "Hear it now" strip with the latest label releases (server-rendered links). */
export async function GuideReleases({ heading = 'Hear it', accent = 'now', text }: { heading?: string; accent?: string; text: string }) {
  const recent = await recentReleases(4)
  if (recent.length === 0) return null
  return (
    <section className={`${styles.wrap} ${styles.recent}`} aria-labelledby="recent-title">
      <div className={styles.recentHead}>
        <div>
          <h2 id="recent-title" className={styles.h2} style={{ marginBottom: 0 }}>
            {heading} <em>{accent}</em>
          </h2>
          <p>{text}</p>
        </div>
        <span className={styles.allLinks}>
          <Link href="/music" className={styles.all}>
            All releases →
          </Link>
          <Link href="/artists" className={styles.all}>
            All artists →
          </Link>
        </span>
      </div>
      <ul className={styles.recentList}>
        {recent.map((r) => (
          <li key={r.slug} className={styles.release}>
            <Link href={`/music/${r.slug}`} className={styles.cover} tabIndex={-1} aria-hidden="true">
              {r.cover && <Image src={r.cover} alt="" fill sizes="(max-width: 960px) 45vw, 22vw" />}
            </Link>
            {r.credits.length > 0 && (
              <span className={styles.rArtist}>
                {r.credits.map((c, i) => (
                  <span key={c.name}>
                    {i > 0 && ' · '}
                    {c.slug ? <Link href={`/artists/${c.slug}`}>{c.name}</Link> : c.name}
                  </span>
                ))}
              </span>
            )}
            <Link href={`/music/${r.slug}`} className={styles.rTitle}>
              {r.title}
            </Link>
          </li>
        ))}
      </ul>
      <p className={styles.newsletter}>
        <span>New neurofunk every month.</span> <Link href="/newsletter">Join the newsletter</Link> — releases first, plus a free WAV
        on sign-up.
      </p>
    </section>
  )
}
