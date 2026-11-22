import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideFaq, GuideSection as Section, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import PatternPlayer, { type Pattern } from '@/app/components/guide/PatternPlayer'
import styles from '@/app/components/guide/guide.module.css'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/dnb-drum-patterns'
const TITLE = 'DnB Drum Patterns: Two-Step, Rollers, Halftime & Amen (Interactive)'
const DESCRIPTION =
  'Drum and bass drum patterns on a playable 16-step grid: the two-step beat, rolling ghost-note grooves, halftime and the Amen break at 174 BPM. Where kick and snare go, plus DnB track structure.'

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | DnB Doctor` },
  description: DESCRIPTION,
  keywords:
    'dnb drum patterns, drum and bass drum patterns, dnb drum pattern, drum and bass beat pattern, two step dnb, amen break pattern, halftime dnb drums, dnb structure, drum and bass time signature',
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'DnB drum patterns' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/og-image.jpg'] },
}

/* 16 steps = 1 bar of 4/4, counted from 0 (step 0 = beat 1, 4 = beat 2, 8 = beat 3, 12 = beat 4) */
const EIGHTHS = [0, 2, 4, 6, 8, 10, 12, 14]
const P: Record<string, Pattern> = {
  twoStep: { kick: [0, 10], snare: [4, 12], hat: EIGHTHS },
  rollers: { kick: [0, 10], snare: [4, 12], ghost: [7, 9, 15], hat: [...EIGHTHS, 3, 11] },
  halftime: { kick: [0, 11], snare: [8], hat: EIGHTHS },
  amen: { kick: [0, 2, 10, 11], snare: [4, 12], ghost: [7, 9, 15], hat: EIGHTHS },
}

const TOC = [
  ['#basics', 'How to read the grid'],
  ['#two-step', 'Two-step'],
  ['#rollers', 'Rollers'],
  ['#halftime', 'Halftime'],
  ['#amen', 'Amen break'],
  ['#structure', 'Track structure'],
  ['#faq', 'FAQ'],
] as const

const STRUCTURE = [
  ['Intro', '16–32 bars', 'Drums and atmosphere only, so DJs can mix in'],
  ['Build-up', '8–16 bars', 'Risers, filtered bass, a tease of the hook'],
  ['Drop 1', '32 bars', 'Full drums and main bass'],
  ['Breakdown', '16–32 bars', 'Drums out or thinned, melody or atmosphere'],
  ['Drop 2', '32 bars', 'Same energy with a new bass variation'],
  ['Outro', '16–32 bars', 'Stripped back again for the next mix'],
] as const

const TIPS = [
  ['Layer the snare', 'One sample for body, one for crack — the snare is the loudest thing in the groove.'],
  ['Ghost notes are quiet', 'Keep ghost snares far below the main snare or the backbeat gets lost.'],
  ['Vary every 4–8 bars', 'Small fills, an extra kick or a dropped hat keep a 32-bar section alive.'],
  ['Shuffle the hats', 'A touch of swing or velocity variation on the hats stops the loop sounding robotic.'],
] as const

const FAQ = [
  {
    question: 'What is the basic drum and bass drum pattern?',
    answer:
      'The two-step: on a 16-step grid, kick on steps 1 and 11 and snare on steps 5 and 13 — snare on beats 2 and 4, a second kick just after beat 3 — usually at around 174 BPM.',
  },
  {
    question: 'What time signature is drum and bass?',
    answer: 'Drum and bass is in 4/4. One bar has four beats; at 174 BPM a bar lasts about 1.38 seconds, and producers usually program it as 16 sixteenth-note steps.',
  },
  {
    question: 'What is halftime in drum and bass?',
    answer:
      'Halftime keeps the 174 BPM tempo but moves the snare to beat 3 only, so the groove feels like 87 BPM. It is used in halftime tracks and in breakdowns of normal DnB tunes.',
  },
  {
    question: 'What is the Amen break?',
    answer:
      'A four-bar drum solo from “Amen, Brother” by The Winstons (1969). Sped up and chopped, it became the backbone of jungle and early drum and bass and is still one of the most sampled drum breaks.',
  },
  {
    question: 'How is a drum and bass track structured?',
    answer:
      'Typically in blocks of 8, 16 and 32 bars: an intro for DJs, a build-up, the first drop, a breakdown, a second drop and an outro. It is a convention, not a rule.',
  },
  {
    question: 'What are ghost notes in DnB drums?',
    answer:
      'Quiet extra snare hits between the main backbeats. They add swing and movement — the “rolling” feel of rollers and neurofunk — without changing the main kick-snare pattern.',
  },
]

export default function DnbDrumPatternsPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      image: ['https://dnbdoctor.com/og-image.jpg'],
      mainEntityOfPage: URL,
      datePublished: '2026-11-22',
      dateModified: '2026-11-22',
      author: { '@type': 'Organization', name: 'DnB Doctor', url: 'https://dnbdoctor.com' },
      publisher: PUBLISHER,
    },
    faqJsonLd(FAQ),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
        { '@type': 'ListItem', position: 2, name: 'How to produce neurofunk', item: 'https://dnbdoctor.com/how-to-produce-neurofunk' },
        { '@type': 'ListItem', position: 3, name: 'DnB drum patterns', item: URL },
      ],
    },
  ]

  return (
    <article className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={styles.backdrop} aria-hidden="true">
        <Image src="/music-bg.jpeg" alt="" fill sizes="100vw" priority />
      </div>

      <header className={`${styles.wrap} ${styles.hero}`}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span>{' '}
          <Link href="/how-to-produce-neurofunk">Production</Link> <span aria-hidden="true">/</span>{' '}
          <span aria-current="page">Drum patterns</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> Playable at 174 BPM
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>DnB Drum</span>
            <span className={styles.solid}>Patterns</span>
          </h1>
          <p className={styles.lede}>
            Every <Link href="/what-is-drum-and-bass">drum and bass</Link> groove starts from a few simple patterns. Press play,
            click the steps, and hear how the two-step, rollers, halftime and the Amen break are built.
          </p>
          <ul className={styles.toc} aria-label="In this guide">
            {TOC.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <div className={styles.ctas}>
            <a href="#two-step" className={styles.btn}>
              Play the two-step <span aria-hidden="true">↓</span>
            </a>
            <Link href="/sample-packs" className={styles.btnGhost}>
              Free drum loops
            </Link>
          </div>
        </div>

        <aside className={styles.answer} aria-labelledby="quick-answer">
          <p className={styles.answerHead}>
            <span id="quick-answer">Quick answer</span>
            <span>The DnB beat</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Kick</dt>
              <dd>
                1 · 11<small>of 16 steps</small>
              </dd>
            </div>
            <div>
              <dt>Snare</dt>
              <dd>
                5 · 13<small>beats 2 and 4</small>
              </dd>
            </div>
            <div>
              <dt>Tempo</dt>
              <dd>
                174<small>BPM</small>
              </dd>
            </div>
            <div>
              <dt>Metre</dt>
              <dd>
                4/4<small>1 bar ≈ 1.38 s</small>
              </dd>
            </div>
          </dl>
          <p className={styles.answerText}>
            The core <strong>drum and bass pattern</strong> is the <strong>two-step</strong>: snare on 2 and 4, kick on 1 and
            just after 3. Everything else — rollers, halftime, breaks — is a variation of it.
          </p>
        </aside>
      </header>

      <Section id="basics" n="01" label="Basics">
        <h2 className={styles.h2}>
          How to read a <em>drum grid</em>
        </h2>
        <p>
          Drum and bass is in <strong>4/4</strong>. One bar is split into <strong>16 steps</strong> (sixteenth notes), so steps
          1, 5, 9 and 13 are the four beats. At <Link href="/dnb-bpm">174 BPM</Link> one bar lasts about 1.38 seconds — which is
          why DnB feels fast even though the main kick and snare land only a few times per bar.
        </p>
        <p>
          In the players below, <strong>green</strong> is the kick, <strong>purple</strong> the snare (lighter purple = ghost
          notes) and <strong>white</strong> the hats. Click any step to change the pattern.
        </p>
      </Section>

      <Section id="two-step" n="02" label="Two-step">
        <h2 className={styles.h2}>
          The <em>two-step</em> beat
        </h2>
        <p>
          The backbone of modern DnB. Snare on beats 2 and 4, kick on beat 1 and on the &ldquo;and&rdquo; after beat 3 (step 11).
          That off-beat second kick is what gives drum and bass its forward lurch. Liquid, dancefloor and{' '}
          <Link href="/neurofunk-dnb">neurofunk</Link> all start here.
        </p>
        <PatternPlayer name="Two-step" pattern={P.twoStep} />
      </Section>

      <Section id="rollers" n="03" label="Rollers">
        <h2 className={styles.h2}>
          Rollers &amp; <em data-tone="purple">ghost notes</em>
        </h2>
        <p>
          Same two-step skeleton, plus quiet <strong>ghost snares</strong> between the backbeats and a few extra hats. The groove
          starts to roll instead of just stepping — the sound of &ldquo;rollers&rdquo; and most neurofunk drums.
        </p>
        <PatternPlayer name="Rollers" pattern={P.rollers} />
      </Section>

      <Section id="halftime" n="04" label="Halftime">
        <h2 className={styles.h2}>
          <em>Halftime</em> drums
        </h2>
        <p>
          Tempo stays at 174, but the snare moves to beat 3 only. The beat now feels like 87 BPM — heavy and spacious. Used in{' '}
          <Link href="/types-of-dnb#halftime">halftime tracks</Link> and in breakdowns of normal DnB tunes.
        </p>
        <PatternPlayer name="Halftime" pattern={P.halftime} />
      </Section>

      <Section id="amen" n="05" label="Breaks">
        <h2 className={styles.h2}>
          The <em data-tone="purple">Amen break</em>
        </h2>
        <p>
          The Amen break is a four-bar drum solo from &ldquo;Amen, Brother&rdquo; by The Winstons (1969). Sped up and chopped, it
          built <Link href="/types-of-dnb#jungle">jungle</Link> and early drum and bass. Below is its first bar as usually
          transcribed: two kicks at the start, a double kick before beat 4 and soft snares around the backbeat.
        </p>
        <PatternPlayer name="Amen-style break" pattern={P.amen} />
        <p className={styles.note}>
          In real tracks producers slice a recorded break and rearrange the slices — the grid only shows the skeleton. More on
          the roots in <Link href="/drum-and-bass-history">the history of drum and bass</Link>.
        </p>
      </Section>

      <Section id="structure" n="06" label="Structure">
        <h2 className={styles.h2}>
          DnB <em>track structure</em>
        </h2>
        <p>
          Drum and bass is arranged in blocks of 8, 16 and 32 bars, built for DJs who mix long blends. A typical layout — a
          convention, not a rule:
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Section</th>
                <th scope="col">Length</th>
                <th scope="col">What happens</th>
              </tr>
            </thead>
            <tbody>
              {STRUCTURE.map(([s, len, what]) => (
                <tr key={s}>
                  <th scope="row">{s}</th>
                  <td className={styles.bpm}>{len}</td>
                  <td>{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="tips" n="07" label="Tips">
        <h2 className={styles.h2}>
          Make the pattern <em data-tone="purple">hit</em>
        </h2>
        <dl className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
          {TIPS.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Skip programming from zero</h3>
          <p>
            The <Link href="/sample-packs">free neurofunk sample pack</Link> has 15 drum loops and 15 top loops at 174 BPM — drop
            one under your own kick and snare. The full workflow is in{' '}
            <Link href="/how-to-produce-neurofunk">how to produce neurofunk</Link>.
          </p>
        </div>
      </Section>

      <Section id="faq" n="08" label="FAQ">
        <h2 className={styles.h2}>
          Drum pattern <em>FAQ</em>
        </h2>
        <GuideFaq items={FAQ} />
      </Section>

      <section className={`${styles.wrap} ${styles.closing}`}>
        <blockquote>
          “Kick, snare, and the space <span>between</span> them.”
        </blockquote>
        <cite>— DnB Doctor</cite>
      </section>
    </article>
  )
}
