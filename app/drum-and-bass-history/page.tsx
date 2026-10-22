import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideFaq, GuideReleases, GuideSection as Section, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import { DNB_BPM } from '@/app/components/guide/bpm'
import styles from '@/app/components/guide/guide.module.css'
import own from './history.module.css'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/drum-and-bass-history'
const TITLE = 'When Did Drum and Bass Start? History of DnB (1990s–Today)'
const DESCRIPTION =
  'Drum and bass started in early-’90s UK, growing out of jungle and breakbeat hardcore in London. Key dates from the Amen break and Goldie to techstep, liquid and neurofunk.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'History of drum and bass' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/og-image.jpg'] },
}

const bpm = (name: string) => DNB_BPM.find((r) => r.name === name)!.bpm

const TOC = [
  ['#key-dates', 'Key dates'],
  ['#jungle', 'Jungle'],
  ['#drum-and-bass', '’90s DnB'],
  ['#neurofunk', 'Neurofunk'],
  ['#global', 'Global'],
  ['#today', 'Today'],
  ['#faq', 'FAQ'],
] as const

const KEY_DATES = [
  ['1969', <>The Winstons release <strong>“Amen, Brother”</strong>. Its four-bar drum solo becomes the Amen break.</>],
  ['1988–93', <><strong>Fabio &amp; Grooverider</strong> play faster, darker breakbeat sets at Rage, Heaven in London.</>],
  ['1992–93', <>UK rave splits off: the breakbeat-and-bass sound gets its own name — <strong>jungle</strong>.</>],
  ['1994', <>Goldie – <strong>Inner City Life</strong> takes jungle from pirate radio towards the mainstream.</>],
  ['1995', <>Goldie releases the album <strong>Timeless</strong>; “drum and bass” replaces “jungle” as the umbrella name.</>],
  ['1996', <><strong>Hospital Records</strong> is founded in London.</>],
  ['1997', <>Roni Size / Reprazent win the <strong>Mercury Prize</strong> with <em>New Forms</em> — Bristol is on the map.</>],
  ['1998', <>Ed Rush &amp; Optical – <strong>Wormhole</strong>: the blueprint for <Link href="/neurofunk-dnb">neurofunk</Link>.</>],
  ['2000', <>Fabio&apos;s <strong>Liquid Funk</strong> compilation gives liquid drum and bass its name.</>],
  ['2003', <><strong>Noisia</strong> form in Groningen, Netherlands, and go on to define modern neurofunk.</>],
  ['2010s', <>DnB goes global: New Zealand, Czech Republic, Austria, Germany and Eastern Europe build their own scenes.</>],
  ['Today', <>Producers blend styles — <Link href="/types-of-dnb">dozens of subgenres</Link>, one tempo around 174 BPM.</>],
] as const

const SUBGENRES = [
  ['Liquid Funk', 'soulful, melodic', 'High Contrast, Calibre, London Elektricity'],
  ['Techstep', 'darker, industrial, robotic', 'Ed Rush & Optical, Trace, Dom & Roland'],
  ['Jump-Up', 'playful, rave-inspired', 'DJ Hazard, Macky Gee'],
] as const

const REGIONS = [
  ['UK', 'Hospital Records', 'brought DnB to festivals and live acts'],
  ['New Zealand', 'The Upbeats & State of Mind', 'led the Southern Hemisphere wave'],
  ['Czech Republic', 'Let It Roll Festival', 'one of the world’s largest DnB gatherings'],
] as const

const TRENDS = [
  ['Cinematic DnB', 'Hybrid Minds, Sub Focus'],
  ['Minimal & Deep', 'Alix Perez, Monty'],
  ['High-Energy Neurofunk', 'Gydra, Mefjus, DnB Doctor roster'],
  ['Experimental Fusions', 'Halogenix, IMANU, Visages'],
] as const

const FAQ = [
  {
    question: 'When did drum and bass start?',
    answer:
      'Drum and bass started in the early 1990s in the UK. Around 1992–93 the breakbeat side of the rave scene became known as jungle, and by the mid-’90s the cleaner, more engineered sound was called drum and bass.',
  },
  {
    question: 'Where was drum and bass invented?',
    answer:
      'In the UK — mainly London, at clubs like Rage and on pirate radio. Bristol was the second key city, with Roni Size, Krust and the Full Cycle crew.',
  },
  {
    question: 'Who invented drum and bass?',
    answer:
      'No single person. It grew out of a scene: DJs like Fabio & Grooverider, and producers such as Goldie, LTJ Bukem, Roni Size, DJ Hype and Shy FX shaped the first wave.',
  },
  {
    question: 'What is the difference between jungle and liquid DnB?',
    answer: `Jungle is the original early-’90s sound: chopped breakbeats like the Amen, reggae and dub basslines, ragga vocals. Liquid, named around 2000, is smooth and melodic, with soulful vocals, pads and clean rolling drums. Jungle sits around ${bpm('Jungle')} BPM, liquid around ${bpm('Liquid')} BPM.`,
  },
  {
    question: 'What is the Amen break?',
    answer:
      'A short drum solo from The Winstons’ 1969 track “Amen, Brother”. Sampled, sped up and chopped into new patterns, it became the most famous break in jungle and drum and bass.',
  },
]

function Chips({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <ul className={styles.chips} style={{ marginTop: '1.2rem' }} aria-label={label}>
      <li>{label}</li>
      {items.map((a) => (
        <li key={a}>{a}</li>
      ))}
    </ul>
  )
}

export default function DrumAndBassHistoryPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      url: URL,
      mainEntityOfPage: URL,
      image: 'https://dnbdoctor.com/og-image.jpg',
      datePublished: '2025-10-25',
      dateModified: '2026-10-21',
      author: PUBLISHER,
      publisher: PUBLISHER,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
        { '@type': 'ListItem', position: 2, name: 'What is DnB', item: 'https://dnbdoctor.com/what-is-drum-and-bass' },
        { '@type': 'ListItem', position: 3, name: 'History', item: URL },
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
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span>{' '}
          <Link href="/what-is-drum-and-bass">What is DnB</Link> <span aria-hidden="true">/</span>{' '}
          <span aria-current="page">History</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> The complete timeline {'//'} 1969 → today
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>History of</span>
            <span className={styles.solid}>Drum &amp; Bass</span>
          </h1>
          <p className={styles.lede}>
            Drum and Bass wasn&apos;t born overnight — it <strong>evolved from chaos, technology, and community</strong>.
            What began in small underground clubs of early &apos;90s London has become one of the most technically
            advanced and emotionally charged genres in electronic music.
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
            <Link href="/what-is-drum-and-bass" className={styles.btnGhost}>
              What is DnB?
            </Link>
          </div>
        </div>

        <aside className={styles.answer} aria-labelledby="quick-answer">
          <p className={styles.answerHead}>
            <span id="quick-answer">Quick answer</span>
            <span>DnB origins</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Started</dt>
              <dd>
                Early &apos;90s<small>jungle c. 1992–93</small>
              </dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>
                UK<small>London &amp; Bristol</small>
              </dd>
            </div>
            <div>
              <dt>Roots</dt>
              <dd>
                Jungle<small>breakbeat hardcore, sound systems</small>
              </dd>
            </div>
            <div>
              <dt>Name</dt>
              <dd>
                Mid-&apos;90s<small>“drum and bass” takes over</small>
              </dd>
            </div>
          </dl>
        </aside>
      </header>

      <Section id="key-dates" n="01" label="Timeline">
        <h2 className={styles.h2}>
          Key <em>dates</em>
        </h2>
        <p>
          Let&apos;s trace the story from <strong>jungle&apos;s raw beginnings</strong> to the{' '}
          <strong>modern precision of DnB and neurofunk</strong>.
        </p>
        <ol className={own.timeline}>
          {KEY_DATES.map(([year, text]) => (
            <li key={year}>
              <time>{year}</time>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="jungle" n="02" label="Jungle">
        <p className={own.period}>Late 1980s – Early 1990s</p>
        <h2 className={styles.h2}>
          The birth of <em>jungle</em>
        </h2>
        <p>
          Drum and Bass started with <strong>breakbeats</strong> — chopped-up drum loops from funk and soul records,
          especially the legendary <strong>&quot;Amen Break.&quot;</strong>
        </p>
        <p>
          When UK producers began speeding up these samples to 160–170 BPM and layering heavy basslines under them,{' '}
          <strong>jungle</strong> was born.
        </p>
        <p>
          It was the sound of multicultural Britain — <strong>Caribbean sound system culture</strong>,{' '}
          <strong>hip-hop sampling</strong>, and <strong>techno futurism</strong> colliding on dancefloors.
        </p>
        <Chips label="Influential early artists" items={['Goldie', 'LTJ Bukem', 'DJ Hype', 'Shy FX', 'Roni Size']} />
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Key track</h3>
          <p>
            <strong>Goldie – Inner City Life (1994)</strong> — a timeless anthem that bridged underground jungle with
            mainstream recognition.
          </p>
        </div>
      </Section>

      <Section id="drum-and-bass" n="03" label="DnB">
        <p className={own.period}>Mid–Late 1990s</p>
        <h2 className={styles.h2}>
          The rise of <em data-tone="purple">drum and bass</em>
        </h2>
        <p>As production tools improved, the jungle sound began to evolve — cleaner, tighter, more precise.</p>
        <p>
          The genre took a new name: <strong>Drum and Bass</strong>.
        </p>
        <p>
          Producers started focusing on <strong>engineering</strong> as much as musicality — perfecting mixdowns,
          layering sub frequencies, and defining modern DnB structure.
        </p>
        <ul className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))' }}>
          {SUBGENRES.map(([name, desc, artists]) => (
            <li key={name}>
              <span className={styles.tileTag}>{desc}</span>
              <h3>{name}</h3>
              <p>{artists}</p>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          How they sound today: <Link href="/types-of-dnb">types of DnB explained</Link>.
        </p>
      </Section>

      <Section id="neurofunk" n="04" label="Neuro">
        <p className={own.period}>2000s</p>
        <h2 className={styles.h2}>
          Neurofunk and the age of <em>precision</em>
        </h2>
        <p>
          In the early 2000s, producers pushed sound design to a new level — birthing <strong>Neurofunk</strong>.
        </p>
        <p>
          This subgenre took the structure of DnB and filled it with{' '}
          <strong>complex modulation, resampled basslines, and futuristic soundscapes</strong>.
        </p>
        <p>
          Neurofunk became the <strong>mechanical heartbeat</strong> of Drum and Bass — a dark, cerebral style focused
          on movement, depth, and detail.
        </p>
        <Chips label="Influential artists" items={['Ed Rush & Optical', 'Noisia', 'Phace', 'Black Sun Empire', 'Spor', 'Mefjus']} />
        <blockquote className={styles.quote}>&quot;If jungle was the rebel, neurofunk became the scientist.&quot;</blockquote>
        <p className={styles.note}>
          Go deeper: <Link href="/neurofunk-dnb">what is neurofunk</Link> ·{' '}
          <Link href="/how-to-produce-neurofunk">how to produce neurofunk</Link>.
        </p>
      </Section>

      <Section id="global" n="05" label="Global">
        <p className={own.period}>2010s</p>
        <h2 className={styles.h2}>
          Global <em data-tone="purple">expansion</em>
        </h2>
        <p>
          By the 2010s, Drum and Bass was everywhere — from <strong>main stages to bedrooms</strong>.
        </p>
        <p>
          Scenes exploded in <strong>New Zealand, Czech Republic, Austria, and Germany</strong>, where producers and
          labels built new ecosystems.
        </p>
        <p>
          DnB had become a <strong>global language</strong> — precise, emotional, and deeply communal.
        </p>
        <ul className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
          {REGIONS.map(([where, name, desc]) => (
            <li key={name}>
              <span className={styles.tileTag}>{where}</span>
              <h3>{name}</h3>
              <p>{desc}</p>
            </li>
          ))}
          <li>
            <span className={styles.tileTag}>Eastern Europe</span>
            <h3>Neurofunk wave</h3>
            <p className={own.inline}>
              Gydra, Teddy Killerz, Enei, <Link href="/artists/yehor">Yehor</Link>,{' '}
              <Link href="/artists/warp-fa2e">Warp Fa2e</Link>
            </p>
          </li>
        </ul>
        <p className={styles.note}>
          Where to find it today: <Link href="/neurofunk-labels">neurofunk labels</Link>.
        </p>
      </Section>

      <Section id="today" n="06" label="Today">
        <p className={own.period}>2020s – Today</p>
        <h2 className={styles.h2}>
          The modern <em>era</em>
        </h2>
        <p>Today, Drum and Bass is stronger than ever.</p>
        <p>
          Producers blend styles — <strong>liquid meets neuro</strong>, <strong>deep meets tech</strong>,{' '}
          <strong>organic meets digital</strong>.
        </p>
        <p>AI tools, modular synths, and advanced DAWs have made production more creative than ever.</p>
        <h3 className={styles.boxTitle} style={{ marginTop: '1.8rem' }}>
          Current trends
        </h3>
        <dl className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
          {TRENDS.map(([trend, artists]) => (
            <div key={trend}>
              <dt>{trend}</dt>
              <dd>{artists}</dd>
            </div>
          ))}
        </dl>

        <h3 className={styles.boxTitle} style={{ marginTop: '2.4rem' }}>
          Legacy
        </h3>
        <p>
          Drum and Bass has shaped <strong>film scores</strong>, <strong>video games</strong>,{' '}
          <strong>advertising</strong>, and <strong>club culture</strong>.
        </p>
        <p>
          It&apos;s influenced genres from dubstep to techno and remains one of the few electronic movements where{' '}
          <strong>artistry, innovation, and underground spirit</strong> still coexist.
        </p>
        <p>
          It&apos;s not nostalgia — <strong>it&apos;s evolution</strong>.
        </p>
        <p>
          DnB no longer belongs to one sound — it&apos;s a <strong>spectrum</strong>. What unites it is still the same
          force that started it all:
        </p>
        <p className={own.unites}>the drums and the bass</p>
      </Section>

      <GuideReleases heading="Hear it" accent="now" text="The newest chapter: latest neurofunk releases from DnB Doctor." />

      <Section id="faq" n="07" label="FAQ">
        <h2 className={styles.h2}>FAQ</h2>
        <GuideFaq items={FAQ} />
        <p className={styles.note}>
          Next: <Link href="/what-is-drum-and-bass">what is drum and bass</Link> ·{' '}
          <Link href="/dnb-bpm">DnB BPM</Link> · <Link href="/types-of-dnb">types of DnB</Link>
        </p>
      </Section>

      <section className={`${styles.wrap} ${styles.closing}`}>
        <blockquote>
          “From jungle to neurofunk, from vinyl to digital — <span>a story of rhythm, rebellion, and reinvention.</span>”
        </blockquote>
        <cite>— DnB Doctor</cite>
      </section>
    </article>
  )
}
