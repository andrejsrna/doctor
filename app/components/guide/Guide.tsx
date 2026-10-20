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

type Recent = { slug: string; artist: string | null; title: string; cover: string | null }

async function recentReleases(take: number): Promise<Recent[]> {
  if (!process.env.DATABASE_URL) return []
  try {
    const rows = await prisma.release.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: 'desc' },
      take,
      select: { slug: true, title: true, artistName: true, coverImageUrl: true },
    })
    return rows.map((r) => {
      const { artist, title } = splitTitle(plainTitle(r.title), r.artistName)
      return { slug: r.slug, artist, title, cover: r.coverImageUrl }
    })
  } catch {
    return []
  }
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
        <Link href="/music" className={styles.all}>
          All releases →
        </Link>
      </div>
      <ul className={styles.recentList}>
        {recent.map((r) => (
          <li key={r.slug}>
            <Link href={`/music/${r.slug}`} className={styles.release}>
              <span className={styles.cover}>
                {r.cover && <Image src={r.cover} alt="" fill sizes="(max-width: 960px) 45vw, 22vw" />}
              </span>
              {r.artist && <span className={styles.rArtist}>{r.artist}</span>}
              <span className={styles.rTitle}>{r.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
