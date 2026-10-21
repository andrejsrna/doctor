import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideFaq, GuideReleases, GuideSection as Section, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import { DNB_BPM } from '@/app/components/guide/bpm'
import styles from '@/app/components/guide/guide.module.css'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/dnb-bpm'
const TITLE = 'DnB BPM: What BPM Is Drum and Bass? (174 BPM Explained)'
const DESCRIPTION =
  'Drum and bass is usually 170–176 BPM, with 174 BPM the modern standard. BPM by DnB subgenre, halftime, DnB vs other genres and delay times for producers.'

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | DnB Doctor` },
  description: DESCRIPTION,
  keywords: 'dnb bpm, drum and bass bpm, what bpm is dnb, what bpm is drum and bass, dnb tempo, 174 bpm, neurofunk bpm, halftime dnb',
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'DnB BPM — what tempo is drum and bass' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/og-image.jpg'] },
}

const TOC = [
  ['#why-174', 'Why 174'],
  ['#subgenres', 'BPM by subgenre'],
  ['#halftime', 'Halftime'],
  ['#genres', 'DnB vs other genres'],
  ['#history', 'Tempo history'],
  ['#producers', 'For producers'],
  ['#djs', 'For DJs'],
  ['#faq', 'FAQ'],
] as const

const GENRES = [
  { name: 'Hip-hop', bpm: '85–95', note: 'Exactly half of DnB — why rap vocals sit well over halftime DnB' },
  { name: 'House', bpm: '120–128', note: 'Four-on-the-floor; DnB is ~40% faster' },
  { name: 'Techno', bpm: '125–140', note: 'Straight kicks, no breakbeat swing' },
  { name: 'Dubstep', bpm: '140', note: 'Halftime feel at 70; DnB halftime feels ~87' },
  { name: 'Trap', bpm: '130–150', note: 'Usually felt in halftime' },
  { name: 'Hardstyle', bpm: '150–160', note: 'Fast, but four-on-the-floor' },
  { name: 'Footwork / juke', bpm: '160', note: 'Close in tempo, very different drums' },
  { name: 'Drum & Bass', bpm: '170–176', note: 'Breakbeats at 174, sub-bass at half speed' },
] as const

/** note lengths at 174 BPM: 60 000 ms / 174 = 344.8 ms per beat */
const BEAT_MS = 60000 / 174
const DELAYS = [
  ['1/2 note', BEAT_MS * 2],
  ['1/4 note (1 beat)', BEAT_MS],
  ['Dotted 1/8', BEAT_MS * 0.75],
  ['1/8 note', BEAT_MS / 2],
  ['1/8 triplet', BEAT_MS / 3],
  ['1/16 note', BEAT_MS / 4],
] as const

const FAQ = [
  {
    question: 'What BPM is DnB?',
    answer:
      'Drum and bass usually runs at 170–176 BPM, and 174 BPM is the modern standard. Older jungle sits lower (around 160–170), and the full range across styles is roughly 160–180 BPM.',
  },
  {
    question: 'Why is drum and bass 174 BPM?',
    answer:
      'Tempos crept up from the 160s of early-90s jungle to the 170s by the late 90s. 174 became the default because it keeps the drums urgent while leaving room for the sub-bass to breathe, and because a shared tempo makes long DJ mixes easy.',
  },
  {
    question: 'Is halftime DnB slower?',
    answer:
      'No. Halftime tracks still run at around 170–175 BPM; only the drum pattern changes. The snare lands on beat 3 instead of 2 and 4, so the groove feels like ~87 BPM.',
  },
  {
    question: 'What BPM is neurofunk?',
    answer: 'Neurofunk is typically 172–176 BPM, most often 174 — the same tempo as other modern DnB, with darker and more technical sound design.',
  },
  {
    question: 'What BPM is liquid drum and bass?',
    answer: 'Liquid DnB runs at the same 170–176 BPM as other modern DnB. It sounds calmer because of its chords, vocals and smoother drums, not a slower tempo.',
  },
  {
    question: 'Is 140 BPM drum and bass?',
    answer:
      '140 BPM is dubstep and grime tempo. Some producers write 140 and DnB tracks in the same session, but drum and bass itself is about 170–176 BPM.',
  },
]

/** 16 steps = 1 bar. Two-step: kick 1 + "and" of 3, snare 2 + 4. Halftime: kick 1, snare on 3. */
const TWO_STEP = { kick: new Set([0, 10]), snare: new Set([4, 12]) }
const HALFTIME = { kick: new Set([0, 11]), snare: new Set([8]) }

function Steps({ label, hits, kind }: { label: string; hits: Set<number>; kind: 'kick' | 'snare' }) {
  return (
    <div className={styles.row}>
      <span>{label}</span>
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className={styles.step}
          data-hit={hits.has(i) ? kind : undefined}
          style={hits.has(i) ? ({ '--at': `calc(var(--bar) * ${i / 16})` } as CSSProperties) : undefined}
        />
      ))}
    </div>
  )
}

function Groove({ title, pattern }: { title: string; pattern: { kick: Set<number>; snare: Set<number> } }) {
  return (
    <div className={styles.grid} aria-hidden="true">
      <div className={styles.gridHead}>
        <span>{title}</span>
        <span>1 bar = 1.38 s</span>
      </div>
      <Steps label="Kick" hits={pattern.kick} kind="kick" />
      <Steps label="Snare" hits={pattern.snare} kind="snare" />
    </div>
  )
}

export default function DnbBpmPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      image: ['https://dnbdoctor.com/og-image.jpg'],
      mainEntityOfPage: URL,
      datePublished: '2026-10-21',
      dateModified: '2026-10-21',
      author: { '@type': 'Organization', name: 'DnB Doctor', url: 'https://dnbdoctor.com' },
      publisher: PUBLISHER,
    },
    faqJsonLd(FAQ),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
        { '@type': 'ListItem', position: 2, name: 'What Is Drum and Bass', item: 'https://dnbdoctor.com/what-is-drum-and-bass' },
        { '@type': 'ListItem', position: 3, name: 'DnB BPM', item: URL },
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
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <Link href="/what-is-drum-and-bass">What is DnB</Link>{' '}
          <span aria-hidden="true">/</span> <span aria-current="page">BPM</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> Tempo guide {'//'} 174 BPM
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>DnB BPM:</span>
            <span className={styles.solid}>174 explained</span>
          </h1>
          <p className={styles.lede}>
            <strong>Drum and bass is usually 170–176 BPM</strong>, and <strong>174 BPM</strong> is the modern standard. Older
            jungle runs slower (around 160–170), so the full range is roughly <strong>160–180 BPM</strong>. Halftime DnB keeps
            that tempo but feels like ~87.
          </p>
          <ul className={styles.toc} aria-label="In this guide">
            {TOC.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <div className={styles.ctas}>
            <Link href="/music" className={styles.btn}>
              Hear 174 BPM neurofunk <span aria-hidden="true">→</span>
            </Link>
            <Link href="/how-to-produce-neurofunk" className={styles.btnGhost}>
              Production guide
            </Link>
          </div>
        </div>

        <aside className={styles.answer} aria-label="Quick answer">
          <p className={styles.answerHead}>
            <span>Quick answer</span>
            <span>DnB tempo in 4 numbers</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Standard</dt>
              <dd>
                174 BPM<small>most modern DnB</small>
              </dd>
            </div>
            <div>
              <dt>Typical range</dt>
              <dd>
                170–176<small>full range 160–180</small>
              </dd>
            </div>
            <div>
              <dt>Halftime feel</dt>
              <dd>
                ~87 BPM<small>same tempo, half the snares</small>
              </dd>
            </div>
            <div>
              <dt>1 beat</dt>
              <dd>
                345 ms<small>1 bar = 1.38 s</small>
              </dd>
            </div>
          </dl>
          <Groove title="Two-step at 174" pattern={TWO_STEP} />
        </aside>
      </header>

      <Section id="why-174" n="01" label="Why 174">
        <h2 className={styles.h2}>
          Why is DnB <em>174 BPM?</em>
        </h2>
        <p>
          There is no rule that says drum and bass must be 174 — it is a convention that settled over time. Fast enough that
          breakbeats feel urgent and rolling, slow enough that a <strong>sub-bass note</strong> has room to sustain between
          kicks. At 174 BPM one beat lasts <strong>345 ms</strong> and one bar <strong>1.38 seconds</strong>.
        </p>
        <p>
          The other reason is practical: when almost every track shares the same tempo, DJs can mix for hours without big
          pitch changes. That is why most modern DnB is released at or very close to 174.
        </p>
        <blockquote className={styles.quote}>
          The drums run at 174, the bass often moves at half speed. That push-and-pull is the whole <strong>drum &amp; bass</strong> idea.
        </blockquote>
      </Section>

      <Section id="subgenres" n="02" label="BPM by subgenre">
        <h2 className={styles.h2}>
          BPM by <em data-tone="purple">DnB subgenre</em>
        </h2>
        <p>
          Subgenres differ in sound design, drums and mood far more than in tempo. Almost all modern styles sit within a few BPM
          of 174; jungle is the main exception.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Typical BPM by Drum and Bass subgenre</caption>
            <thead>
              <tr>
                <th scope="col">Style</th>
                <th scope="col">Typical BPM</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {DNB_BPM.map((r) => (
                <tr key={r.name}>
                  <th scope="row">{r.name}</th>
                  <td className={styles.bpm}>{r.bpm}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.note}>
          What each style sounds like: <Link href="/types-of-dnb">types of DnB compared</Link> ·{' '}
          <Link href="/neurofunk-dnb">what is neurofunk</Link>
        </p>
      </Section>

      <Section id="halftime" n="03" label="Halftime">
        <h2 className={styles.h2}>
          Halftime &amp; <em>double-time</em>
        </h2>
        <p>
          <strong>Halftime DnB</strong> does not change the BPM. The track still runs at ~174, but the snare moves from beats 2
          and 4 to beat 3, so your head nods at about <strong>87 BPM</strong>. It is common in heavier, darker neurofunk and in
          breakdowns before a full two-step drop.
        </p>
        <div style={{ maxWidth: '34rem', margin: '1.6rem 0' }}>
          <Groove title="Halftime at 174" pattern={HALFTIME} />
        </div>
        <p>
          The reverse works too: an 87 BPM hip-hop beat played over 174 BPM drums is <strong>double-time</strong>. That is why
          rap and DnB fit together so easily, and why DJs can move from hip-hop to DnB without touching the tempo.
        </p>
      </Section>

      <Section id="genres" n="04" label="DnB vs other genres">
        <h2 className={styles.h2}>
          DnB BPM vs <em data-tone="purple">other genres</em>
        </h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Typical BPM of electronic and urban genres compared with drum and bass</caption>
            <thead>
              <tr>
                <th scope="col">Genre</th>
                <th scope="col">Typical BPM</th>
                <th scope="col">Compared with DnB</th>
              </tr>
            </thead>
            <tbody>
              {GENRES.map((r) => (
                <tr key={r.name}>
                  <th scope="row">{r.name}</th>
                  <td className={styles.bpm}>{r.bpm}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Tempo alone does not make a track drum and bass. Hardstyle and footwork are nearly as fast; what sets DnB apart is the{' '}
          <strong>syncopated breakbeat</strong> and the heavy, often half-speed bassline. More in{' '}
          <Link href="/what-is-drum-and-bass">what is drum and bass</Link>.
        </p>
      </Section>

      <Section id="history" n="05" label="Tempo history">
        <h2 className={styles.h2}>
          How the tempo <em>crept up</em>
        </h2>
        <ul className={styles.list}>
          <li>
            <strong>Early &apos;90s hardcore &amp; jungle:</strong> sped-up breakbeats, mostly in the 150s and 160s.
          </li>
          <li>
            <strong>Mid–late &apos;90s:</strong> as jungle turned into drum and bass and techstep, tempos moved into the 170s.
          </li>
          <li>
            <strong>2000s onwards:</strong> 172–176 became the norm and 174 the default for most labels and DJs.
          </li>
        </ul>
        <p className={styles.note}>
          The full story: <Link href="/drum-and-bass-history">history of drum and bass</Link>
        </p>
      </Section>

      <Section id="producers" n="06" label="For producers">
        <h2 className={styles.h2}>
          174 BPM <em data-tone="purple">for producers</em>
        </h2>
        <p>
          Set the project to <strong>174 BPM</strong> before you write anything. Drum loops, bass presets and sample packs for DnB
          are almost always made at 174, so they line up without time-stretching. Tempo-synced delays and LFOs then follow
          automatically; for anything that needs milliseconds, use the table below.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table} data-compact="">
            <caption className="sr-only">Delay and reverb times at 174 BPM</caption>
            <thead>
              <tr>
                <th scope="col">Note value at 174 BPM</th>
                <th scope="col">Milliseconds</th>
              </tr>
            </thead>
            <tbody>
              {DELAYS.map(([name, ms]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td className={styles.bpm}>{ms.toFixed(1)} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.ctas}>
          <Link href="/how-to-produce-neurofunk" className={styles.btn}>
            How to make neurofunk <span aria-hidden="true">→</span>
          </Link>
          <Link href="/sample-packs" className={styles.btnGhost}>
            Free neurofunk sample pack
          </Link>
        </div>
      </Section>

      <Section id="djs" n="07" label="For DJs">
        <h2 className={styles.h2}>
          174 BPM <em>for DJs</em>
        </h2>
        <ul className={styles.list}>
          <li>
            Most DnB is already at 174, so beatmatching is mostly about <strong>phrasing</strong> — line up 16- or 32-bar sections and
            the drops will land together.
          </li>
          <li>
            Older jungle at 160–170 can be pitched up to 174; keep an eye on key lock, as large pitch changes make vocals and
            pads sound unnatural.
          </li>
          <li>
            To move between genres, use the halftime link: hip-hop at 87 or dubstep-style halftime blends straight into 174 BPM
            drums.
          </li>
        </ul>
        <p className={styles.note}>
          Hear it mixed: <Link href="/neurofunk-dnb-mixes">neurofunk DJ mixes</Link> · <Link href="/neurofunk-spotify">neurofunk playlists</Link>
        </p>
      </Section>

      <GuideReleases heading="Hear" accent="174 BPM" text="The latest neurofunk from the DnB Doctor lab — every track at drum and bass tempo." />

      <Section id="faq" n="08" label="FAQ">
        <h2 className={styles.h2}>FAQ</h2>
        <GuideFaq items={FAQ} />
      </Section>

      <section className={`${styles.wrap} ${styles.closing}`}>
        <blockquote>
          “Drums at 174, bass at half speed — <span>that&apos;s the formula.</span>”
        </blockquote>
        <cite>— DnB Doctor</cite>
      </section>
    </article>
  )
}
