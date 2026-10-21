import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideFaq, GuideSection as Section, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import styles from '@/app/components/guide/guide.module.css'
import { djLinks, producerLinks, withBeatportAffiliate } from '@/lib/affiliates'

const URL = 'https://dnbdoctor.com/recommended-tools'
const TITLE = 'Recommended Tools for DnB DJs & Producers'
const DESCRIPTION =
  'Where DnB Doctor buys music and sounds: Beatport and DJCity for DJs, Plugin Boutique, Loopcloud and Loopmasters for drum & bass producers — plus free resources.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: `${TITLE} | DnB Doctor`,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'Recommended tools for DnB DJs and producers' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/og-image.jpg'] },
}

const BEATPORT_LABEL = withBeatportAffiliate('https://www.beatport.com/label/dnb-doctor/75618')!

/** How you pay — keeps the tiles honest about what you get. */
const MODEL: Record<string, string> = {
  Beatport: 'Buy per track',
  DJCity: 'Monthly subscription',
  'Plugin Boutique': 'Buy per plugin',
  Loopcloud: 'Subscription',
  Loopmasters: 'Buy per pack',
}

const TOC = [
  ['#djs', 'For DJs'],
  ['#producers', 'For producers'],
  ['#free', 'Free from DnB Doctor'],
  ['#faq', 'FAQ'],
] as const

const FREE = [
  ['/sample-packs', 'Sample packs', 'A free neurofunk sample pack plus artist packs: bass loops, drums, one-shots, Serum presets.'],
  ['/how-to-produce-neurofunk', 'Production guide', 'Step by step: drums, reese bass, resampling, arrangement and mixdown.'],
  ['/neurofunk-spotify', 'Spotify playlists', 'Our monthly neurofunk selection — reference tracks for your mixdown.'],
  ['/neurofunk-dnb-mixes', 'DJ mixes', 'Neurofunk mixes from the label and the roster.'],
] as const

const FAQ = [
  {
    question: 'Are these affiliate links?',
    answer:
      'Yes. If you buy through them, DnB Doctor may earn a small commission at no extra cost to you. It helps keep the label and the free resources on this site running.',
  },
  {
    question: 'Beatport or a record pool — what should a DJ use?',
    answer:
      'Beatport sells single tracks you keep forever, which suits a focused drum & bass collection. A record pool like DJCity is a monthly subscription with unlimited downloads from its catalogue — worth it if you play a lot of different music.',
  },
  {
    question: 'Where can I buy neurofunk samples?',
    answer:
      'Loopmasters sells complete sample packs you own after purchase, Loopcloud gives you access to a large library on subscription, and DnB Doctor has a free neurofunk sample pack plus artist packs on the sample packs page.',
  },
  {
    question: 'Where can I buy DnB Doctor releases?',
    answer: 'All DnB Doctor releases are on Beatport, on our label page, and on every major streaming service.',
  },
]

function ToolTiles({ links }: { links: typeof djLinks }) {
  return (
    <ul className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))' }}>
      {links.map((l) => (
        <li key={l.name}>
          <a href={l.url} target="_blank" rel="noopener noreferrer sponsored">
            <span className={styles.tileTag}>
              {l.tagline} · {MODEL[l.name]}
            </span>
            <h3>{l.name} ↗</h3>
            <p>{l.description}</p>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function RecommendedToolsPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: TITLE,
      description: DESCRIPTION,
      url: URL,
      dateModified: '2026-10-21',
      publisher: PUBLISHER,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
        { '@type': 'ListItem', position: 2, name: 'Recommended tools', item: URL },
      ],
    },
    faqJsonLd(FAQ),
  ]

  return (
    <article className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={styles.backdrop} aria-hidden="true">
        <Image src="/music-bg.jpeg" alt="" fill sizes="100vw" priority />
      </div>

      <header className={`${styles.wrap} ${styles.hero}`}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <span aria-current="page">Recommended tools</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> Toolbox {'//'} DJs &amp; producers
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>Recommended</span>
            <span className={styles.solid}>tools</span>
          </h1>
          <p className={styles.lede}>
            Our hand-picked selection of the best platforms for DJing and music production — where to buy{' '}
            <Link href="/neurofunk-dnb">neurofunk</Link> tracks, plugins and samples.
          </p>
          <ul className={styles.toc} aria-label="On this page">
            {TOC.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        <aside className={styles.answer} aria-labelledby="quick-answer">
          <p className={styles.answerHead}>
            <span id="quick-answer">Quick picks</span>
            <span>5 platforms</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Buy tracks</dt>
              <dd>
                Beatport<small>DJ downloads, per track</small>
              </dd>
            </div>
            <div>
              <dt>Record pool</dt>
              <dd>
                DJCity<small>monthly subscription</small>
              </dd>
            </div>
            <div>
              <dt>Plugins</dt>
              <dd>
                Plugin Boutique<small>VSTs, DAWs, deals</small>
              </dd>
            </div>
            <div>
              <dt>Samples</dt>
              <dd>
                Loopmasters<small>or Loopcloud on subscription</small>
              </dd>
            </div>
          </dl>
        </aside>
      </header>

      <Section id="djs" n="01" label="DJs">
        <h2 className={styles.h2}>
          For <em>DJs</em>
        </h2>
        <p>
          Whether you&apos;re playing clubs or festivals, these platforms give you access to the latest tracks, exclusive
          edits, and essential DJ tools.
        </p>
        <ToolTiles links={djLinks} />
        <p className={styles.note}>
          Looking for our releases? Find the whole catalogue on{' '}
          <a href={BEATPORT_LABEL} target="_blank" rel="noopener noreferrer sponsored">
            DnB Doctor on Beatport
          </a>{' '}
          or browse it <Link href="/music">here</Link>.
        </p>
      </Section>

      <Section id="producers" n="02" label="Producers">
        <h2 className={styles.h2}>
          For <em data-tone="purple">producers</em>
        </h2>
        <p>
          From VST plugins to sample packs — everything you need to craft neurofunk basslines, complex drums, and dark
          atmospheres. New to the genre? Start with <Link href="/how-to-produce-neurofunk">how to make neurofunk</Link>.
        </p>
        <ToolTiles links={producerLinks} />
        <p className={styles.note}>
          Finished a track? Check the <Link href="/guidelines">producer guidelines</Link> and{' '}
          <Link href="/submit-demo">submit your demo</Link>.
        </p>
      </Section>

      <Section id="free" n="03" label="Free">
        <h2 className={styles.h2}>
          Free from <em>DnB Doctor</em>
        </h2>
        {/* 4 tiles: 18rem min keeps it 2×2 on desktop, never 3+1 */}
        <ul className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
          {FREE.map(([href, name, text]) => (
            <li key={href}>
              <Link href={href}>
                <h3>{name} →</h3>
                <p>{text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" n="04" label="FAQ">
        <h2 className={styles.h2}>FAQ</h2>
        <GuideFaq items={FAQ} />
      </Section>

      <section className={`${styles.wrap} ${styles.closing}`}>
        <blockquote>
          “Good tools help. <span>Ideas finish tracks.</span>”
        </blockquote>
        <cite>— DnB Doctor</cite>
      </section>
    </article>
  )
}
