import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideFaq, GuideReleases, GuideSection as Section, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import styles from '@/app/components/guide/guide.module.css'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/what-is-drum-and-bass'
const TITLE = 'What Is DnB? Meaning, BPM & Subgenres of Drum and Bass'
const DESCRIPTION =
  'What is DnB? Drum and Bass is fast breakbeat electronic music at 160–180 BPM (usually 174). Meaning, BPM by subgenre, origins, liquid vs neurofunk and a beginner FAQ.'

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | DnB Doctor` },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'What is Drum and Bass — meaning, BPM and subgenres' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/og-image.jpg'] },
}

const TOC = [
  ['#bpm', 'BPM'],
  ['#meaning', 'Meaning & DNA'],
  ['#origins', 'Origins'],
  ['#modern-sound', 'Modern sound'],
  ['#subgenres', 'Subgenres'],
  ['#listening', 'Where to start'],
  ['#glossary', 'Glossary'],
  ['#faq', 'FAQ'],
] as const

const BPM = [
  { name: 'Drum & Bass', bpm: '170–176', note: 'Most modern tracks sit at 174' },
  { name: 'Liquid', bpm: '170–176', note: 'Same tempo, smoother and melodic' },
  { name: 'Neurofunk', bpm: '172–176', note: 'Dark, technical, usually 174' },
  { name: 'Jump-Up', bpm: '172–176', note: 'Bouncy, rave-focused' },
  { name: 'Techstep', bpm: '170–180', note: 'Minimal, industrial' },
  { name: 'Halftime', bpm: '170–175', note: 'Drums feel like ~85–87 BPM' },
  { name: 'Jungle', bpm: '160–175', note: 'Older, breakbeat-heavy roots' },
]

const SUBGENRES = [
  { name: 'Liquid DnB', description: 'Smooth, melodic, emotional', artists: 'Netsky, LSB' },
  { name: 'Neurofunk', description: 'Dark, futuristic, mechanical', artists: 'Noisia, Mefjus, DnB Doctor' },
  { name: 'Jump-Up', description: 'Playful, heavy, rave-ready', artists: 'DJ Hazard, Macky Gee' },
  { name: 'Techstep', description: 'Minimal, robotic', artists: 'Ed Rush & Optical' },
  { name: 'Jungle', description: 'Organic, breakbeat-driven', artists: 'Shy FX, Congo Natty' },
]

const ERA = [
  ['Liquid DnB', 'smooth, melodic, emotional'],
  ['Neurofunk', 'dark, technical, cinematic'],
  ['Jump-Up', 'aggressive, playful, built for clubs'],
  ['Techstep', 'industrial, robotic, minimal'],
] as const

const SCENES = [
  ['United Kingdom', 'the birthplace, home of Hospital, RAM, Metalheadz'],
  ['Czech Republic', 'Let It Roll & DnB Doctor generation'],
  ['New Zealand', 'vibrant live scene, artists like The Upbeats'],
  ['North America', 'neurofunk and liquid resurgence'],
] as const

const GLOSSARY = [
  ['Amen break', 'A legendary sampled drum break used across jungle and DnB — often chopped into new patterns.'],
  ['Reese bass', 'A gritty, detuned bass tone (often with movement) that became a core DnB sound.'],
  ['Double drop', 'DJ technique: two tracks drop at the same time for extra impact.'],
  ['Reload', 'The DJ “pulls up” the track and restarts it — usually because the crowd reaction is huge.'],
  ['Halftime', 'A slower-feeling drum groove inside DnB tempo — common in heavier, darker styles.'],
  ['Roller', 'A driving, continuous groove that “rolls” forward — often minimal but very danceable.'],
] as const

const FAQ = [
  { question: 'What does DnB stand for?', answer: 'DnB means "Drum and Bass" — a fast, bass-driven electronic music genre.' },
  {
    question: "What's the difference between Jungle and DnB?",
    answer: 'Jungle uses more reggae-inspired basslines and samples, while DnB tends to sound more polished and modern.',
  },
  { question: 'What BPM is Drum and Bass?', answer: 'Usually between 160–180 BPM, most tracks sit around 174 BPM.' },
  {
    question: 'What is halftime in DnB?',
    answer:
      'Halftime is a DnB groove where the drums feel slower (around half-time) while the track still runs at DnB tempo — often darker and heavier.',
  },
  {
    question: 'Is Drum and Bass hard to produce?',
    answer:
      'It can be technical (drum programming, bass design, and mix clarity), but many producers start with simple breakbeats and a clean sub-bass, then build complexity over time.',
  },
  {
    question: 'How do I get into Drum and Bass as a beginner?',
    answer:
      'Start with one subgenre you enjoy (liquid = melodic, neurofunk = dark/technical, jump-up = ravey), then explore DJs, playlists, and labels in that lane.',
  },
]

/** classic two-step: kick on 1 and the "and" of 3, snare on 2 and 4 (16 steps = 1 bar) */
const KICK = new Set([0, 10])
const SNARE = new Set([4, 12])

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

export default function WhatIsDrumAndBassPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      image: ['https://dnbdoctor.com/og-image.jpg'],
      mainEntityOfPage: URL,
      dateModified: '2026-10-20',
      author: { '@type': 'Organization', name: 'DnB Doctor', url: 'https://dnbdoctor.com' },
      publisher: PUBLISHER,
    },
    faqJsonLd(FAQ),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
        { '@type': 'ListItem', position: 2, name: 'What Is Drum and Bass', item: URL },
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
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <span>Guides</span>{' '}
          <span aria-hidden="true">/</span> <span aria-current="page">What is DnB</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> The complete guide {'//'} 174 BPM
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>What is</span>
            <span className={styles.solid}>Drum &amp; Bass?</span>
          </h1>
          <p className={styles.lede}>
            Drum and Bass — often shortened to <strong>DnB</strong> — is a <strong>high-energy electronic music genre</strong>{' '}
            defined by <strong>fast breakbeats (160–180 BPM, often ~174)</strong>, deep basslines, and complex rhythmic
            structures.
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
              Explore releases <span aria-hidden="true">→</span>
            </Link>
            <Link href="/submit-demo" className={styles.btnGhost}>
              Submit your track
            </Link>
          </div>
        </div>

        <aside className={styles.answer} aria-label="Quick answer">
          <p className={styles.answerHead}>
            <span>Quick answer</span>
            <span>DnB in 4 facts</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Stands for</dt>
              <dd>Drum and Bass</dd>
            </div>
            <div>
              <dt>Tempo</dt>
              <dd>
                174 BPM<small>range 160–180</small>
              </dd>
            </div>
            <div>
              <dt>Born</dt>
              <dd>
                London<small>early &apos;90s, out of jungle</small>
              </dd>
            </div>
            <div>
              <dt>Core</dt>
              <dd>
                Breaks + bass<small>syncopated drums, heavy sub</small>
              </dd>
            </div>
          </dl>
          <div className={styles.grid} aria-hidden="true">
            <p className={styles.gridHead}>
              <span>Two-step groove</span>
              <span>1 bar = 1.38 s</span>
            </p>
            <Steps label="Kick" hits={KICK} kind="kick" />
            <Steps label="Snare" hits={SNARE} kind="snare" />
          </div>
        </aside>
      </header>

      <Section id="bpm" n="01" label="Tempo">
        <h2 className={styles.h2}>
          What BPM is <em>DnB?</em>
        </h2>
        <p>
          Usually between <strong>160–180 BPM</strong>, most tracks sit around <strong>174 BPM</strong>. That is about 40%
          faster than a typical house track (~124 BPM), which is why DnB drums feel so urgent.
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
              {BPM.map((r) => (
                <tr key={r.name}>
                  <th scope="row">{r.name}</th>
                  <td className={styles.bpm}>{r.bpm}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="meaning" n="02" label="Meaning & DNA">
        <h2 className={styles.h2}>
          The meaning of <em>DnB</em>
        </h2>
        <p>
          At its core, Drum and Bass is about <strong>rhythmic precision</strong> and <strong>bass energy</strong>. While
          techno and house focus on steady four-on-the-floor beats, DnB uses <strong>syncopated breakbeats</strong> —
          chopped, swung drum patterns that create tension and movement.
        </p>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Typical features</h3>
          <ul className={styles.list}>
            <li>
              Tempo between <strong>160–180 BPM</strong>
            </li>
            <li>
              Heavy use of <strong>Amen break</strong>, <strong>Reese bass</strong>, and <strong>sub-bass layers</strong>
            </li>
            <li>
              Emphasis on <strong>sound design</strong> and <strong>mix clarity</strong>
            </li>
          </ul>
        </div>
        <blockquote className={styles.quote}>
          The name itself says it all: <strong>Drums and Bass</strong> are the foundation — everything else (melodies,
          atmospheres, vocals) serves the rhythm.
        </blockquote>
      </Section>

      <Section id="origins" n="03" label="Origins">
        <h2 className={styles.h2}>
          From jungle to <em data-tone="purple">DnB</em>
        </h2>
        <p>
          Drum and Bass was born in early &apos;90s London, growing out of <strong>jungle</strong>,{' '}
          <strong>hardcore</strong>, and <strong>breakbeat rave</strong>. Pioneers like <strong>Goldie</strong>,{' '}
          <strong>LTJ Bukem</strong>, and <strong>Roni Size</strong> shaped the first wave — merging{' '}
          <strong>breakbeats</strong>, <strong>dub basslines</strong>, and <strong>soulful samples</strong>.
        </p>
        <p>By the 2000s, the genre diversified:</p>
        <ul className={styles.tiles}>
          {ERA.map(([name, text]) => (
            <li key={name}>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
        <p>Each subgenre kept the DnB DNA but evolved its own identity and energy.</p>
        <p className={styles.note}>
          Deep dive: <Link href="/drum-and-bass-history">the history of Drum and Bass</Link>.
        </p>
      </Section>

      <Section id="modern-sound" n="04" label="Modern sound">
        <h2 className={styles.h2}>
          The modern <em>DnB</em> sound
        </h2>
        <p>
          Modern DnB is produced with <strong>high-precision digital tools</strong> — DAWs like{' '}
          <strong>Ableton Live, FL Studio, or Cubase</strong>, and plugins such as{' '}
          <strong>Serum, Phase Plant, or FabFilter</strong>.
        </p>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Key production traits</h3>
          <ul className={styles.list}>
            <li>
              <strong>Layered drum design</strong> (snare + ghost hits + transient shaping)
            </li>
            <li>
              <strong>Clean sub separation</strong> — bass never collides with the kick
            </li>
            <li>
              <strong>Atmospheric pads</strong> or <strong>cinematic ambiences</strong>
            </li>
            <li>
              <strong>Automation-driven movement</strong> — filters, LFOs, distortion shaping
            </li>
          </ul>
        </div>
        <blockquote className={styles.quote}>
          The genre has always balanced <strong>engineering and emotion</strong> — high-tech sound with human groove.
        </blockquote>
        <p className={styles.note}>
          Making it yourself? Read <Link href="/how-to-produce-neurofunk">how to produce neurofunk</Link> and grab our{' '}
          <Link href="/sample-packs">sample packs</Link>.
        </p>
      </Section>

      <Section n="05" label="Global scene">
        <h2 className={styles.h2}>
          Global scene &amp; <em data-tone="purple">subculture</em>
        </h2>
        <p>
          From underground raves in Bristol to main stages at Let It Roll, Drum and Bass has become a{' '}
          <strong>worldwide subculture</strong>.
        </p>
        <ul className={styles.tiles}>
          {SCENES.map(([name, text]) => (
            <li key={name}>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
        <p>
          The community thrives on <strong>respect, collaboration, and sonic experimentation</strong> — it&apos;s more
          than a genre; it&apos;s a global network of producers, DJs, and fans.
        </p>
      </Section>

      <Section id="subgenres" n="06" label="Subgenres">
        <h2 className={styles.h2}>
          DnB <em>subgenres</em>
        </h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Subgenre</th>
                <th scope="col">Description</th>
                <th scope="col">Example artists</th>
              </tr>
            </thead>
            <tbody>
              {SUBGENRES.map((s) => (
                <tr key={s.name}>
                  <th scope="row">{s.name}</th>
                  <td>{s.description}</td>
                  <td>{s.artists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.note}>
          See also: <Link href="/types-of-dnb">types of DnB</Link> ·{' '}
          <Link href="/drum-and-bass-subgenres">all Drum and Bass subgenres</Link> ·{' '}
          <Link href="/neurofunk-dnb">neurofunk explained</Link>
        </p>
      </Section>

      <Section n="07" label="Why it matters">
        <h2 className={styles.h2}>
          Why it <em data-tone="purple">matters</em>
        </h2>
        <p>
          Drum and Bass has shaped not just club music but also <strong>film scores, video games, and advertising</strong>.
          Its mix of <strong>intensity and precision</strong> influenced genres like dubstep, trap, and techno.
        </p>
        <p>
          The best way to understand it? <strong>Listen.</strong> Explore our latest releases below.
        </p>
      </Section>

      <GuideReleases text="Fresh neurofunk from the DnB Doctor lab." />

      <Section id="listening" n="08" label="Where to start">
        <h2 className={styles.h2}>
          Where to <em>start</em> listening
        </h2>
        <p>Drum and Bass is a big umbrella. The fastest way to “get it” is to pick a lane, then branch out.</p>
        <ul className={styles.tiles}>
          <li>
            <span className={styles.tileTag}>If you like melodies</span>
            <h3>Liquid DnB</h3>
            <p>Start with Liquid DnB — smoother chords, vocals, emotional energy.</p>
          </li>
          <li>
            <span className={styles.tileTag}>If you like heavy sound design</span>
            <h3>Neurofunk</h3>
            <p>Try Neurofunk — darker, technical, futuristic bass movement.</p>
          </li>
          <li>
            <span className={styles.tileTag}>If you want club energy</span>
            <h3>Jump-Up</h3>
            <p>Go Jump-Up — bouncy drops, big hooks, rave-ready.</p>
          </li>
        </ul>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Quick beginner roadmap</h3>
          <ol className={styles.list}>
            <li>Pick one subgenre and listen for 30 minutes (don’t shuffle across styles yet).</li>
            <li>
              Pay attention to the <strong>drum pattern</strong> (breakbeats) and the <strong>bassline</strong> (sub + mid
              movement).
            </li>
            <li>Follow a label or artist you like and explore their catalog.</li>
          </ol>
        </div>
        <div className={styles.ctas}>
          <Link href="/music" className={styles.btn}>
            Browse DnB Doctor releases <span aria-hidden="true">→</span>
          </Link>
          <Link href="/drum-and-bass-subgenres" className={styles.btnGhost}>
            Explore subgenres
          </Link>
        </div>
      </Section>

      <Section id="glossary" n="09" label="Glossary">
        <h2 className={styles.h2}>
          Quick DnB <em data-tone="purple">glossary</em>
        </h2>
        <dl className={styles.tiles}>
          {GLOSSARY.map(([term, def]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{def}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="faq" n="10" label="FAQ">
        <h2 className={styles.h2}>FAQ</h2>
        <GuideFaq items={FAQ} />
      </Section>

      <section className={`${styles.wrap} ${styles.closing}`}>
        <blockquote>
          “Drum and Bass isn&apos;t just music — it&apos;s a <span>frequency culture.</span>”
        </blockquote>
        <cite>— DnB Doctor</cite>
      </section>
    </article>
  )
}
