import type { Metadata } from 'next'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideFaq, GuideReleases, GuideSection, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import styles from '@/app/components/guide/guide.module.css'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/types-of-dnb'
const TITLE = 'Types of DnB: 6 Drum and Bass Subgenres Compared'
const DESCRIPTION =
  'All DnB subgenres explained: Liquid vs Neurofunk vs Jump-Up vs Jungle vs Techstep vs Halftime — what each type sounds like, with BPM, mood, artists and where to start.'

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | DnB Doctor` },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'Types of DnB compared' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/og-image.jpg'] },
}

const TYPES = [
  {
    slug: 'liquid',
    name: 'Liquid DnB',
    short: 'Liquid',
    mood: 'Melodic',
    description:
      "Smooth, melodic, and emotional — Liquid DnB focuses on lush chords, atmospheric pads, and often features soulful vocals. It's the most accessible type of DnB for newcomers.",
    characteristics: ['Melodic chords and atmospheres', 'Vocals and singing', 'Rolling but gentle drums', 'Warm basslines', 'Often 160-180 BPM'],
    forYouIf: 'You enjoy melodic electronic music, trance, or house and want an easy entry into DnB.',
    artists: 'Netsky, LSB',
    listenLink: '/music?category=liquid',
  },
  {
    slug: 'neurofunk',
    name: 'Neurofunk (Neuro)',
    short: 'Neurofunk',
    mood: 'Dark / technical',
    description:
      "Dark, futuristic, and technical — Neurofunk is defined by intricate sound design, precision basslines, and cinematic tension. It's the heaviest type of DnB.",
    characteristics: ['Complex sound design bass', 'Precision drum programming', 'Dark, sci-fi atmospheres', 'Technical production', 'Heavy sub-bass pressure'],
    forYouIf: 'You love heavy bass, detailed sound design, and dark, futuristic vibes.',
    artists: 'Noisia, Mefjus',
    roster: true,
    listenLink: '/neurofunk-dnb',
  },
  {
    slug: 'jump-up',
    name: 'Jump-Up DnB',
    short: 'Jump-Up',
    mood: 'Bouncy',
    description:
      "Bouncy, playful, and high-energy — Jump-Up focuses on big hooks, catchy basslines, and dancefloor-ready drops. It's festival-friendly and crowd-pleasing.",
    characteristics: ['Big, bouncy bass hooks', 'High dancefloor energy', 'Simple but effective drops', 'Playful and fun vibes', 'Crowd-friendly structure'],
    forYouIf: 'You want high energy, big festival vibes, and music that makes you move.',
    artists: 'DJ Hazard, Macky Gee',
    listenLink: '/music?category=jump-up',
  },
  {
    slug: 'jungle',
    name: 'Jungle',
    short: 'Jungle',
    mood: 'Raw / breakbeat',
    description:
      "Raw, breakbeat-driven, and rooted in reggae — Jungle is the predecessor to DnB from the early '90s. It features chopped breaks, dub influences, and organic energy.",
    characteristics: ['Chopped and screwed breaks', 'Reggae and dub influences', 'Raw, organic production', 'Bass pressure and weight', 'Classic samples'],
    forYouIf: 'You want the original sound, raw energy, and the roots of DnB culture.',
    artists: 'Shy FX, Congo Natty',
    listenLink: '/music?category=jungle',
  },
  {
    slug: 'techstep',
    name: 'Techstep',
    short: 'Techstep',
    mood: 'Minimal',
    description:
      "Minimal, robotic, and industrial — Techstep strips things back with tight drums, cold atmospheres, and driving sci-fi grooves. It's mechanical and precise.",
    characteristics: ['Minimal, stripped-back production', 'Cold, industrial atmospheres', 'Tight, mechanical drums', 'Driving sci-fi grooves', 'Robotic bass sounds'],
    forYouIf: 'You prefer darker, more minimal sounds with an industrial edge.',
    artists: 'Ed Rush & Optical',
    listenLink: '/music?category=techstep',
  },
  {
    slug: 'halftime',
    name: 'Halftime / 87 BPM',
    short: 'Halftime',
    mood: 'Heavy',
    description:
      'Heavy, spacious, and slower-feeling — Halftime keeps the DnB tempo (~174 BPM) but places drums in half-time, creating a heavy, head-nodding groove.',
    characteristics: ['Half-time drum patterns', 'Heavy, spacious grooves', 'Dark atmospheres', 'Slower-feeling at 174 BPM', 'Head-nodding rhythm'],
    forYouIf: 'You like heavy, slower-feeling beats with massive space and weight.',
    artists: null,
    listenLink: '/music?category=halftime',
  },
]

const COMPARISON = [
  { type: 'Liquid', slug: 'liquid', bpm: '174', energy: 'Low-Medium', mood: 'Melodic, Happy', complexity: 'Low', bestFor: 'New listeners' },
  { type: 'Neurofunk', slug: 'neurofunk', bpm: '174', energy: 'High', mood: 'Dark, Technical', complexity: 'High', bestFor: 'Bass heads' },
  { type: 'Jump-Up', slug: 'jump-up', bpm: '174', energy: 'Very High', mood: 'Playful, Bouncy', complexity: 'Low', bestFor: 'Festivals' },
  { type: 'Jungle', slug: 'jungle', bpm: '160-175', energy: 'Medium-High', mood: 'Raw, Organic', complexity: 'Medium', bestFor: 'Purists' },
  { type: 'Techstep', slug: 'techstep', bpm: '170-180', energy: 'Medium-High', mood: 'Cold, Industrial', complexity: 'High', bestFor: 'Minimalists' },
  { type: 'Halftime', slug: 'halftime', bpm: '174', energy: 'Medium', mood: 'Heavy, Dark', complexity: 'Medium', bestFor: 'Head-nodders' },
]

const FAQ = [
  {
    question: 'What are the main types of DnB?',
    answer:
      'The main types of DnB (Drum and Bass) are: Liquid (melodic), Neurofunk (dark/technical), Jump-Up (bouncy/high-energy), Jungle (raw/breakbeat), Techstep (minimal/industrial), and Halftime (heavy/slow-feeling). Most modern tracks blend elements from multiple types.',
  },
  {
    question: 'Which type of DnB is best for beginners?',
    answer:
      'Liquid DnB is generally best for beginners because of its melodic, accessible nature. Jump-Up is also beginner-friendly due to its fun, energetic vibe. If you love heavy bass and sound design, start with Neurofunk.',
  },
  {
    question: 'What is liquid DnB — and how is it different from "regular" DnB?',
    answer:
      'Liquid DnB is the smooth, melodic type of Drum and Bass: lush chords, atmospheric pads and often soulful vocals, at the same ~174 BPM as other DnB. It is not an alternative to DnB but one style inside it — the difference is the mood and sound design, not the tempo.',
  },
  {
    question: "What's the difference between Jungle and DnB?",
    answer:
      "Jungle is the earlier style from the early '90s featuring chopped breakbeats, reggae influences, and raw production. Drum and Bass evolved from Jungle, becoming more polished, production-focused, and expanding into many types like Liquid and Neurofunk.",
  },
  {
    question: 'How many types of drum and bass are there?',
    answer:
      'There are 6 main types of Drum and Bass: Liquid, Neurofunk, Jump-Up, Jungle, Techstep, and Halftime. However, many producers blend styles, and sub-subgenres exist (like "intelligent DnB" similar to Liquid, or "darkstep" related to Neurofunk).',
  },
  {
    question: 'What BPM are different types of DnB?',
    answer:
      'Most types of DnB run at 160-180 BPM (beats per minute), with 174 BPM being the standard. Jungle can be slightly slower (160-175 BPM), while Halftime maintains 174 BPM but feels slower due to half-time drum patterns.',
  },
]

const RELATED = [
  { href: '/how-to-produce-neurofunk', title: 'How to Make Neurofunk', text: 'Production guide in 7 steps' },
  { href: '/what-is-drum-and-bass', title: 'What is DnB?', text: 'Learn the basics of Drum and Bass' },
  { href: '/neurofunk-dnb', title: 'What is Neurofunk?', text: 'The darkest type of DnB' },
]

export default function TypesOfDnbPage() {
  const bpmOf = Object.fromEntries(COMPARISON.map((c) => [c.slug, c.bpm]))

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      image: ['https://dnbdoctor.com/og-image.jpg'],
      author: { '@type': 'Organization', name: 'DnB Doctor', url: 'https://dnbdoctor.com' },
      publisher: PUBLISHER,
      datePublished: '2024-01-01',
      dateModified: '2026-10-20',
      mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Types of Drum and Bass',
      itemListElement: TYPES.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.short, url: `${URL}#${t.slug}` })),
    },
    faqJsonLd(FAQ),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
        { '@type': 'ListItem', position: 2, name: 'Types of DnB', item: URL },
      ],
    },
  ]

  return (
    <article className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className={`${styles.wrap} ${styles.hero}`}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <span>Guides</span>{' '}
          <span aria-hidden="true">/</span> <span aria-current="page">Types of DnB</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> Complete guide {'//'} 6 styles
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>Types of</span>
            <span className={styles.solid}>DnB</span>
          </h1>
          <p className={styles.lede}>
            Complete guide to all Drum and Bass styles — from melodic Liquid to dark Neurofunk and raw Jungle.
          </p>
          <ul className={styles.toc} aria-label="In this guide">
            <li>
              <a href="#compare">Comparison table</a>
            </li>
            <li>
              <a href="#types">All types</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
          <div className={styles.ctas}>
            <a href="#types" className={styles.btn}>
              Explore DnB types <span aria-hidden="true">↓</span>
            </a>
            <a href="#compare" className={styles.btnGhost}>
              Compare subgenres
            </a>
          </div>
        </div>

        <aside className={styles.answer} aria-labelledby="quick-answer">
          <p className={styles.answerHead}>
            <span id="quick-answer">Quick answer</span>
            <span>The 6 main types</span>
          </p>
          <ol className={styles.index}>
            {TYPES.map((t, i) => (
              <li key={t.slug}>
                <a href={`#${t.slug}`}>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  <strong>{t.short}</strong>
                  <span>{t.mood}</span>
                </a>
              </li>
            ))}
          </ol>
          <p className={styles.answerText}>
            The 6 main <strong>types of DnB</strong> (Drum and Bass) are: Liquid (melodic), Neurofunk (dark/technical),
            Jump-Up (bouncy), Jungle (raw/breakbeat), Techstep (minimal), and Halftime (heavy). Most modern tracks blend
            multiple types.
          </p>
        </aside>
      </header>

      <GuideSection id="compare" n="01" label="Compare">
        <h2 className={styles.h2}>
          DnB types <em>comparison</em> table
        </h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">BPM</th>
                <th scope="col">Energy</th>
                <th scope="col">Mood</th>
                <th scope="col">Complexity</th>
                <th scope="col">Best for</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.type}>
                  <th scope="row">
                    <a href={`#${row.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {row.type}
                    </a>
                  </th>
                  <td className={styles.bpm}>{row.bpm}</td>
                  <td>{row.energy}</td>
                  <td>{row.mood}</td>
                  <td>{row.complexity}</td>
                  <td>{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.note}>
          What does 174 BPM actually mean? See <Link href="/dnb-bpm">DnB BPM explained</Link>.
        </p>
      </GuideSection>

      <div id="types">
        {TYPES.map((t, i) => (
          <GuideSection key={t.slug} id={t.slug} n={String(i + 2).padStart(2, '0')} label={t.short}>
            <h2 className={styles.h2}>{t.name}</h2>
            <ul className={styles.chips} aria-label={`${t.short} at a glance`}>
              <li>{bpmOf[t.slug]} BPM</li>
              <li>{t.mood}</li>
              {t.artists && <li>{t.artists}</li>}
              {'roster' in t && t.roster && (
                <li>
                  <Link href="/artists">DnB Doctor roster</Link>
                </li>
              )}
            </ul>
            <p>{t.description}</p>
            <div className={styles.box}>
              <h3 className={styles.boxTitle}>Key characteristics</h3>
              <ul className={styles.list}>
                {t.characteristics.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div className={styles.fit}>
              <b>Best for you if</b>
              <p style={{ margin: 0 }}>{t.forYouIf}</p>
            </div>
            <Link href={t.listenLink} className={t.slug === 'neurofunk' ? styles.btn : styles.btnGhost}>
              {t.slug === 'neurofunk' ? 'Listen to Neurofunk' : 'Browse DnB Doctor releases'} <span aria-hidden="true">→</span>
            </Link>
          </GuideSection>
        ))}
      </div>

      <GuideReleases heading="Hear the" accent="neuro side" text="Our lane is Neurofunk — the latest from the DnB Doctor lab." />

      <GuideSection id="faq" n="08" label="FAQ">
        <h2 className={styles.h2}>
          FAQ about <em>DnB types</em>
        </h2>
        <GuideFaq items={FAQ} />
      </GuideSection>

      <GuideSection n="09" label="Keep exploring">
        <h2 className={styles.h2}>
          Explore more <em data-tone="purple">DnB</em>
        </h2>
        <ul className={styles.tiles}>
          {RELATED.map((r) => (
            <li key={r.href}>
              <Link href={r.href}>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </GuideSection>
    </article>
  )
}
