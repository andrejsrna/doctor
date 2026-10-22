import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideFaq, GuideReleases, GuideSection as Section, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import styles from '@/app/components/guide/guide.module.css'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/neurofunk-labels'
const TITLE = 'Neurofunk Labels: From Eatbrain to the Underground (2020s)'
const DESCRIPTION =
  'The neurofunk label landscape today: legacy houses like Eatbrain and Blackout, plus the independent DnB labels driving the genre — Darkshire, DnB Doctor and more.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'Neurofunk labels' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/og-image.jpg'] },
}

const TOC = [
  ['#labels', 'Label list'],
  ['#independent', 'Independents'],
  ['#central-europe', 'Central Europe'],
  ['#legends', 'Legends'],
  ['#underground', 'Underground'],
  ['#faq', 'FAQ'],
] as const

const EUROPEAN_LABELS = [
  'Eatbrain',
  'Blackout Music NL',
  'Darkshire',
  'Skamele Recordings',
  'Bass Rabbit Recordings',
  'DnB Doctor',
  'Nonoise',
  'Hanzom Music',
  'Bassomnia',
  'Spring Bass Jam Recordings',
  'Neurosports Recordings',
  'District Bass',
  'Brain Rave',
  'NeuroDNB Recordings',
  'Evolution Chamber',
  'Nocturnal Demons',
  'Paperfunk Recordings',
  'Hoofbeats Music',
]

const SCOUTS = [
  ['Prague', 'DnB Doctor', 'Label and creative studio focused on dark, rolling narratives with cinematic storytelling.'],
  ['UK', 'Neuroheadz', 'Collective nurturing next-gen engineers who love experimental drum programming and raw bass design.'],
  ['Vienna', 'Bass Rabbit Recordings', 'Imprint turning rave energy into tightly curated releases and collaborative showcases.'],
] as const

const REGIONS = [
  ['Czechia', 'Warehouse grit, relentless bass scientists, Let It Roll alumni.'],
  ['Austria', 'Precision engineering, cross-pollination with techno aesthetics.'],
  ['Germany & Netherlands', 'Modular experiments, boutique vinyl runs.'],
  ['Slovakia & UK', 'Hybrid crews fusing neurofunk with halftime and glitch.'],
] as const

const DARKSHIRE = [
  ['Origin story', 'From forest micro-festival to touring brand with immersive scenography.'],
  ['Signature artists', 'PRDK, Zigi SC, A-Cray, ABSU_NTQL, Raido, Kaira.'],
  ['What sets them apart', 'Narrative-first branding, relentless visual identity, and high-stakes bass pressure.'],
] as const

const FAQ = [
  {
    question: 'What are the best neurofunk labels?',
    answer:
      'Eatbrain and Blackout Music NL are the long-standing names. Today the scene is driven just as much by independents — Darkshire, Skamele, Bass Rabbit, Nonoise, Hanzom, DnB Doctor and many more across Europe.',
  },
  {
    question: 'Do you still need a big label to get heard?',
    answer:
      'No. The monopoly on attention is gone: producers run their own imprints, Bandcamp, Patreon and Discord communities, and one heavy track can travel worldwide overnight. A label still helps with consistency, artwork, promo and a catalog that grows.',
  },
  {
    question: 'Where can I send a neurofunk demo?',
    answer:
      'DnB Doctor listens to every neurofunk and techy DnB demo. Check the submission guidelines first, then send finished tracks through the submit-demo form.',
  },
  {
    question: 'Where is DnB Doctor based?',
    answer:
      'In Prague, Czech Republic — in the middle of the Central European scene, with artists from Slovakia, Ukraine, Austria and beyond.',
  },
]

export default function NeurofunkLabelsPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      url: URL,
      mainEntityOfPage: URL,
      image: 'https://dnbdoctor.com/og-image.jpg',
      dateModified: '2026-10-22',
      author: PUBLISHER,
      publisher: PUBLISHER,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
        { '@type': 'ListItem', position: 2, name: 'Neurofunk', item: 'https://dnbdoctor.com/neurofunk-dnb' },
        { '@type': 'ListItem', position: 3, name: 'Labels', item: URL },
      ],
    },
    faqJsonLd(FAQ),
  ]

  return (
    <article className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className={styles.backdrop} aria-hidden="true">
        <Image src="/neurofunk-labels.jpeg" alt="" fill sizes="100vw" priority />
      </div>

      <header className={`${styles.wrap} ${styles.hero}`}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span>{' '}
          <Link href="/neurofunk-dnb">Neurofunk</Link> <span aria-hidden="true">/</span>{' '}
          <span aria-current="page">Labels</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> Label guide {'//'} 2020s
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>Neurofunk</span>
            <span className={styles.solid}>Labels</span>
          </h1>
          <p className={styles.lede}>
            From the giants to the underground. Legacy houses like <strong>Eatbrain</strong> and{' '}
            <strong>Blackout</strong> still stand tall, but independent crews and self-releasing producers now drive the
            genre forward.
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
              Submit a demo
            </Link>
          </div>
        </div>

        <aside className={styles.answer} aria-labelledby="quick-answer">
          <p className={styles.answerHead}>
            <span id="quick-answer">Quick answer</span>
            <span>Label scene</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Legacy</dt>
              <dd>
                Eatbrain<small>Blackout Music NL</small>
              </dd>
            </div>
            <div>
              <dt>Rising</dt>
              <dd>
                Independents<small>Darkshire, Skamele, Nonoise…</small>
              </dd>
            </div>
            <div>
              <dt>Heartbeat</dt>
              <dd>
                Central Europe<small>Prague, Brno, Vienna</small>
              </dd>
            </div>
            <div>
              <dt>Demos</dt>
              <dd>
                <Link href="/submit-demo">DnB Doctor</Link>
                <small>neurofunk &amp; techy DnB</small>
              </dd>
            </div>
          </dl>
        </aside>
      </header>

      <Section id="labels" n="01" label="List">
        <h2 className={styles.h2}>
          Most active neurofunk labels in <em>Europe</em>
        </h2>
        <p>
          Life changed — and so did the labels. Some titans survived, others shut down, and the monopoly on attention
          disappeared. You no longer need the Virus or Blackout cosign to be heard; one heavyweight bootleg can travel
          the world overnight.
        </p>
        <ul className={styles.chips} style={{ marginTop: '1.4rem' }} aria-label="Neurofunk labels in Europe">
          <li>2020s</li>
          {EUROPEAN_LABELS.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p className={styles.note}>
          These imprints shape modern neurofunk culture — through festival stages, boutique vinyl drops, or unstoppable
          release schedules.
        </p>
      </Section>

      <Section id="independent" n="02" label="Indie">
        <h2 className={styles.h2}>
          The rise of <em data-tone="purple">independent</em> labels
        </h2>
        <p>
          The Covid era forced everyone to relearn agility. Artists launched imprints, Twitch channels, Patreon
          communities, and Bandcamp clubs. The truth? It&apos;s not the same anymore — and that&apos;s a good thing.
        </p>
        <p>
          Boutique crews scout hungry producers who want label support without losing creative control. Consistency,
          unique sound design, and dedication still open doors — the rulebook just changed.
        </p>
        <ul className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))' }}>
          {SCOUTS.map(([where, name, desc]) => (
            <li key={name}>
              <span className={styles.tileTag}>{where}</span>
              <h3>{name}</h3>
              <p>{desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="central-europe" n="03" label="CE">
        <h2 className={styles.h2}>
          Central Europe: the <em>heartbeat</em>
        </h2>
        <p>
          Czech and Austrian creatives forged a true symbiosis. Prague, Brno, and Vienna trade ideas weekly — from
          warehouse raves to cross-border showcases and festival takeovers.
        </p>
        <dl className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))' }}>
          {REGIONS.map(([where, desc]) => (
            <div key={where}>
              <dt>{where}</dt>
              <dd>{desc}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.box} style={{ marginTop: '2.4rem' }}>
          <h3 className={styles.boxTitle}>Spotlight: Darkshire</h3>
          <p>
            They started in the forest — now they run high-production parties across Slovakia, Hungary, and Czechia.
            (Dedicated Austrian ravers are hoping they&apos;ll soon fill the empty Darkshire space there as well.)
            Darkshire&apos;s growth is the result of pure dedication, relentless storytelling, and a heavy musical
            vision.
          </p>
          {/* 3 facts: auto-fit columns so there is never an empty 4th cell */}
          <dl className={styles.tiles} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))' }}>
            {DARKSHIRE.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <blockquote className={styles.quote}>
          &quot;Their growth is the price of dedication, good music, and clever marketing.&quot;
        </blockquote>
      </Section>

      <Section id="legends" n="04" label="Legends">
        <h2 className={styles.h2}>
          Legends in transition: <em data-tone="purple">Eatbrain &amp; Blackout</em>
        </h2>
        <p>
          For <strong>over a decade</strong> they were unquestioned kings, dropping era-defining releases and
          arena-sized live shows.
        </p>
        <p>
          Culture shifted, algorithms rewired attention, and underground-meets-viral energy took over. They are not gone
          — just evolving, recalibrating their place in a decentralized ecosystem. A comeback is always one bold release
          away.
        </p>
        <p className={styles.note}>
          Where it all came from: <Link href="/drum-and-bass-history">history of drum and bass</Link> ·{' '}
          <Link href="/neurofunk-dnb">what is neurofunk</Link>.
        </p>
      </Section>

      <Section id="underground" n="05" label="Core">
        <h2 className={styles.h2}>
          The underground <em>core</em>
        </h2>
        <p>
          Thousands of listeners per drop, but pure cultural gravity. SoundCloud crews, cassette runs, Discord
          syndicates — they keep the fire alive with deep rollers, halftime experiments, and multi-country collabs.
        </p>
        <p>
          Czechia, Germany, the Netherlands, Austria, Slovakia, and the UK keep trading ideas, pushing neuro forward
          because they love it.
        </p>

        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Spotlight: DnB Doctor</h3>
          <p>
            DnB Doctor is the archetype of modern underground neuro: dark, gritty, and hyper-focused on identity. Artists
            like <Link href="/artists/asana">Asana</Link>, <Link href="/artists/yehor">Yehor</Link>,{' '}
            <Link href="/music/ill-fated-noble-sacrifice">Ill-Fated</Link>, and{' '}
            <Link href="/artists/emzee">EmZee</Link> deliver weaponized basslines built for late-night systems.
          </p>
          <p>
            Expect raw pressure inspired by the classics but sculpted with today&apos;s sound design tools. The future of
            the underground might already be in our <Link href="/music">release calendar</Link>.
          </p>
        </div>

        <h3 className={styles.boxTitle} style={{ marginTop: '2.4rem' }}>
          The future of neurofunk
        </h3>
        <p>
          The ravers shape what happens next. Every show you attend, mix you share, and underground release you stream
          keeps the culture alive. Support the big names, champion the independents, and keep the scene weird.
        </p>
        <p>
          <strong>Keep it underground. Keep it real.</strong> 💚 With the heaviest neuro love, Anne
        </p>
        <p className={styles.note}>
          PS: the monthly neurofunk playlist is live — <Link href="/neurofunk-spotify">neurofunk on Spotify</Link>.
        </p>
      </Section>

      <GuideReleases heading="Hear the" accent="label" text="Latest neurofunk releases from DnB Doctor." />

      <Section id="faq" n="06" label="FAQ">
        <h2 className={styles.h2}>FAQ</h2>
        <GuideFaq items={FAQ} />
        <p className={styles.note}>
          Sending music? Read the <Link href="/guidelines">demo guidelines</Link> ·{' '}
          <Link href="/submit-demo">submit a demo</Link> · <Link href="/how-to-produce-neurofunk">produce neurofunk</Link>
        </p>
      </Section>
    </article>
  )
}
