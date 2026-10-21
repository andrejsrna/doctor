import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideFaq, GuideReleases, GuideRoster, GuideSection as Section, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import { spotifyPlaylistEmbedUrl, spotifyPlaylistUrl } from '@/app/components/data/spotifyPlaylists'
import { djLinks } from '@/lib/affiliates'
import styles from '@/app/components/guide/guide.module.css'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/neurofunk-spotify'
const TITLE = 'Neurofunk Playlists on Spotify: 6 Best Neurofunk DnB Playlists'
const DESCRIPTION =
  'The best neurofunk playlists on Spotify: the monthly DnB Doctor selection, the label playlist, Eatbrain’s Premier Neurofunk and more hard DnB picks.'

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | DnB Doctor` },
  description: DESCRIPTION,
  keywords: 'neurofunk spotify, neurofunk playlist, neurofunk playlists spotify, dnb spotify playlist, drum and bass playlist, hard dnb playlist',
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'Neurofunk playlists on Spotify' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/og-image.jpg'] },
}

const TOC = [
  ['#ours', 'DnB Doctor playlists'],
  ['#recommended', 'More neurofunk playlists'],
  ['#artists', 'Artists you’ll hear'],
  ['#get-on', 'Get on the playlist'],
  ['#more', 'Beyond Spotify'],
  ['#faq', 'FAQ'],
] as const

/** auto-fit: no empty filler cells when a row isn't full */
const FIT = { gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))' }

const MONTHLY = '5VPtC2C3IO8r9oFT3Jzj15'
const LABEL = '2GD72ly17HcWc9OAEtdUBP'

const OURS = [
  {
    id: MONTHLY,
    tag: 'Updated monthly',
    name: 'Monthly Neurofunk Selection',
    text: 'Our hand-picked neurofunk of the month — new label releases next to the freshest tracks from the wider scene. Renamed every month (now “Neurofunk DnB Playlist – 10/26”).',
  },
  {
    id: LABEL,
    tag: 'Label playlist',
    name: 'Neurofunk by DnB Doctor',
    text: 'Tracks released on DnB Doctor — from YEHOR, Asana and Warp Fa2e to the newest names on the roster.',
  },
] as const

/** Third-party playlists — names and curators as shown on Spotify (Oct 2026). */
const RECOMMENDED = [
  { id: '6PLall5kR62hTs9QP4FXLr', name: 'Premier Neurofunk by EATBRAIN', curator: 'Eatbrain', note: 'Label-curated neurofunk from one of the genre’s key labels' },
  { id: '0Po1Xhn50bsrQwyjXWMMKJ', name: 'NEUROFUNK 2026', curator: 'NDBM', note: 'This year’s neurofunk releases' },
  { id: '3krCJBEYkHDS8RCrM4Q1kV', name: 'HARD DNB / NEUROFUNK', curator: 'Julez', note: 'Neurofunk mixed with harder DnB' },
  { id: '74qpkWDhdxOnzhlV1podBN', name: 'NEUROFUNK BANGERS', curator: 'Wendie Dufi', note: 'Big, dancefloor-focused neuro' },
] as const

const FAQ = [
  {
    question: 'What is the best neurofunk playlist on Spotify?',
    answer:
      'For new music, the DnB Doctor Monthly Neurofunk Selection and NEUROFUNK 2026 track the latest releases. For a label-curated overview of the genre, Premier Neurofunk by Eatbrain is a strong start.',
  },
  {
    question: 'How often is the DnB Doctor neurofunk playlist updated?',
    answer: 'The Monthly Neurofunk Selection is refreshed every month. The label playlist grows whenever a new DnB Doctor release comes out.',
  },
  {
    question: 'How do I get my track on a DnB Doctor playlist?',
    answer:
      'Tracks released on DnB Doctor go into the label playlist. Send your finished neurofunk track through the demo submission form — there is no paid placement.',
  },
  {
    question: 'Is neurofunk the same as hard DnB?',
    answer:
      'Not quite. Neurofunk is defined by technical, heavily designed basslines and tight drums. “Hard DnB” playlists usually mix neurofunk with jump-up and other heavy styles.',
  },
  {
    question: 'Where else can I listen to DnB Doctor?',
    answer: 'Releases are on all major stores and streaming services. Premieres and visuals are on YouTube, and DJ sets are on the neurofunk mixes page.',
  },
]

export default function NeurofunkSpotifyPage() {
  const all = [...OURS.map((p) => ({ id: p.id, name: p.name })), ...RECOMMENDED.map((p) => ({ id: p.id, name: p.name }))]
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      image: ['https://dnbdoctor.com/og-image.jpg'],
      mainEntityOfPage: URL,
      datePublished: '2025-10-16',
      dateModified: '2026-10-21',
      author: { '@type': 'Organization', name: 'DnB Doctor', url: 'https://dnbdoctor.com' },
      publisher: PUBLISHER,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Neurofunk playlists on Spotify',
      itemListElement: all.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: spotifyPlaylistUrl(p.id) })),
    },
    faqJsonLd(FAQ),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
        { '@type': 'ListItem', position: 2, name: 'Neurofunk', item: 'https://dnbdoctor.com/neurofunk-dnb' },
        { '@type': 'ListItem', position: 3, name: 'Spotify playlists', item: URL },
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
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <Link href="/neurofunk-dnb">Neurofunk</Link>{' '}
          <span aria-hidden="true">/</span> <span aria-current="page">Spotify playlists</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> Curated {'//'} updated monthly
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>Neurofunk</span>
            <span className={styles.solid}>playlists</span>
          </h1>
          <p className={styles.lede}>
            The best <strong>neurofunk playlists on Spotify</strong> in one place: our own monthly selection and label playlist,
            plus four playlists from the wider scene worth following — dark, technical <Link href="/neurofunk-dnb">neurofunk drum &amp; bass</Link> at 174 BPM.
          </p>
          <ul className={styles.toc} aria-label="On this page">
            {TOC.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <div className={styles.ctas}>
            <a href={spotifyPlaylistUrl(MONTHLY)} target="_blank" rel="noopener noreferrer" className={styles.btn}>
              Follow the monthly playlist <span aria-hidden="true">↗</span>
            </a>
            <Link href="/music" className={styles.btnGhost}>
              Latest releases
            </Link>
          </div>
        </div>

        <aside className={styles.answer} aria-labelledby="quick-answer">
          <p className={styles.answerHead}>
            <span id="quick-answer">Quick answer</span>
            <span>Where to start</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>New every month</dt>
              <dd>
                Monthly Selection<small>DnB Doctor</small>
              </dd>
            </div>
            <div>
              <dt>Label releases</dt>
              <dd>
                Neurofunk by DnB Doctor<small>all label tracks</small>
              </dd>
            </div>
            <div>
              <dt>Genre overview</dt>
              <dd>
                Premier Neurofunk<small>Eatbrain</small>
              </dd>
            </div>
            <div>
              <dt>This year</dt>
              <dd>
                NEUROFUNK 2026<small>NDBM</small>
              </dd>
            </div>
          </dl>
        </aside>
      </header>

      <Section id="ours" n="01" label="DnB Doctor playlists">
        <h2 className={styles.h2}>
          DnB Doctor <em>playlists</em>
        </h2>
        <ul className={styles.tiles} style={FIT}>
          {OURS.map((p) => (
            <li key={p.id}>
              <a href={spotifyPlaylistUrl(p.id)} target="_blank" rel="noopener noreferrer">
                <span className={styles.tileTag}>{p.tag}</span>
                <h3>{p.name} ↗</h3>
                <p>{p.text}</p>
              </a>
            </li>
          ))}
        </ul>
        <iframe
          title="Monthly Neurofunk Selection on Spotify"
          src={spotifyPlaylistEmbedUrl(MONTHLY)}
          width="100%"
          height="352"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          style={{ border: 0, marginTop: '1.6rem', display: 'block' }}
        />
        <p className={styles.note}>Tip: follow DnB Doctor on Spotify and new label releases land in your Release Radar.</p>
      </Section>

      <Section id="recommended" n="02" label="More playlists">
        <h2 className={styles.h2}>
          More neurofunk <em data-tone="purple">playlists</em>
        </h2>
        <p>Not ours, but worth a follow. Each one leans a little differently — from label-curated neuro to harder, rave-focused selections.</p>
        <ul className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
          {RECOMMENDED.map((p) => (
            <li key={p.id}>
              <a href={spotifyPlaylistUrl(p.id)} target="_blank" rel="noopener noreferrer">
                <span className={styles.tileTag}>by {p.curator}</span>
                <h3>{p.name} ↗</h3>
                <p>{p.note}</p>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="artists" n="03" label="Artists">
        <h2 className={styles.h2}>
          Artists you&apos;ll <em>hear</em>
        </h2>
        <ul className={styles.list}>
          <li>
            <strong>Foundations:</strong> Noisia, Phace, Black Sun Empire
          </li>
          <li>
            <strong>Modern heavyweights:</strong> Mefjus, Synergy, Joe Ford
          </li>
          <li>
            <strong>DnB Doctor roster:</strong> the label playlist is built from these artists
          </li>
        </ul>
        <GuideRoster />
        <div className={styles.ctas}>
          <Link href="/artists" className={styles.btnGhost}>
            All DnB Doctor artists <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Section>

      <GuideReleases heading="Fresh" accent="from the lab" text="The newest DnB Doctor releases — next stop: the label playlist." />

      <Section id="get-on" n="04" label="Producers">
        <h2 className={styles.h2}>
          Get on the <em data-tone="purple">playlist</em>
        </h2>
        <p>
          Every track released on DnB Doctor goes into the label playlist, and new releases are considered for the monthly
          selection. There is <strong>no paid placement</strong> — the way in is a strong demo.
        </p>
        <ul className={styles.tiles} style={FIT}>
          <li>
            <Link href="/submit-demo">
              <span className={styles.tileTag}>A&amp;R</span>
              <h3>Submit your demo</h3>
              <p>Finished a neuro track? Send it to DnB Doctor.</p>
            </Link>
          </li>
          <li>
            <Link href="/how-to-produce-neurofunk">
              <span className={styles.tileTag}>Guide</span>
              <h3>How to make neurofunk</h3>
              <p>Drums, bass design, arrangement and mixdown in 7 steps.</p>
            </Link>
          </li>
          <li>
            <Link href="/sample-packs">
              <span className={styles.tileTag}>Free + pro packs</span>
              <h3>Neurofunk sample packs</h3>
              <p>A free neurofunk sample pack plus pro packs from DnB Doctor artists.</p>
            </Link>
          </li>
        </ul>
      </Section>

      <Section id="more" n="05" label="Beyond Spotify">
        <h2 className={styles.h2}>
          Beyond <em>Spotify</em>
        </h2>
        <ul className={styles.tiles} style={FIT}>
          <li>
            <Link href="/neurofunk-dnb-mixes">
              <span className={styles.tileTag}>DJ sets</span>
              <h3>Neurofunk mixes</h3>
              <p>NEUROBANGERZ and other sets from the DnB Doctor crew.</p>
            </Link>
          </li>
          <li>
            <a href="https://www.youtube.com/@dnbdoctor1" target="_blank" rel="noopener noreferrer">
              <span className={styles.tileTag}>Video</span>
              <h3>YouTube ↗</h3>
              <p>Premieres, visuals and DJ sets.</p>
            </a>
          </li>
          <li>
            <Link href="/music-packs">
              <span className={styles.tileTag}>Compilations</span>
              <h3>Music packs</h3>
              <p>Label compilations like REVENANT and VORTEX.</p>
            </Link>
          </li>
        </ul>
        <h3 className={styles.boxTitle} style={{ marginTop: '2.4rem' }}>
          Want to play these tracks?
        </h3>
        <ul className={styles.tiles} style={FIT}>
          {djLinks.map((l) => (
            <li key={l.name}>
              <a href={l.url} target="_blank" rel="noopener noreferrer sponsored">
                <span className={styles.tileTag}>{l.tagline}</span>
                <h3>{l.name} ↗</h3>
                <p>{l.description}</p>
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.note}>Some links are affiliate links. We may earn a commission at no extra cost to you.</p>
      </Section>

      <Section id="faq" n="06" label="FAQ">
        <h2 className={styles.h2}>FAQ</h2>
        <GuideFaq items={FAQ} />
      </Section>

      <section className={`${styles.wrap} ${styles.closing}`}>
        <blockquote>
          “Press play, turn it up — <span>let the bass do the talking.</span>”
        </blockquote>
        <cite>— DnB Doctor</cite>
      </section>
    </article>
  )
}
