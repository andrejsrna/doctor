import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { spotifyPlaylistUrl, dnbDoctorSpotifyPlaylists } from '@/app/components/data/spotifyPlaylists'
import { GuideFaq, GuideReleases, GuideSection as Section, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import styles from '@/app/components/guide/guide.module.css'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/neurofunk-dnb'
const TITLE = 'What Is Neurofunk? Neurofunk DnB: BPM, Artists & Labels'
const DESCRIPTION =
  'Neurofunk is the dark, technical side of drum and bass: 172–175 BPM, modulated basslines and sci-fi atmospheres. Origins, key artists, labels, playlists and new releases.'

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | DnB Doctor` },
  description: DESCRIPTION,
  keywords:
    'neurofunk, neurofunk dnb, what is neurofunk, neurofunk drum and bass, neurofunk bpm, neurofunk artists, neurofunk labels, neurofunk playlist, techstep',
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/music-bg.jpeg', width: 1200, height: 630, alt: 'Neurofunk DnB guide' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/music-bg.jpeg'] },
}

const TOC = [
  ['#what', 'What is neurofunk'],
  ['#different', 'vs other DnB'],
  ['#artists', 'Artists & labels'],
  ['#listen', 'Playlists'],
  ['#faq', 'FAQ'],
] as const

const PIONEERS = [
  ['Ed Rush & Optical', 'Techstep pioneers — the dark, technical blueprint'],
  ['Matrix', 'Late-90s techstep and early neuro'],
  ['Dom & Roland', 'Heavy, mechanical drum & bass'],
  ['Noisia', 'Redefined neuro sound design and mixdown'],
  ['Phace', 'Surgical, experimental bass design'],
  ['Black Sun Empire', 'Dark, cinematic rollers'],
  ['Mefjus', 'Precision drums and complex bass'],
  ['Gydra', 'Modern neuro — groove, complexity and chaos'],
  ['Joe Ford', 'Modern neuro — groove, complexity and chaos'],
] as const

const LABELS = ['Eatbrain', 'Blackout', 'Darkshire', 'DnB Doctor', 'Neuropunk', 'Close2Death']

const FAQ = [
  {
    question: 'What is neurofunk drum & bass?',
    answer:
      'Neurofunk is a late-90s evolution of techstep drum & bass that blends 172–175 BPM drums with heavily modulated bass design, cinematic tension, and sci-fi atmospheres. Born from techstep pioneers like Ed Rush & Optical and Matrix & Futurebound, it focuses on resampling, precise mixdowns, and controlled aggression.',
  },
  {
    question: 'What BPM is neurofunk?',
    answer:
      'Neurofunk typically runs at 170–175 BPM (most often 172–175), the standard tempo for drum and bass. What sets it apart is not the tempo but the complex rhythmic patterns and the way the drums and bass interact to create rolling, hypnotic grooves.',
  },
  {
    question: 'How is neurofunk different from classic drum & bass?',
    answer:
      'Where liquid or jungle lean on melody and swing, neurofunk prioritizes mechanical groove, evolving basslines, and surgical sound design built for high-energy dancefloors: tighter drum programming with relentless drive, and bass layers that are constantly automated for movement.',
  },
  {
    question: 'Who are the pioneers of neurofunk?',
    answer:
      'Neurofunk was pioneered by artists like Ed Rush & Optical, Matrix, and Dom & Roland in the late 1990s. These producers introduced the dark, technical approach that would define the genre. Other key figures include Noisia, Phace, and Mefjus who have pushed the boundaries further.',
  },
  {
    question: 'Which neurofunk labels should I follow?',
    answer:
      'Start with Eatbrain, Blackout, and Darkshire, then dive into DnB Doctor and other independent crews pushing the underground forward. Follow local Prague, Brno, and Vienna collectives for fresh signings.',
  },
  {
    question: 'How can I get my neurofunk demo signed?',
    answer:
      'Focus on unique bass narratives, clean mixdowns, and memorable intros. Share finished versions and links (not file attachments) when sending demos, reference releases from the target label so the A&R hears the fit, and include socials and recent DJ support.',
  },
]

export default function NeurofunkDnbPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      image: ['https://dnbdoctor.com/music-bg.jpeg'],
      mainEntityOfPage: URL,
      dateModified: '2026-10-20',
      about: { '@type': 'Thing', name: 'Neurofunk', sameAs: 'https://en.wikipedia.org/wiki/Neurofunk' },
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
        { '@type': 'ListItem', position: 3, name: 'Neurofunk', item: URL },
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
          <span aria-hidden="true">/</span> <span aria-current="page">Neurofunk</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> The dark energy of drum and bass
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>Neurofunk</span>
            <span className={styles.solid}>DnB</span>
          </h1>
          <p className={styles.lede}>
            Neurofunk is a subgenre of <Link href="/what-is-drum-and-bass">drum and bass</Link> that emerged in the late
            1990s as a darker, more technical evolution of techstep — deep synthetic basslines, complex drum programming,
            and a futuristic, cinematic energy.
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
            <Link href="/neurofunk-spotify" className={styles.btnGhost}>
              Get the playlist
            </Link>
          </div>
        </div>

        <aside className={styles.answer} aria-labelledby="quick-answer">
          <p className={styles.answerHead}>
            <span id="quick-answer">Quick answer</span>
            <span>Neurofunk in 4 facts</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Tempo</dt>
              <dd>
                172–175<small>BPM</small>
              </dd>
            </div>
            <div>
              <dt>Born</dt>
              <dd>
                Late &apos;90s<small>out of techstep</small>
              </dd>
            </div>
            <div>
              <dt>Core</dt>
              <dd>
                Bass design<small>modulated, resampled</small>
              </dd>
            </div>
            <div>
              <dt>Mood</dt>
              <dd>
                Dark<small>technical, sci-fi</small>
              </dd>
            </div>
          </dl>
          <p className={styles.answerText}>
            <strong>Neurofunk</strong> is the dark, technical style of drum and bass: 172–175 BPM drums with heavily
            modulated bass design, cinematic tension and sci-fi atmospheres.
          </p>
        </aside>
      </header>

      <Section id="what" n="01" label="Definition">
        <h2 className={styles.h2}>
          What is <em>neurofunk</em> drum and bass?
        </h2>
        <p>
          Neurofunk is a subgenre of drum and bass that emerged in the late 1990s as a darker, more technical evolution of
          techstep. It&apos;s defined by deep synthetic basslines, complex drum programming, and a futuristic, cinematic
          energy that feels like the soundtrack of a dystopian world.
        </p>
        <p>
          Producers like <strong>Ed Rush &amp; Optical</strong>, <strong>Noisia</strong>, <strong>Phace</strong>, and{' '}
          <strong>Black Sun Empire</strong> shaped the foundation of the sound — pushing the boundaries of production and
          sound design with surgical precision and unmatched power.
        </p>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>What makes a good neurofunk track</h3>
          <ul className={styles.list}>
            <li>Rolling, complex drum patterns</li>
            <li>Deep, modulated basslines — constantly automated for movement</li>
            <li>Atmospheric pads and industrial sound design</li>
            <li>A hypnotic, rolling quality that keeps listeners engaged</li>
          </ul>
        </div>
      </Section>

      <Section id="different" n="02" label="vs other DnB">
        <h2 className={styles.h2}>
          Neurofunk vs <em data-tone="purple">other DnB</em>
        </h2>
        <p>
          Where liquid or jungle lean on melody and swing, neurofunk prioritizes mechanical groove, evolving basslines, and
          surgical sound design built for high-energy dancefloors.
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
              <tr>
                <th scope="row">Neurofunk</th>
                <td className={styles.bpm}>172–175</td>
                <td>Bass design, precision drums</td>
                <td>Dark, technical</td>
              </tr>
              <tr>
                <th scope="row">
                  <Link href="/types-of-dnb#liquid" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Liquid
                  </Link>
                </th>
                <td className={styles.bpm}>174</td>
                <td>Chords, vocals, atmosphere</td>
                <td>Melodic, emotional</td>
              </tr>
              <tr>
                <th scope="row">
                  <Link href="/types-of-dnb#jump-up" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Jump-Up
                  </Link>
                </th>
                <td className={styles.bpm}>174</td>
                <td>Big hooks, simple bass</td>
                <td>Bouncy, playful</td>
              </tr>
              <tr>
                <th scope="row">
                  <Link href="/types-of-dnb#techstep" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Techstep
                  </Link>
                </th>
                <td className={styles.bpm}>170–180</td>
                <td>Minimal, robotic grooves</td>
                <td>Cold, industrial</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={styles.note}>
          All six styles compared: <Link href="/types-of-dnb">Types of DnB</Link>.
        </p>

        <h3 className={styles.boxTitle} style={{ marginTop: '2.4rem' }}>
          The sound of modern neurofunk
        </h3>
        <p>
          Today, neurofunk continues to evolve with new generations of producers experimenting with hybrid sounds. Expect
          clean yet aggressive bass design, tight percussion, and progressive arrangements that balance chaos and control.
          Labels and artists are merging influences from techno, halftime, and cinematic music, creating a modern neurofunk
          sound that is both brutal and hypnotic.
        </p>
      </Section>

      <Section id="artists" n="03" label="Artists & labels">
        <h2 className={styles.h2}>
          Neurofunk <em>artists</em> &amp; labels
        </h2>
        <dl className={styles.tiles}>
          {PIONEERS.map(([name, note]) => (
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
        <div className={styles.ctas}>
          <Link href="/neurofunk-labels" className={styles.btnGhost}>
            Neurofunk labels guide <span aria-hidden="true">→</span>
          </Link>
          <Link href="/core-artists" className={styles.btnGhost}>
            DnB Doctor artists
          </Link>
        </div>
      </Section>

      <Section id="next-wave" n="04" label="DnB Doctor">
        <h2 className={styles.h2}>
          DnB Doctor &amp; the <em data-tone="purple">next wave</em>
        </h2>
        <p>
          At DnB Doctor, we celebrate the raw, futuristic side of drum and bass. Our releases focus on precision, depth, and
          storytelling — from dark rollers to experimental soundscapes that push the genre forward.
        </p>
        <p>
          Releases like <Link href="/music/yehor-where-do-we-go">Yehor – Where Do We Go</Link> and{' '}
          <Link href="/music/razerbeam-oblivion">Razerbeam – Oblivion</Link> represent this evolution: they combine emotional
          tension, cinematic layers, and the unmistakable neurofunk energy that hits both mind and body.
        </p>
      </Section>

      <GuideReleases heading="Fresh" accent="neurofunk" text="The latest releases from the DnB Doctor lab." />

      <Section id="listen" n="05" label="Playlists">
        <h2 className={styles.h2}>
          Stream <em>neurofunk</em>
        </h2>
        <p>
          Curated neurofunk selections from DnB Doctor — updated regularly with dark rollers, surgical tech, and underground
          cuts.
        </p>
        <ul className={styles.tiles}>
          {dnbDoctorSpotifyPlaylists.map((p) => (
            <li key={p.id}>
              <a href={spotifyPlaylistUrl(p.playlistId)} target="_blank" rel="noopener noreferrer">
                <span className={styles.tileTag}>Spotify playlist</span>
                <h3>{p.title} ↗</h3>
                <p>{p.description}</p>
              </a>
            </li>
          ))}
          <li>
            <Link href="/neurofunk-dnb-mixes">
              <span className={styles.tileTag}>DJ sets</span>
              <h3>Neurofunk DnB mixes</h3>
              <p>Dark drum &amp; bass sets from the DnB Doctor crew.</p>
            </Link>
          </li>
        </ul>
        <div className={styles.ctas}>
          <Link href="/neurofunk-spotify" className={styles.btn}>
            All playlists <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Section>

      <Section id="producers" n="06" label="Producers">
        <h2 className={styles.h2}>
          Make <em data-tone="purple">neurofunk</em>
        </h2>
        <ul className={styles.tiles}>
          <li>
            <Link href="/how-to-produce-neurofunk">
              <span className={styles.tileTag}>Guide</span>
              <h3>How to make neurofunk</h3>
              <p>Drums, bass design, arrangement and mixdown in 7 steps.</p>
            </Link>
          </li>
          <li>
            <Link href="/sample-packs">
              <span className={styles.tileTag}>Free download</span>
              <h3>Neurofunk sample packs</h3>
              <p>Free DnB Doctor sample packs to kickstart your productions.</p>
            </Link>
          </li>
          <li>
            <Link href="/submit-demo">
              <span className={styles.tileTag}>A&amp;R</span>
              <h3>Submit your demo</h3>
              <p>Finished a neuro track? Send it to DnB Doctor.</p>
            </Link>
          </li>
        </ul>
      </Section>

      <Section id="faq" n="07" label="FAQ">
        <h2 className={styles.h2}>
          Neurofunk <em>FAQ</em>
        </h2>
        <GuideFaq items={FAQ} />
      </Section>

      <section className={`${styles.wrap} ${styles.closing}`}>
        <blockquote>
          “Neurofunk isn&apos;t just a sound — it&apos;s an attitude. It connects people who love sound that{' '}
          <span>bites back.</span>”
        </blockquote>
        <cite>— DnB Doctor</cite>
      </section>
    </article>
  )
}
