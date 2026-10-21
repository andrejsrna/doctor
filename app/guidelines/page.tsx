import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideReleases, GuideSection as Section, PUBLISHER } from '@/app/components/guide/Guide'
import styles from '@/app/components/guide/guide.module.css'
import own from './guidelines.module.css'
import VideoCard from './VideoCard'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/guidelines'
const TITLE = 'Demo Submission Guidelines for Neurofunk Producers'
const DESCRIPTION =
  'What DnB Doctor looks for in a demo: neurofunk and techy DnB at 170–178 BPM, finished tracks, WAV 24-bit, your own work — plus free production resources.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: `${TITLE} | DnB Doctor`,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'DnB Doctor producer guidelines' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/og-image.jpg'] },
}

const TOC = [
  ['#general', 'General requirements'],
  ['#technical', 'Technical requirements'],
  ['#what-we-look-for', 'What we look for'],
  ['#additional', 'Additional notes'],
  ['#resources', 'Resources'],
] as const

const GENERAL = [
  { topic: 'Genre', yes: 'Neurofunk, techy DnB, deep and dark vibes', no: 'Not Accepted: Liquid, jump-up, minimal, breakcore, etc.' },
  {
    topic: 'Quality Standard',
    yes: 'Proper mixdown & mastering preferred (but we can handle mastering if needed)',
    no: 'No Unfinished Demos: Only fully completed tracks',
  },
  { topic: 'Originality', yes: 'Your own work, no bootlegs or unlicensed samples', no: 'AI-generated or AI-processed submissions, (AI elements are allowed)' },
] as const

const TECH = [
  ['Format', 'WAV, 24-bit, 44.1kHz or higher'],
  ['BPM', '170-178 (unless you have something unique)'],
  ['Mixing', 'Well-balanced mix, no heavy limiting or distortion'],
] as const

type Video = { id: string; start?: number; title: string; heading: string; text: string; channel: string; channelUrl: string }

const VIDEOS: { group: string; items: Video[] }[] = [
  {
    group: 'Mixing & Mastering',
    items: [
      {
        id: '_X0Ej_DGqvs',
        title: 'How to make NEUROFUNK DNB | SOUND DESIGN, MIXING, MASTERING',
        heading: 'Complete Neurofunk Production Guide',
        text: 'In-depth tutorial covering sound design, mixing and mastering techniques.',
        channel: 'PHENOMSOUND',
        channelUrl: 'https://www.youtube.com/@PHENOMSOUND',
      },
      {
        id: 'wZ3hFRBtG2M',
        title: 'How to make Neuro Drum & Bass UPDATED Ableton Live Lite - Beginner Tutorial',
        heading: 'How to make Neuro Drum & Bass (Updated)',
        text: 'Comprehensive beginner tutorial for producing neurofunk in Ableton Live Lite.',
        channel: 'DNB Academy',
        channelUrl: 'https://www.youtube.com/@dnbacademy',
      },
    ],
  },
  {
    group: 'Sound Design',
    items: [
      {
        id: 'B1xItXbUvIg',
        title: 'How to make HARD Neurofunk DNB like MEFJUS',
        heading: 'Neuro Bass Design',
        text: 'Creating aggressive basslines with Serum.',
        channel: 'Inverse Audio',
        channelUrl: 'https://www.youtube.com/@InverseAudio',
      },
      {
        id: 'KkPxJluyTLw',
        title: 'Basics of Drum & Bass drum patterns',
        heading: 'Drum Processing',
        text: 'Crafting punchy, hard-hitting neurofunk drums.',
        channel: 'ARTFX',
        channelUrl: 'https://www.youtube.com/@ARTFX',
      },
    ],
  },
  {
    group: 'Arrangement & Structure',
    items: [
      {
        id: 'aF5G1WeeQ8A',
        start: 469,
        title: 'DnB Arrangement Tips',
        heading: 'Drum Pattern Arrangement',
        text: 'How to structure your drum pattern for maximum impact.',
        channel: 'Stranjah',
        channelUrl: 'https://www.youtube.com/@STRANJAH',
      },
      {
        id: 't5oDmmwBuS4',
        start: 751,
        title: 'DnB Bass Pattern Tips',
        heading: 'Bass Patterns',
        text: 'Learn how to create effective bass patterns for neurofunk.',
        channel: 'Stranjah',
        channelUrl: 'https://www.youtube.com/@STRANJAH',
      },
      {
        id: 'lGZXssulIAg',
        start: 530,
        title: 'How To Make Bass Patterns for Neurofunk',
        heading: 'Bass Patterns & Phrases',
        text: 'Learn how to create effective bass patterns and phrases for modern neurofunk.',
        channel: 'DnB Academy',
        channelUrl: 'https://www.youtube.com/@DnBAcademy',
      },
    ],
  },
  {
    group: 'General Production',
    items: [
      {
        id: 'qfahdH8nIgI',
        title: 'Call and Response in DnB',
        heading: 'Call & Response Techniques',
        text: 'Learn how to create dynamic arrangements using call and response patterns.',
        channel: 'DnB Academy',
        channelUrl: 'https://www.youtube.com/@DnBAcademy',
      },
      {
        id: '7rCAKRKskxA',
        start: 13,
        title: 'This Simple Rule Will Improve Your Arrangements',
        heading: 'Arrangement Tips',
        text: 'Learn a simple but powerful rule for better arrangements.',
        channel: 'Alex Rome',
        channelUrl: 'https://www.youtube.com/@AlexRome',
      },
    ],
  },
]

const DOWNLOADS = [
  ['TeddyKillerz - Patreon', 'Downloadable resources from TeddyKillerz.', 'https://www.patreon.com/teddykillerz'],
  ['Agressor Bunx - Patreon', 'Downloadable resources from Agressor Bunx, (Serum presets, etc).', 'https://www.patreon.com/agressorbunx'],
  ['Gydra - Patreon', 'Downloadable resources from Gydra, (Serum presets, etc).', 'https://www.patreon.com/gydra'],
  ['PRDK - Patreon', 'Downloadable resources from PRDK, (Serum presets, etc).', 'https://www.patreon.com/prdkmusic'],
  ['Splice', 'Downloadable resources from Splice, (Serum presets, etc).', 'https://www.splice.com/sounds/search?q=neurofunk'],
] as const

/** [name, maker, type, url] */
const PLUGINS = [
  ['Serum', 'Xfer Records', 'Synth Plugin', 'https://xferrecords.com/products/serum-2'],
  ['Master Plan', 'Music Hack', 'Mastering Suite', 'https://www.musikhack.com/products/masterplan/'],
  ['Thermal', 'Output', 'Distortion Plugin', 'https://output.com/products/thermal'],
  ['Stealth Limiter', 'IK Multimedia', 'Limiter Plugin', 'https://www.ikmultimedia.com/products/trstealthlimiter/'],
  ['Massive', 'Native Instruments', 'Synth Plugin', 'https://www.native-instruments.com/en/products/komplete/synths/massive/'],
  ['Rift', 'Minimal Audio', 'Distortion Plugin', 'https://www.minimal.audio/products/rift'],
  ['Pro Q4', 'Fabfilter', 'EQ Plugin', 'https://www.fabfilter.com/products/pro-q-4-equalizer-plug-in'],
  ['Ableton Live Lite', 'Ableton', 'DAW', 'https://www.ableton.com/en/live/'],
  ['Plugin Boutique', 'Plugin Boutique', 'Plugin Store', 'https://www.pluginboutique.com/?a_aid=69dac828ced75'],
  ['Vital', 'Vital Audio', 'Free Synth Plugin', 'https://vital.audio/'],
  ['Loopmasters', 'Loopmasters', 'Sample Pack Store', 'https://www.loopmasters.com/search?utf8=%E2%9C%93&q=neurofunk&a_aid=69dac828ced75'],
  ['Movement', 'Output', 'FX Engine', 'https://output.com/products/movement'],
] as const

const SOCIALS = [
  ['Instagram', 'https://www.instagram.com/dnbdoctor/'],
  ['YouTube', 'https://www.youtube.com/@dnbdoctor1'],
  ['SoundCloud', 'https://soundcloud.com/dnbdoctor'],
  ['Discord', 'https://discord.gg/GE2HWFdgXG'],
] as const

const FIT = { gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))' }

export default function GuidelinesPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: TITLE,
      description: DESCRIPTION,
      url: URL,
      datePublished: '2025-02-16',
      dateModified: '2026-10-21',
      publisher: PUBLISHER,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
        { '@type': 'ListItem', position: 2, name: 'Submit demo', item: 'https://dnbdoctor.com/submit-demo' },
        { '@type': 'ListItem', position: 3, name: 'Guidelines', item: URL },
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
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <Link href="/submit-demo">Submit demo</Link>{' '}
          <span aria-hidden="true">/</span> <span aria-current="page">Guidelines</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> A&amp;R {'//'} before you submit
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>Producer</span>
            <span className={styles.solid}>guidelines</span>
          </h1>
          <p className={styles.lede}>
            Before submitting your tracks, ensure they align with the vision and quality of our label. We focus on
            cutting-edge <Link href="/neurofunk-dnb">neurofunk</Link> with high production standards.
          </p>
          <ul className={styles.toc} aria-label="On this page">
            {TOC.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <div className={styles.ctas}>
            <Link href="/submit-demo" className={styles.btn}>
              Submit your demo <span aria-hidden="true">→</span>
            </Link>
            <Link href="/how-to-produce-neurofunk" className={styles.btnGhost}>
              How to make neurofunk
            </Link>
          </div>
        </div>

        <aside className={styles.answer} aria-labelledby="quick-answer">
          <p className={styles.answerHead}>
            <span id="quick-answer">Checklist</span>
            <span>At a glance</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Genre</dt>
              <dd>
                Neurofunk<small>techy, deep &amp; dark DnB</small>
              </dd>
            </div>
            <div>
              <dt>BPM</dt>
              <dd>
                170–178<small>unless it&apos;s unique</small>
              </dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>
                WAV 24-bit<small>44.1 kHz or higher</small>
              </dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                Finished<small>no unfinished demos</small>
              </dd>
            </div>
          </dl>
        </aside>
      </header>

      <Section id="general" n="01" label="General">
        <h2 className={styles.h2}>
          General <em>requirements</em>
        </h2>
        <div className={own.rules}>
          <div className={own.rulesHead} aria-hidden="true">
            <span>Topic</span>
            <span>Accepted</span>
            <span>Not accepted</span>
          </div>
          {GENERAL.map((g) => (
            <dl key={g.topic} className={own.rule}>
              <dt>{g.topic}</dt>
              <dd className={own.yes}>
                <span className="sr-only">Accepted: </span>
                {g.yes}
              </dd>
              <dd className={own.no}>
                <span className="sr-only">Not accepted: </span>
                {g.no}
              </dd>
            </dl>
          ))}
        </div>
        <p className={styles.note}>
          Not sure which style your track is? See <Link href="/types-of-dnb">types of DnB</Link>.
        </p>
      </Section>

      <Section id="technical" n="02" label="Technical">
        <h2 className={styles.h2}>
          Technical <em data-tone="purple">requirements</em>
        </h2>
        <dl className={styles.tiles} style={FIT}>
          {TECH.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.note}>
          Why 170–178? Read <Link href="/dnb-bpm">DnB BPM explained</Link>.
        </p>
      </Section>

      <Section id="what-we-look-for" n="03" label="A&R">
        <h2 className={styles.h2}>
          What we <em>look for</em>
        </h2>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Desired elements</h3>
          <ul className={styles.list}>
            <li>Innovative Sound Design</li>
            <li>Dark, Heavy, &amp; Punchy</li>
            <li>Emotional Depth &amp; Atmosphere</li>
          </ul>
        </div>
        <div className={own.dont}>
          <h3>What we don&apos;t want</h3>
          <ul className={styles.list}>
            <li>Generic copy-paste neurofunk</li>
            <li>Weak sound design / bad mixdowns</li>
            <li>Overly chaotic, unstructured ideas</li>
          </ul>
        </div>
      </Section>

      <Section id="additional" n="04" label="Notes">
        <h2 className={styles.h2}>
          Additional <em data-tone="purple">notes</em>
        </h2>
        <ul className={styles.list}>
          <li>We prefer exclusive releases but may consider non-exclusives if the track fits</li>
          <li>
            If accepted, we&apos;ll discuss contract, a fixed fee per track, and release schedule —{' '}
            <Link href="/submit-demo#faq">why a fixed fee</Link>
          </li>
          <li>Follow our socials for updates &amp; inspiration</li>
        </ul>
        <ul className={styles.chips} aria-label="DnB Doctor on social media" style={{ marginTop: '1.4rem' }}>
          {SOCIALS.map(([name, href]) => (
            <li key={name}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {name} ↗
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="resources" n="05" label="Resources">
        <h2 className={styles.h2}>
          Production <em>resources</em>
        </h2>
        <p>
          We want to support producers in enhancing their craft. Here are some resources to help you improve your
          production skills and align your sound with our label&apos;s expectations. Start with our own step-by-step{' '}
          <Link href="/how-to-produce-neurofunk">neurofunk production guide</Link>.
        </p>

        {VIDEOS.map((g) => (
          <div key={g.group} className={own.group}>
            <h3>{g.group}</h3>
            <ul className={own.videos}>
              {g.items.map((v) => (
                <li key={v.id}>
                  <VideoCard id={v.id} start={v.start} title={v.title} />
                  <h4>{v.heading}</h4>
                  <p>{v.text}</p>
                  <a href={v.channelUrl} target="_blank" rel="noopener noreferrer" className={own.channel}>
                    @ {v.channel} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className={own.group}>
          <h3>Downloadable resources</h3>
          <ul className={styles.tiles} style={FIT}>
            {DOWNLOADS.map(([name, text, href]) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <h4 className={own.tileH}>{name} ↗</h4>
                  <p>{text}</p>
                </a>
              </li>
            ))}
            <li>
              <Link href="/sample-packs">
                <h4 className={own.tileH}>DnB Doctor sample packs →</h4>
                <p>A free neurofunk sample pack plus pro packs from our artists.</p>
              </Link>
            </li>
          </ul>
        </div>

        <div className={own.group}>
          <h3>VSTs &amp; plugins</h3>
          <ul className={styles.tiles} style={FIT}>
            {PLUGINS.map(([name, maker, type, href]) => (
              <li key={name}>
                <a href={href} target="_blank" rel={href.includes('a_aid=') ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}>
                  <span className={styles.tileTag}>{type}</span>
                  <h4 className={own.tileH}>{name} ↗</h4>
                  <p>{maker}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <GuideReleases heading="What we" accent="sign" text="The latest DnB Doctor releases — this is the sound we're looking for." />

      <section className={`${styles.wrap} ${styles.closing}`}>
        <blockquote>
          “Ready? <span>Send us your best track.</span>”
        </blockquote>
        <div className={styles.ctas} style={{ justifyContent: 'center' }}>
          <Link href="/submit-demo" className={styles.btn}>
            Submit your demo <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </article>
  )
}
