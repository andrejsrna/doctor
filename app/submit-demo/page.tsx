import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import DemoForm from './DemoForm'
import styles from './submit-demo.module.css'

export const revalidate = 3600

const FOUNDED = 2015

const GUIDELINES = [
  {
    title: 'Exclusive content',
    text: "Please make sure the track hasn't been made public anywhere yet. We're looking for fresh, unreleased material.",
  },
  {
    title: 'Download access',
    text: 'Check if the download option is enabled on your track. This helps us review and process your submission efficiently.',
  },
  {
    title: 'Valid contact',
    text: "Make sure you supply us with a valid e-mail address. We'll use this to contact you about your submission.",
  },
]

const FAQ = [
  {
    q: 'How does a release with DnB Doctor usually work?',
    a: 'If we feel the track fits the label, we talk through the release plan, assets, loudness target, promotion and timeline with you directly. We try to keep the process clear and practical: good audio, proper presentation, and steady communication before the release goes live.',
  },
  {
    q: 'Do you pay artists?',
    a: 'Yes. We usually offer a fixed fee per accepted track. The fee is set individually for each release based on the artist, current statistics, audience size, track potential and the scope of the campaign. If a track performs exceptionally well, we are open to paying an extra bonus.',
  },
  {
    q: 'Why fixed fees instead of normal royalties?',
    a: 'Streaming income in underground drum and bass is honestly very small. In reality, we still lose money on most releases because promotion, distribution, design and time cost more than the track earns back. The fixed fee is our way to give artists at least some motivating cash upfront, while many labels pay no royalties at all.',
  },
  {
    q: 'How loud should the final master be?',
    a: 'We care a lot about volume and punch. For our sound, releases usually need to feel club-ready and aggressive, often around -4 to -3 LUFS when the mix can handle it without falling apart. Loudness is not the only thing that matters, but the track has to hit hard.',
  },
  {
    q: 'Why is DnB Doctor added as a collaborating artist?',
    a: 'On selected releases we add the DnB Doctor artist profile as a collaborator to help boost algorithmic reach and connect the track with the label audience. It can help with discovery, playlist signals, release radar behaviour and overall visibility around the campaign.',
  },
  {
    q: 'Can artists trust the label?',
    a: 'We work with artists who keep coming back for more releases, and we care about long-term relationships more than one-off uploads. We are direct about the numbers, what we can realistically do, and where the release stands. If something needs more work, we say it clearly.',
  },
]

async function labelStats() {
  if (!process.env.DATABASE_URL) return null
  try {
    const [releases, artists] = await Promise.all([prisma.release.count(), prisma.artist.count()])
    return { releases, artists }
  } catch {
    return null
  }
}

/** 143 → "140+": a floor that stays true until the next ten. */
const floor10 = (n: number) => `${Math.floor(n / 10) * 10}+`

export default async function SubmitDemoPage() {
  const stats = await labelStats()
  const years = new Date().getUTCFullYear() - FOUNDED

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Submit your demo to DnB Doctor',
      url: 'https://dnbdoctor.com/submit-demo',
      publisher: {
        '@type': 'Organization',
        name: 'DnB Doctor',
        url: 'https://dnbdoctor.com',
        logo: 'https://dnbdoctor.com/logo-1.png',
        contactPoint: { '@type': 'ContactPoint', contactType: 'demo submission', url: 'https://dnbdoctor.com/submit-demo' },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- hero ---------- */}
      <header className={styles.hero}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <span aria-current="page">Submit demo</span>
          <span className={styles.crumbMeta}>
            <span className={styles.dot} aria-hidden="true" /> A&amp;R inbox {'//'} open
          </span>
        </nav>

        <h1 className={styles.title}>
          <span className={styles.outline}>Submit</span>
          <span className={styles.solid}>your demo.</span>
        </h1>

        <div className={styles.heroSide}>
          <p className={styles.lede}>
            Unreleased neurofunk, techstep, dark DnB or crossbreed that hits hard? Send us a private SoundCloud link —
            we listen to every submission.
          </p>
          <dl className={styles.facts}>
            {stats && (
              <>
                <div>
                  <dt>Releases</dt>
                  <dd>{floor10(stats.releases)}</dd>
                </div>
                <div>
                  <dt>Artists</dt>
                  <dd>{floor10(stats.artists)}</dd>
                </div>
              </>
            )}
            <div>
              <dt>Years</dt>
              <dd>{years}</dd>
            </div>
          </dl>
          <a href="#demo-form" className={styles.jump}>
            Go to the form <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>

      {/* ---------- guidelines + form ---------- */}
      <section className={styles.protocol} aria-labelledby="guidelines-title">
        <div className={styles.guide}>
          <h2 id="guidelines-title" className={styles.label}>
            01 / Submission guidelines
          </h2>
          <ol className={styles.checks}>
            {GUIDELINES.map((g) => (
              <li key={g.title}>
                <h3>{g.title}</h3>
                <p>{g.text}</p>
              </li>
            ))}
          </ol>
          <p className={styles.guideMore}>
            Full checklist: <Link href="/guidelines">submission guidelines</Link>
          </p>
        </div>

        <div className={styles.panel} id="demo-form">
          <p className={styles.panelHead}>
            <span>Demo transmission</span>
            <span>4 fields · 2 checks</span>
          </p>
          <DemoForm siteKey={process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY ?? ''} />
        </div>
      </section>

      {/* ---------- faq ---------- */}
      <section className={styles.faq} aria-labelledby="faq-title">
        <div className={styles.faqHead}>
          <p className={styles.label}>02 / Artist collaboration FAQ</p>
          <h2 id="faq-title" className={styles.h2}>
            What happens after we <span className={styles.accent}>like your demo?</span>
          </h2>
          <p className={styles.faqLede}>
            We want artists to know the deal before sending music. Here is how we think about fees, mastering loudness,
            algorithm support and long-term label cooperation.
          </p>
        </div>
        <div className={styles.faqList}>
          {FAQ.map((f, i) => (
            <details key={f.q} className={styles.qa} open={i === 0}>
              <summary>
                <span className={styles.qn}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{f.q}</h3>
                <span className={styles.toggle} aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- outro ---------- */}
      <section className={styles.outro} aria-labelledby="outro-title">
        <p className={styles.label}>03 / Not ready yet?</p>
        <h2 id="outro-title" className={styles.h2}>
          Sharpen the <span className={styles.accent}>weapon.</span>
        </h2>
        <ul className={styles.next}>
          <li>
            <Link href="/how-to-produce-neurofunk">
              <span>Guide</span> How to make neurofunk <span aria-hidden="true">→</span>
            </Link>
          </li>
          <li>
            <Link href="/sample-packs">
              <span>Sounds</span> Sample packs <span aria-hidden="true">→</span>
            </Link>
          </li>
          <li>
            <Link href="/music">
              <span>Reference</span> Hear the label sound <span aria-hidden="true">→</span>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Submit Demo | DnB Doctor - Neurofunk Label',
  description:
    "Submit your drum and bass demo to DnB Doctor. We're always looking for fresh neurofunk talent — read the guidelines, fees and mastering FAQ, then send a private SoundCloud link.",
  keywords: 'submit demo, demo submission, drum and bass demos, neurofunk producer, dnb label submission, electronic music demo',
  alternates: { canonical: 'https://dnbdoctor.com/submit-demo' },
  openGraph: {
    title: 'Submit Your Demo | DnB Doctor',
    description: 'Share your unreleased neurofunk with us. We listen to every submission.',
    url: 'https://dnbdoctor.com/submit-demo',
    siteName: 'DnB Doctor',
    images: [{ url: 'https://dnbdoctor.com/submitdemo.jpeg', width: 1200, height: 630, alt: 'Submit Demo to DnB Doctor' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Submit Your Demo | DnB Doctor',
    description: 'Looking for a home for your neurofunk tracks? Submit your demo to DnB Doctor today.',
    images: ['https://dnbdoctor.com/submitdemo.jpeg'],
  },
}
