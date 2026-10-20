import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { plainTitle, splitTitle } from '@/app/components/hero/releaseMeta'
import NewsletterForm from './NewsletterForm'
import styles from './newsletter.module.css'

export const revalidate = 600

const PERKS = [
  { title: 'Free track on sign-up', text: 'New subscribers get a free WAV download straight to their inbox.' },
  { title: 'Releases first', text: 'Hear about new DnB Doctor releases before the algorithm does.' },
  { title: 'Exclusive content', text: 'Mixes, NEUROBANGERZ sessions, sample packs and label drops.' },
  { title: 'Label announcements', text: 'Demo calls, events and news from the lab — no noise, no spam.' },
]

type Recent = { slug: string; artist: string | null; title: string; cover: string | null; date: string | null }

async function recentReleases(): Promise<Recent[]> {
  if (!process.env.DATABASE_URL) return []
  try {
    const rows = await prisma.release.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: 'desc' },
      take: 4,
      select: { slug: true, title: true, artistName: true, coverImageUrl: true, publishedAt: true },
    })
    return rows.map((r) => {
      const { artist, title } = splitTitle(plainTitle(r.title), r.artistName)
      return { slug: r.slug, artist, title, cover: r.coverImageUrl, date: r.publishedAt?.toISOString() ?? null }
    })
  } catch {
    return []
  }
}

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : ''

export default async function NewsletterPage() {
  const recent = await recentReleases()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'DnB Doctor Newsletter',
    url: 'https://dnbdoctor.com/newsletter',
    description: 'Subscribe to the DnB Doctor newsletter for new neurofunk releases, exclusive content and label announcements.',
    publisher: { '@type': 'Organization', name: 'DnB Doctor', url: 'https://dnbdoctor.com', logo: 'https://dnbdoctor.com/logo-1.png' },
    potentialAction: {
      '@type': 'SubscribeAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://dnbdoctor.com/newsletter' },
    },
  }

  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={styles.backdrop} aria-hidden="true">
        <Image src="/newsletter1.jpeg" alt="" fill sizes="100vw" priority />
      </div>

      <section className={styles.hero}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <span aria-current="page">Newsletter</span>
          <span className={styles.crumbMeta}>
            <span className={styles.dot} aria-hidden="true" /> Direct line {'//'} 174 BPM
          </span>
        </nav>

        <div className={styles.intro}>
          <h1 className={styles.title}>
            <span className={styles.outline}>Spread the</span>
            <span className={styles.solid}>Infection</span>
          </h1>
          <p className={styles.lede}>
            Join our growing horde of bass cultists. Get infected with exclusive releases, mutated content, and viral
            announcements from the DnB Doctor&apos;s laboratory.
          </p>
          <p className={styles.gift}>
            <span className={styles.giftTag}>Free</span>
            <span>
              Sign up and get <strong>YEHOR — Hold Me (Original Mix)</strong> as a WAV download.
            </span>
          </p>
        </div>

        <div className={styles.panel}>
          <p className={styles.panelHead}>
            <span>Infection protocol</span>
            <span>01 field · 01 consent</span>
          </p>
          <NewsletterForm />
          <p className={styles.unsub}>
            Had enough? <Link href="/unsub">Unsubscribe</Link> anytime.
          </p>
        </div>
      </section>

      <section className={styles.perks} aria-labelledby="perks-title">
        <h2 id="perks-title" className={styles.label}>
          What you receive
        </h2>
        <ol className={styles.perkList}>
          {PERKS.map((p) => (
            <li key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {recent.length > 0 && (
        <section className={styles.recent} aria-labelledby="recent-title">
          <div className={styles.recentHead}>
            <h2 id="recent-title" className={styles.label}>
              Last transmissions
            </h2>
            <p>Subscribers heard about these first.</p>
            <Link href="/music" className={styles.all}>
              All releases →
            </Link>
          </div>
          <ul className={styles.recentList}>
            {recent.map((r) => (
              <li key={r.slug}>
                <Link href={`/music/${r.slug}`} className={styles.release}>
                  <span className={styles.cover}>
                    {r.cover && <Image src={r.cover} alt="" fill sizes="(max-width: 700px) 45vw, 22vw" />}
                  </span>
                  <span className={styles.meta}>{fmt(r.date)}</span>
                  {r.artist && <span className={styles.artist}>{r.artist}</span>}
                  <span className={styles.track}>{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Newsletter | DnB Doctor - Stay Updated',
  description:
    'Subscribe to DnB Doctor newsletter and stay up to date with our latest releases, exclusive content, and special announcements in the world of neurofunk and drum & bass.',
  keywords: 'dnb newsletter, neurofunk updates, drum and bass news, electronic music newsletter, dnb doctor subscription',
  alternates: { canonical: 'https://dnbdoctor.com/newsletter' },
  openGraph: {
    title: 'Subscribe to DnB Doctor Newsletter',
    description:
      'Get the latest neurofunk and drum & bass updates directly to your inbox. Exclusive content and special announcements from DnB Doctor.',
    url: 'https://dnbdoctor.com/newsletter',
    siteName: 'DnB Doctor',
    images: [{ url: 'https://dnbdoctor.com/newsletter.jpeg', width: 1200, height: 630, alt: 'DnB Doctor Newsletter Subscription' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join DnB Doctor Newsletter',
    description: 'Subscribe for exclusive updates and content from DnB Doctor.',
    images: ['https://dnbdoctor.com/newsletter.jpeg'],
  },
}
