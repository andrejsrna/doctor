import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideFaq, GuideReleases, GuideSection as Section, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import { DNB_BPM } from '@/app/components/guide/bpm'
import styles from '@/app/components/guide/guide.module.css'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/liquid-dnb'
const TITLE = 'What Is Liquid DnB? Liquid Drum and Bass Explained (BPM, Artists)'
const DESCRIPTION =
  'Liquid DnB is the smooth, melodic side of drum and bass: ~174 BPM rolling drums, warm bass, soulful vocals and lush chords. Liquid vs DnB vs jungle, artists, labels and FAQ.'

const bpm = (name: string) => DNB_BPM.find((r) => r.name === name)?.bpm ?? '170–176'

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | DnB Doctor` },
  description: DESCRIPTION,
  keywords:
    'liquid dnb, liquid drum and bass, what is liquid dnb, liquid funk, liquid dnb bpm, liquid dnb vs dnb, liquid dnb artists, liquid drum and bass labels, jungle vs liquid',
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'Liquid DnB guide' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/og-image.jpg'] },
}

const TOC = [
  ['#what', 'What is liquid'],
  ['#sound', 'The sound'],
  ['#vs', 'Liquid vs DnB'],
  ['#origins', 'Origins'],
  ['#artists', 'Artists & labels'],
  ['#faq', 'FAQ'],
] as const

const SOUND = [
  ['Drums', 'Rolling two-step breaks with crisp hats and ghost notes — driving, but never harsh'],
  ['Bass', 'Warm, round sub and soft mid-bass that supports the chords instead of fighting them'],
  ['Harmony', 'Jazz, soul and funk chords: Rhodes, pianos, strings and lush pads'],
  ['Vocals', 'Often soulful sung vocals or chopped vocal phrases'],
  ['Mood', 'Uplifting, emotional, nostalgic — music for headphones as much as for clubs'],
  ['Tempo', `${bpm('Liquid')} BPM, almost always 174`],
] as const

const COMPARE = [
  { style: 'Liquid', bpm: bpm('Liquid'), focus: 'Chords, vocals, warm bass', mood: 'Melodic, uplifting', href: null },
  { style: 'Dancefloor', bpm: bpm('Dancefloor'), focus: 'Big leads, vocal hooks, drops', mood: 'Euphoric, festival', href: '/types-of-dnb#dancefloor' },
  { style: 'Neurofunk', bpm: bpm('Neurofunk'), focus: 'Bass design, precision drums', mood: 'Dark, technical', href: '/neurofunk-dnb' },
  { style: 'Jungle', bpm: bpm('Jungle'), focus: 'Chopped Amen breaks, dub bass', mood: 'Raw, rhythmic', href: '/types-of-dnb#jungle' },
] as const

const ARTISTS = [
  ['Calibre', 'Deep, soulful rollers — a reference point for the whole style'],
  ['LSB', 'Warm, musical liquid with a classic feel'],
  ['Hybrid Minds', 'Emotional, vocal-led liquid'],
  ['High Contrast', 'Melodic, uplifting liquid with big hooks'],
  ['Netsky', 'Bright, catchy liquid that leans towards dancefloor'],
  ['London Elektricity', 'Jazzy, soulful drum and bass'],
  ['Logistics', 'Rolling, melodic liquid'],
  ['Etherwood', 'Atmospheric, dreamy liquid'],
] as const

const LABELS = ['Hospital Records', 'Liquicity', 'Fokuz Recordings', 'Spearhead Records', 'Soul:r', 'Creative Source']

const FAQ = [
  {
    question: 'What is liquid DnB?',
    answer:
      'Liquid DnB (liquid drum and bass, originally “liquid funk”) is the smooth, melodic style of drum and bass: rolling breakbeats at around 174 BPM combined with warm basslines, lush chords and often soulful vocals. It is the most accessible style of DnB for new listeners.',
  },
  {
    question: 'What BPM is liquid DnB?',
    answer: `Liquid sits at the same tempo as other drum and bass — usually ${bpm('Liquid')} BPM, most often exactly 174. It feels calmer because of the softer sounds and melodies, not because it is slower.`,
  },
  {
    question: 'What is the difference between liquid DnB and DnB?',
    answer:
      'Liquid is not an alternative to DnB but one style inside it. Same tempo and the same breakbeat roots; the difference is the sound: liquid uses melodic chords, soft bass and vocals, while styles like neurofunk or jump-up focus on aggressive bass and energy.',
  },
  {
    question: 'What is the difference between jungle and liquid?',
    answer: `Jungle is the early-’90s original: chopped Amen breaks, reggae and dub basslines, ragga vocals, often around ${bpm('Jungle')} BPM. Liquid, named around 1999–2000, is cleaner and more melodic, with smooth rolling drums and soulful harmony.`,
  },
  {
    question: 'Who started liquid drum and bass?',
    answer:
      'The name comes from DJ Fabio, who in 1999 began championing a new melodic sound he called “liquid funk” and released a compilation of the same name on his Creative Source label. Earlier musical drum and bass by artists like LTJ Bukem paved the way.',
  },
  {
    question: 'Who are the best liquid DnB artists to start with?',
    answer:
      'Calibre, LSB, Hybrid Minds, High Contrast, Netsky, London Elektricity, Logistics and Etherwood are good starting points. For labels, explore Hospital Records, Liquicity, Fokuz Recordings and Spearhead.',
  },
]

export default function LiquidDnbPage() {
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
      about: { '@type': 'Thing', name: 'Liquid drum and bass', sameAs: 'https://en.wikipedia.org/wiki/Liquid_drum_and_bass' },
      author: { '@type': 'Organization', name: 'DnB Doctor', url: 'https://dnbdoctor.com' },
      publisher: PUBLISHER,
    },
    faqJsonLd(FAQ),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
        { '@type': 'ListItem', position: 2, name: 'Types of DnB', item: 'https://dnbdoctor.com/types-of-dnb' },
        { '@type': 'ListItem', position: 3, name: 'Liquid DnB', item: URL },
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
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <Link href="/types-of-dnb">Types of DnB</Link>{' '}
          <span aria-hidden="true">/</span> <span aria-current="page">Liquid DnB</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> The melodic side of drum and bass
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>Liquid</span>
            <span className={styles.solid}>DnB</span>
          </h1>
          <p className={styles.lede}>
            Liquid DnB — short for liquid <Link href="/what-is-drum-and-bass">drum and bass</Link>, originally called
            liquid funk — is the smooth, melodic style of DnB: rolling breakbeats at ~174 BPM with warm bass, lush chords and
            soulful vocals.
          </p>
          <ul className={styles.toc} aria-label="In this guide">
            {TOC.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <div className={styles.ctas}>
            <Link href="/types-of-dnb" className={styles.btn}>
              All types of DnB <span aria-hidden="true">→</span>
            </Link>
            <Link href="/dnb-bpm" className={styles.btnGhost}>
              DnB BPM explained
            </Link>
          </div>
        </div>

        <aside className={styles.answer} aria-labelledby="quick-answer">
          <p className={styles.answerHead}>
            <span id="quick-answer">Quick answer</span>
            <span>Liquid in 4 facts</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Tempo</dt>
              <dd>
                174<small>BPM, like all DnB</small>
              </dd>
            </div>
            <div>
              <dt>Named</dt>
              <dd>
                1999<small>“liquid funk”, DJ Fabio</small>
              </dd>
            </div>
            <div>
              <dt>Core</dt>
              <dd>
                Melody<small>chords, pads, vocals</small>
              </dd>
            </div>
            <div>
              <dt>Mood</dt>
              <dd>
                Uplifting<small>smooth, emotional</small>
              </dd>
            </div>
          </dl>
          <p className={styles.answerText}>
            <strong>Liquid DnB</strong> is drum and bass with the edges smoothed off: the same fast, rolling drums, but
            built around melody and soul instead of aggressive bass.
          </p>
        </aside>
      </header>

      <Section id="what" n="01" label="Definition">
        <h2 className={styles.h2}>
          What is <em>liquid</em> drum and bass?
        </h2>
        <p>
          Liquid drum and bass is a style of DnB that puts <strong>musicality</strong> first. The drums still roll at{' '}
          <Link href="/dnb-bpm">174 BPM</Link>, but instead of distorted, aggressive basslines the track is carried by{' '}
          <strong>warm bass, jazz and soul chords, atmospheric pads and vocals</strong>. The result feels lighter and more
          emotional — which is why liquid is often the first style people fall for.
        </p>
        <p>
          You will also see it written as <strong>liquid funk</strong>, <strong>liquid DnB</strong> or simply{' '}
          <strong>liquid</strong>. They all mean the same thing.
        </p>
      </Section>

      <Section id="sound" n="02" label="The sound">
        <h2 className={styles.h2}>
          What liquid DnB <em data-tone="purple">sounds like</em>
        </h2>
        <dl className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
          {SOUND.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="vs" n="03" label="Liquid vs DnB">
        <h2 className={styles.h2}>
          Liquid DnB vs <em>DnB</em>
        </h2>
        <p>
          Liquid is not a separate genre — it is <strong>one style inside drum and bass</strong>. The tempo and the
          breakbeat roots are the same; what changes is the sound palette and the mood.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Style</th>
                <th scope="col">BPM</th>
                <th scope="col">Focus</th>
                <th scope="col">Mood</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.style}>
                  <th scope="row">{r.href ? <Link href={r.href}>{r.style}</Link> : r.style}</th>
                  <td className={styles.bpm}>{r.bpm}</td>
                  <td>{r.focus}</td>
                  <td>{r.mood}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Jungle vs liquid</h3>
          <p>
            Jungle is the raw early-&apos;90s original: chopped Amen breaks, reggae and dub basslines, ragga vocals.
            Liquid arrived later and is cleaner and smoother — tight rolling drums under soulful harmony. Jungle is about
            the break; liquid is about the melody.
          </p>
        </div>
        <p className={styles.note}>
          All seven styles side by side: <Link href="/types-of-dnb">Types of DnB</Link>.
        </p>
      </Section>

      <Section id="origins" n="04" label="Origins">
        <h2 className={styles.h2}>
          Where liquid <em data-tone="purple">came from</em>
        </h2>
        <p>
          Melodic drum and bass existed from the mid-&apos;90s — LTJ Bukem and the atmospheric sound of his Good Looking
          label are an obvious ancestor. The name came in <strong>1999</strong>, when DJ <strong>Fabio</strong> began
          championing a soulful new strand he called <strong>“liquid funk”</strong> and released a compilation of the same
          name on his Creative Source label. Through the 2000s, labels like <strong>Hospital Records</strong> took the
          sound to a much wider audience.
        </p>
        <p>
          More on the roots: <Link href="/drum-and-bass-history">the history of drum and bass</Link>.
        </p>
      </Section>

      <Section id="artists" n="05" label="Artists & labels">
        <h2 className={styles.h2}>
          Liquid DnB <em>artists</em> &amp; labels
        </h2>
        <dl className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
          {ARTISTS.map(([name, note]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{note}</dd>
            </div>
          ))}
        </dl>
        <h3 className={styles.boxTitle} style={{ marginTop: '2.4rem' }}>
          Labels to follow
        </h3>
        <ul className={styles.chips} style={{ marginTop: '0.6rem' }}>
          {LABELS.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p className={styles.note}>
          Prefer it darker? DnB Doctor is a <Link href="/neurofunk-dnb">neurofunk</Link> label — see the{' '}
          <Link href="/neurofunk-labels">neurofunk labels guide</Link>.
        </p>
      </Section>

      <GuideReleases heading="Fresh" accent="DnB" text="The latest drum and bass releases from DnB Doctor." />

      <Section id="next" n="06" label="Keep exploring">
        <h2 className={styles.h2}>
          Keep <em data-tone="purple">exploring</em>
        </h2>
        <ul className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
          <li>
            <Link href="/types-of-dnb">
              <span className={styles.tileTag}>Guide</span>
              <h3>Types of DnB</h3>
              <p>Liquid, dancefloor, neurofunk, jump-up, jungle, techstep and halftime compared.</p>
            </Link>
          </li>
          <li>
            <Link href="/dnb-bpm">
              <span className={styles.tileTag}>Tempo</span>
              <h3>DnB BPM explained</h3>
              <p>Why 174, halftime and BPM by subgenre.</p>
            </Link>
          </li>
          <li>
            <Link href="/neurofunk-dnb">
              <span className={styles.tileTag}>The dark side</span>
              <h3>What is neurofunk?</h3>
              <p>The technical, bass-heavy opposite of liquid.</p>
            </Link>
          </li>
          <li>
            <Link href="/sample-packs">
              <span className={styles.tileTag}>Producers</span>
              <h3>DnB sample packs</h3>
              <p>A free neurofunk sample pack plus pro packs from DnB Doctor artists.</p>
            </Link>
          </li>
        </ul>
      </Section>

      <Section id="faq" n="07" label="FAQ">
        <h2 className={styles.h2}>
          Liquid DnB <em>FAQ</em>
        </h2>
        <GuideFaq items={FAQ} />
      </Section>

      <section className={`${styles.wrap} ${styles.closing}`}>
        <blockquote>
          “Same tempo, same breaks — liquid just lets the <span>melody</span> lead.”
        </blockquote>
        <cite>— DnB Doctor</cite>
      </section>
    </article>
  )
}
