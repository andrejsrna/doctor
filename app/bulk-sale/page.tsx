import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { plainTitle, splitTitle } from '@/app/components/hero/releaseMeta'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import BandcampLink from './BandcampLink'
import styles from './bulk.module.css'

export const revalidate = 3600

const SITE = 'https://dnbdoctor.com'
/** The discography bundle is offered on every Bandcamp item page; this one is the long-standing link. */
const BANDCAMP = 'https://dnbdoctor.bandcamp.com/track/asana-neurofunk-code'
const DISCOUNT = 35

type Offer = { size: number; price: number; currency: string; discount: number }

/** Live bundle size and minimum price from Bandcamp's own JSON-LD; null if Bandcamp is unreachable or changes shape. */
async function bandcampOffer(): Promise<Offer | null> {
  try {
    const res = await fetch(BANDCAMP, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
      headers: { 'user-agent': 'Mozilla/5.0 (DnB Doctor site)' },
    })
    if (!res.ok) return null
    const html = await res.text()
    for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      const offers: unknown[] = []
      const walk = (v: unknown) => {
        if (Array.isArray(v)) v.forEach(walk)
        else if (v && typeof v === 'object') {
          const o = v as Record<string, unknown>
          if (o['@type'] === 'Offer') offers.push(o)
          Object.values(o).forEach(walk)
        }
      }
      walk(JSON.parse(m[1]))
      for (const raw of offers) {
        const o = raw as { price?: number; priceCurrency?: string; additionalProperty?: { name: string; value: number }[] }
        const prop = (k: string) => o.additionalProperty?.find((p) => p.name === k)?.value
        const size = prop('bundle_size')
        const discount = prop('discount')
        if (size && discount && o.price && o.priceCurrency) return { size, discount, price: o.price, currency: o.priceCurrency }
      }
    }
  } catch {
    /* fall back to the static copy */
  }
  return null
}

async function covers() {
  if (!process.env.DATABASE_URL) return { list: [], total: 0 }
  try {
    const [list, total] = await Promise.all([
      prisma.release.findMany({
        where: { coverImageUrl: { not: null } },
        orderBy: { publishedAt: 'desc' },
        take: 18,
        select: { slug: true, title: true, coverImageUrl: true },
      }),
      prisma.release.count(),
    ])
    return { list, total }
  } catch {
    return { list: [], total: 0 }
  }
}

const money = (n: number, currency: string) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

export const metadata: Metadata = {
  title: 'Bulk Sale — Entire Discography 35% Off | DnB Doctor',
  description:
    'Buy the entire DnB Doctor back-catalogue on Bandcamp with a permanent 35% discount: every neurofunk and drum & bass release in one purchase, re-downloadable anytime.',
  alternates: { canonical: `${SITE}/bulk-sale` },
  openGraph: {
    title: 'DnB Doctor Bulk Sale — Entire Discography 35% Off',
    description: 'Every DnB Doctor release in one Bandcamp purchase, with a permanent 35% discount.',
    url: `${SITE}/bulk-sale`,
    siteName: 'DnB Doctor',
    type: 'website',
    locale: 'en_US',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'DnB Doctor' }],
  },
  twitter: { card: 'summary_large_image', images: [`${SITE}/og-image.jpg`] },
}

export default async function BulkSalePage() {
  const [offer, { list, total }] = await Promise.all([bandcampOffer(), covers()])
  const size = offer?.size ?? total
  const discount = offer ? Math.round(offer.discount * 100) : DISCOUNT
  const full = offer ? offer.price / (1 - offer.discount) : null
  const perRelease = offer ? offer.price / offer.size : null
  const shown = list.slice(0, 11)
  const rest = size - shown.length

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'DnB Doctor Bulk Sale',
      url: `${SITE}/bulk-sale`,
      description: `The entire DnB Doctor discography on Bandcamp with a permanent ${discount}% discount.`,
      ...(offer && {
        mainEntity: {
          '@type': 'Offer',
          name: `DnB Doctor full digital discography (${offer.size} releases)`,
          url: BANDCAMP,
          price: offer.price.toFixed(2),
          priceCurrency: offer.currency,
          availability: 'https://schema.org/OnlineOnly',
          seller: { '@type': 'Organization', name: 'DnB Doctor', url: SITE },
        },
      }),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'DnB Doctor', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Bulk Sale', item: `${SITE}/bulk-sale` },
      ],
    },
  ]

  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- hero ---------- */}
      <header className={styles.hero}>
        {list.length > 0 && (
          <div className={styles.wall} aria-hidden="true">
            {list.map((r, i) => (
              <span key={r.slug} style={{ '--i': i } as React.CSSProperties}>
                <Image src={r.coverImageUrl!} alt="" fill sizes="(max-width: 960px) 25vw, 12vw" />
              </span>
            ))}
          </div>
        )}

        <div className={styles.heroInner}>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> Special offer // Bandcamp
          </p>
          <h1 className={styles.title}>
            <span className={styles.titleSmall}>Bulk Sale</span>
            <span className={styles.outline}>The whole</span>
            <span>discography.</span>
          </h1>
          <p className={styles.lede}>Get our entire discography with a permanent {discount}% discount.</p>

          <div className={styles.deal}>
            <span className={styles.stamp}>
              −{discount}
              <small>%</small>
            </span>
            <dl className={styles.stats}>
              {size > 0 && (
                <div>
                  <dt>Releases in the bundle</dt>
                  <dd>{size}</dd>
                </div>
              )}
              {offer && (
                <div>
                  <dt>Minimum price</dt>
                  <dd>
                    {full && <s>{money(full, offer.currency)}</s>}
                    {money(offer.price, offer.currency)}
                  </dd>
                </div>
              )}
              {perRelease && offer && (
                <div>
                  <dt>Per release</dt>
                  <dd>≈ {money(perRelease, offer.currency)}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className={styles.actions}>
            <BandcampLink href={BANDCAMP} className={styles.primary} place="hero">
              Visit our Bandcamp <span aria-hidden="true">↗</span>
            </BandcampLink>
            <a href="#how" className={styles.textLink}>
              How it works ↓
            </a>
          </div>
          {offer && <p className={styles.note}>Live from Bandcamp · minimum price grows as new releases join the bundle</p>}
        </div>
      </header>

      {/* ---------- steps ---------- */}
      <section id="how" className={styles.section} aria-labelledby="how-title">
        <div className={styles.sideHead}>
          <p className={styles.label}>01 / How it works</p>
          <h2 id="how-title" className={styles.h2}>
            Three <span className={styles.outline}>steps</span>
          </h2>
          <p className={styles.muted}>
            You can buy our entire back-catalogue (discography) with permanent {discount}% discount. To use this special offer, follow these steps:
          </p>
        </div>

        <ol className={styles.steps}>
          <li>
            <span className={styles.num} aria-hidden="true">
              01
            </span>
            <div>
              <h3>Open Bandcamp</h3>
              <p>Click on the following link. This link will redirect you on our Bandcamp page, where the offer for bulk discount is located.</p>
              <BandcampLink href={BANDCAMP} className={styles.secondary} place="step">
                Visit our Bandcamp <span aria-hidden="true">↗</span>
              </BandcampLink>
            </div>
          </li>
          <li>
            <span className={styles.num} aria-hidden="true">
              02
            </span>
            <div>
              <h3>Buy Digital Discography</h3>
              <p>
                Click on <q>Buy Digital Discography</q>. It will open a new popup.
              </p>
            </div>
          </li>
          <li>
            <span className={styles.num} aria-hidden="true">
              03
            </span>
            <div>
              <h3>Name your price &amp; checkout</h3>
              <p>
                In the popup that opens, write the minimum price (or more if you want!), and click checkout. Then follow the classic Bandcamp checkout
                process and after purchasing the items, you will find them in your Bandcamp collection. You can redownload the files anytime you want!
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* ---------- inside ---------- */}
      {shown.length > 0 && (
        <section className={styles.block} aria-labelledby="inside-title">
          <div className={styles.rowHead}>
            <div>
              <p className={styles.label}>02 / What&apos;s inside</p>
              <h2 id="inside-title" className={styles.h2}>
                Latest <span className={styles.outline}>transmissions</span>
              </h2>
            </div>
            <Link href="/music" className={styles.textLink}>
              Browse all releases →
            </Link>
          </div>
          <ul className={styles.grid}>
            {shown.map((r) => {
              const { artist, title } = splitTitle(plainTitle(r.title), null)
              return (
                <li key={r.slug}>
                  <Link href={`/music/${r.slug}`} className={styles.card}>
                    <span className={styles.cover}>
                      <Image src={r.coverImageUrl!} alt="" fill sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 16vw" />
                    </span>
                    <span className={styles.cardTitle}>{title}</span>
                    {artist && <span className={styles.cardArtist}>{artist}</span>}
                  </Link>
                </li>
              )
            })}
            {rest > 0 && (
              <li>
                <BandcampLink href={BANDCAMP} className={styles.more} place="grid">
                  <span className={styles.moreNum}>+{rest}</span>
                  <span>more in the bundle</span>
                </BandcampLink>
              </li>
            )}
          </ul>
        </section>
      )}

      {/* ---------- final cta ---------- */}
      <section className={styles.final} aria-labelledby="final-title">
        <h2 id="final-title" className={styles.h2}>
          One purchase. <span className={styles.accent}>Every release.</span>
        </h2>
        <BandcampLink href={BANDCAMP} className={styles.primary} place="footer">
          Get the discography −{discount}% <span aria-hidden="true">↗</span>
        </BandcampLink>
      </section>
    </div>
  )
}
