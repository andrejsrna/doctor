import type { Metadata } from 'next'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideFaq, GuideReleases, GuideSection, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import { DNB_BPM } from '@/app/components/guide/bpm'
import styles from '@/app/components/guide/guide.module.css'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/types-of-dnb'
const TITLE = 'Types of DnB: 7 Drum and Bass Subgenres Compared'
const DESCRIPTION =
  'All DnB subgenres explained: Liquid, Dancefloor, Neurofunk, Jump-Up, Jungle, Techstep and Halftime — how each type sounds, with BPM, mood, key artists and labels.'

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

/** BPM per style comes from the shared table, so /dnb-bpm and this guide never disagree. */
const bpm = (name: string) => DNB_BPM.find((r) => r.name === name)!.bpm

type DnbType = {
  slug: string
  name: string
  short: string
  bpmKey: string
  mood: string
  description: string
  characteristics: string[]
  forYouIf: string
  artists: string[]
  labels: string[]
  roster?: boolean
  more?: { href: string; text: string }
}

const TYPES: DnbType[] = [
  {
    slug: 'liquid',
    name: 'Liquid DnB',
    short: 'Liquid',
    bpmKey: 'Liquid',
    mood: 'Melodic',
    description:
      "Smooth, melodic, and emotional — Liquid DnB focuses on lush chords, atmospheric pads, and often features soulful vocals. It's the most accessible type of DnB for newcomers.",
    characteristics: ['Melodic chords and atmospheres', 'Vocals and singing', 'Rolling but gentle drums', 'Warm basslines', 'Same ~174 BPM as other DnB'],
    forYouIf: 'You enjoy melodic electronic music, trance, or house and want an easy entry into DnB.',
    artists: ['Calibre', 'LSB', 'Hybrid Minds', 'Netsky'],
    labels: ['Hospital Records', 'Liquicity', 'Fokuz Recordings'],
    more: { href: '/drum-and-bass-history#faq', text: 'Jungle vs liquid' },
  },
  {
    slug: 'dancefloor',
    name: 'Dancefloor DnB',
    short: 'Dancefloor',
    bpmKey: 'Dancefloor',
    mood: 'Big / euphoric',
    description:
      'Polished, punchy, and built for big rooms — Dancefloor DnB sits between liquid and the heavier styles: driving drums, big synth leads and rolling basslines, often with vocal hooks. It is the sound of festival main stages and the style most likely to cross into the charts.',
    characteristics: ['Big synth leads and hooks', 'Punchy, driving drums', 'Rolling, energetic basslines', 'Polished, loud mixdowns', 'Build-ups and big drops'],
    forYouIf: 'You want the festival main-stage feeling: big, euphoric, and easy to dance to.',
    artists: ['Sub Focus', 'Dimension', 'Wilkinson', 'Culture Shock', 'Camo & Krooked'],
    labels: ['RAM Records', 'Hospital Records'],
  },
  {
    slug: 'neurofunk',
    name: 'Neurofunk (Neuro)',
    short: 'Neurofunk',
    bpmKey: 'Neurofunk',
    mood: 'Dark / technical',
    description:
      "Dark, futuristic, and technical — Neurofunk is defined by intricate sound design, precision basslines, and cinematic tension. It's one of the darkest and most technical types of DnB.",
    characteristics: ['Complex sound design bass', 'Precision drum programming', 'Dark, sci-fi atmospheres', 'Technical production', 'Heavy sub-bass pressure'],
    forYouIf: 'You love heavy bass, detailed sound design, and dark, futuristic vibes.',
    artists: ['Noisia', 'Mefjus', 'Phace', 'Black Sun Empire'],
    labels: ['Eatbrain', 'Blackout Music NL', 'Vision Recordings', 'DnB Doctor'],
    roster: true,
    more: { href: '/neurofunk-labels', text: 'Neurofunk labels guide' },
  },
  {
    slug: 'jump-up',
    name: 'Jump-Up DnB',
    short: 'Jump-Up',
    bpmKey: 'Jump-Up',
    mood: 'Bouncy',
    description:
      "Bouncy, playful, and high-energy — Jump-Up focuses on big hooks, catchy basslines, and dancefloor-ready drops. It's rave-friendly and crowd-pleasing.",
    characteristics: ['Big, bouncy bass hooks', 'High rave energy', 'Simple but effective drops', 'Playful and fun vibes', 'Crowd-friendly structure'],
    forYouIf: 'You want high energy, wobbly bass riffs, and music that makes you jump.',
    artists: ['DJ Hazard', 'Macky Gee', 'Kanine', 'Bladerunner'],
    labels: ['Playaz', 'Low Down Deep'],
  },
  {
    slug: 'jungle',
    name: 'Jungle',
    short: 'Jungle',
    bpmKey: 'Jungle',
    mood: 'Raw / breakbeat',
    description:
      "Raw, breakbeat-driven, and rooted in reggae — Jungle is the predecessor to DnB from the early '90s. It features chopped breaks, dub influences, and organic energy.",
    characteristics: ['Chopped, rearranged breakbeats (Amen)', 'Reggae and dub influences', 'Raw, organic production', 'Bass pressure and weight', 'Ragga vocals and classic samples'],
    forYouIf: 'You want the original sound, raw energy, and the roots of DnB culture.',
    artists: ['Shy FX', 'Congo Natty', 'DJ Hype', 'Remarc'],
    labels: ['Reinforced', 'Suburban Base', 'Congo Natty'],
    more: { href: '/drum-and-bass-history#jungle', text: 'History of jungle' },
  },
  {
    slug: 'techstep',
    name: 'Techstep',
    short: 'Techstep',
    bpmKey: 'Techstep',
    mood: 'Minimal',
    description:
      "Minimal, robotic, and industrial — Techstep strips things back with tight drums, cold atmospheres, and driving sci-fi grooves. Born in the mid-'90s, it laid the groundwork for neurofunk.",
    characteristics: ['Minimal, stripped-back production', 'Cold, industrial atmospheres', 'Tight, mechanical drums', 'Driving sci-fi grooves', 'Robotic bass sounds'],
    forYouIf: 'You prefer darker, more minimal sounds with an industrial edge.',
    artists: ['Ed Rush & Optical', 'Bad Company', 'Dom & Roland', 'Trace'],
    labels: ['Virus Recordings', 'No U-Turn'],
    more: { href: '/drum-and-bass-history#drum-and-bass', text: "Techstep in the '90s" },
  },
  {
    slug: 'halftime',
    name: 'Halftime (87 / 174 BPM)',
    short: 'Halftime',
    bpmKey: 'Halftime',
    mood: 'Heavy',
    description:
      'Heavy, spacious, and slower-feeling — Halftime keeps the DnB tempo (~174 BPM) but places the snare on every third beat, so the groove nods along at ~87 BPM.',
    characteristics: ['Half-time drum patterns', 'Heavy, spacious grooves', 'Dark atmospheres', 'Slower-feeling at 174 BPM', 'Head-nodding rhythm'],
    forYouIf: 'You like heavy, slower-feeling beats with massive space and weight.',
    artists: ['Ivy Lab', 'Alix Perez'],
    labels: ['20/20 LDN', '1985 Music'],
    more: { href: '/dnb-bpm', text: 'Halftime and BPM explained' },
  },
]

const COMPARISON = [
  { type: 'Liquid', slug: 'liquid', energy: 'Low-Medium', mood: 'Melodic, Uplifting', complexity: 'Low', bestFor: 'New listeners' },
  { type: 'Dancefloor', slug: 'dancefloor', energy: 'High', mood: 'Euphoric, Big', complexity: 'Medium', bestFor: 'Main stages' },
  { type: 'Neurofunk', slug: 'neurofunk', energy: 'High', mood: 'Dark, Technical', complexity: 'High', bestFor: 'Bass heads' },
  { type: 'Jump-Up', slug: 'jump-up', energy: 'Very High', mood: 'Playful, Bouncy', complexity: 'Low', bestFor: 'Ravers' },
  { type: 'Jungle', slug: 'jungle', energy: 'Medium-High', mood: 'Raw, Organic', complexity: 'Medium', bestFor: 'Purists' },
  { type: 'Techstep', slug: 'techstep', energy: 'Medium-High', mood: 'Cold, Industrial', complexity: 'High', bestFor: 'Minimalists' },
  { type: 'Halftime', slug: 'halftime', energy: 'Medium', mood: 'Heavy, Dark', complexity: 'Medium', bestFor: 'Head-nodders' },
]

const FAQ = [
  {
    question: 'What are the main types of DnB?',
    answer:
      'The main types of DnB (Drum and Bass) are: Liquid (melodic), Dancefloor (big, festival-ready), Neurofunk (dark/technical), Jump-Up (bouncy/high-energy), Jungle (raw/breakbeat), Techstep (minimal/industrial), and Halftime (heavy/slow-feeling). Most modern tracks blend elements from multiple types.',
  },
  {
    question: 'Which type of DnB is best for beginners?',
    answer:
      'Liquid DnB is generally best for beginners because of its melodic, accessible nature. Dancefloor DnB — the big festival sound of artists like Sub Focus or Wilkinson — is just as easy to get into. If you love heavy bass and sound design, start with Neurofunk.',
  },
  {
    question: 'What is dancefloor DnB?',
    answer:
      'Dancefloor drum and bass is the polished, main-stage side of DnB: punchy drums, big synth leads, rolling basslines and often vocal hooks. It sits between liquid and the heavier styles. Typical artists are Sub Focus, Dimension, Wilkinson and Culture Shock; RAM Records is one of its home labels.',
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
      'This guide covers 7 main types of Drum and Bass: Liquid, Dancefloor, Neurofunk, Jump-Up, Jungle, Techstep, and Halftime. Many producers blend styles, and smaller sub-styles exist (like "intelligent DnB" close to Liquid, or "darkstep" related to Neurofunk).',
  },
  {
    question: 'What BPM are different types of DnB?',
    answer: `Most types of DnB sit at ${bpm('Drum & Bass')} BPM, with 174 BPM being the standard. Jungle can be slower (${bpm('Jungle')} BPM), Techstep goes up to ${bpm('Techstep').split('–')[1]}, and Halftime keeps ~174 BPM but feels like ~87 because of its half-time drum pattern.`,
  },
]

const RELATED = [
  { href: '/what-is-drum-and-bass', title: 'What is DnB?', text: 'Learn the basics of Drum and Bass' },
  { href: '/drum-and-bass-history', title: 'History of DnB', text: 'From jungle to neurofunk, 1969 → today' },
  { href: '/neurofunk-dnb', title: 'What is Neurofunk?', text: 'The darkest type of DnB' },
  { href: '/how-to-produce-neurofunk', title: 'How to Make Neurofunk', text: 'Production guide in 7 steps' },
]

function Chips({ label, items }: { label: string; items: string[] }) {
  return (
    <ul className={styles.chips} style={{ margin: '0.6rem 0 0' }} aria-label={label}>
      <li>{label}</li>
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  )
}

export default function TypesOfDnbPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      image: ['https://dnbdoctor.com/og-image.jpg'],
      author: { '@type': 'Organization', name: 'DnB Doctor', url: 'https://dnbdoctor.com' },
      publisher: PUBLISHER,
      datePublished: '2026-05-01',
      dateModified: '2026-10-22',
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
            <span className={styles.dot} aria-hidden="true" /> Complete guide {'//'} 7 styles
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>Types of</span>
            <span className={styles.solid}>DnB</span>
          </h1>
          <p className={styles.lede}>
            Complete guide to all Drum and Bass styles — from melodic Liquid and big-room Dancefloor to dark Neurofunk and raw Jungle, with the artists and labels to start with.
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
            <span>The 7 main types</span>
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
            The 7 main <strong>types of DnB</strong> (Drum and Bass) are: Liquid (melodic), Dancefloor (big, festival),
            Neurofunk (dark/technical), Jump-Up (bouncy), Jungle (raw/breakbeat), Techstep (minimal), and Halftime
            (heavy). Most modern tracks blend multiple types.
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
                  <td className={styles.bpm}>{bpm(row.type)}</td>
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
              <li>{bpm(t.bpmKey)} BPM</li>
              <li>{t.mood}</li>
              {t.roster && (
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
            <div className={styles.box}>
              <h3 className={styles.boxTitle}>Where to start</h3>
              <Chips label="Artists" items={t.artists} />
              <Chips label="Labels" items={t.labels} />
            </div>
            <div className={styles.fit}>
              <b>Best for you if</b>
              <p style={{ margin: 0 }}>{t.forYouIf}</p>
            </div>
            {t.slug === 'neurofunk' ? (
              <div className={styles.ctas}>
                <Link href="/neurofunk-dnb" className={styles.btn}>
                  Listen to Neurofunk <span aria-hidden="true">→</span>
                </Link>
                {t.more && (
                  <Link href={t.more.href} className={styles.btnGhost}>
                    {t.more.text}
                  </Link>
                )}
              </div>
            ) : (
              t.more && (
                <Link href={t.more.href} className={styles.btnGhost}>
                  {t.more.text} <span aria-hidden="true">→</span>
                </Link>
              )
            )}
          </GuideSection>
        ))}
      </div>

      <GuideReleases heading="Hear the" accent="neuro side" text="Our lane is Neurofunk — the latest from the DnB Doctor lab." />

      <GuideSection id="faq" n="09" label="FAQ">
        <h2 className={styles.h2}>
          FAQ about <em>DnB types</em>
        </h2>
        <GuideFaq items={FAQ} />
      </GuideSection>

      <GuideSection n="10" label="Keep exploring">
        <h2 className={styles.h2}>
          Explore more <em data-tone="purple">DnB</em>
        </h2>
        <ul className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
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
