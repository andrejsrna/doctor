import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { GuideFaq, GuideReleases, GuideSection as Section, PUBLISHER, faqJsonLd } from '@/app/components/guide/Guide'
import styles from '@/app/components/guide/guide.module.css'
import { producerLinks } from '@/lib/affiliates'

export const revalidate = 3600

const URL = 'https://dnbdoctor.com/how-to-produce-neurofunk'
const TITLE = 'How to Make Neurofunk: Drums, Bass Design & Mixdown in 7 Steps'
const DESCRIPTION =
  'How to produce neurofunk step by step: 172–175 BPM drum groove, layered FM bass in Serum or Vital, atmosphere, arrangement, mixing and mastering to –7 LUFS. Free sample packs included.'

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | DnB Doctor` },
  description: DESCRIPTION,
  keywords:
    'how to make neurofunk, how to produce neurofunk, neurofunk production, neurofunk bass tutorial, neurofunk sound design, make neurofunk bass, neurofunk drums, dnb production',
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: URL,
    images: [{ url: 'https://dnbdoctor.com/music-bg.jpeg', width: 1200, height: 630, alt: 'How to produce neurofunk' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://dnbdoctor.com/music-bg.jpeg'] },
}

const STEPS = [
  ['groove', 'Groove', 'Drums first'],
  ['bass', 'Bass', 'Layers + FM'],
  ['atmosphere', 'Atmosphere', 'Pads, FX, foley'],
  ['arrangement', 'Arrangement', 'Tension / release'],
  ['mixing', 'Mix & master', '–7 to –6 LUFS'],
  ['workflow', 'Workflow', 'Discipline'],
  ['release', 'Release', 'Demo it'],
] as const

const ARRANGEMENT = [
  ['Intro', '16–32 bars of atmosphere and FX'],
  ['Build', 'Introduce drums and bass stabs gradually'],
  ['Drop', 'Main theme, tight groove, clear energy'],
  ['Breakdown', 'Space and atmosphere, minimal elements'],
  ['Second drop', 'Variation or new bassline'],
  ['Outro', 'Filters down, returns to minimalism'],
] as const

const FAQ = [
  {
    question: 'What BPM is neurofunk?',
    answer: 'Neurofunk usually sits at 172–175 BPM, the standard Drum and Bass tempo range.',
  },
  {
    question: 'What synth is best for neurofunk bass?',
    answer:
      'Xfer Serum, Phase Plant, Vital (free) and Massive X are the common choices. The synth matters less than the process: FM movement, several distortion stages, filter automation and resampling — usually 3–5 bass layers blended across frequency bands.',
  },
  {
    question: 'How loud should a neurofunk master be?',
    answer:
      'Heavy DnB is often mastered to around –7 to –6 LUFS. Get there with light multiband compression and subtle saturation, and leave some headroom — neurofunk lives in its dynamics.',
  },
  {
    question: 'How do I structure a neurofunk track?',
    answer:
      'A typical arrangement is intro (16–32 bars of atmosphere), build, drop, breakdown, second drop with a variation or new bassline, and outro. Each section should evolve while keeping the same pulse.',
  },
  {
    question: 'Where can I send my neurofunk demo?',
    answer:
      'Once your mixdown feels ready, you can send it to DnB Doctor through the submit demo form. Other neurofunk labels worth following include Neuropunk and Close2Death.',
  },
]

export default function HowToProduceNeurofunkPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      image: ['https://dnbdoctor.com/music-bg.jpeg'],
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
        { '@type': 'ListItem', position: 2, name: 'How to Produce Neurofunk', item: URL },
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
          <span aria-hidden="true">/</span> <span aria-current="page">How to make neurofunk</span>
        </nav>

        <div>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> Complete production guide {'//'} 7 steps
          </p>
          <h1 className={styles.title}>
            <span className={styles.outline}>How to make</span>
            <span className={styles.solid}>Neurofunk</span>
          </h1>
          <p className={styles.lede}>
            Learn how to produce neurofunk – from bass design and drum programming to arrangement, mixing, and mastering.
          </p>
          <div className={styles.ctas}>
            <Link href="/sample-packs" className={styles.btn}>
              Free sample packs <span aria-hidden="true">→</span>
            </Link>
            <Link href="/submit-demo" className={styles.btnGhost}>
              Submit your track
            </Link>
          </div>
        </div>

        <aside className={styles.answer} aria-labelledby="quick-answer">
          <p className={styles.answerHead}>
            <span id="quick-answer">The process</span>
            <span>7 steps</span>
          </p>
          <ol className={styles.index}>
            {STEPS.map(([id, name, hint], i) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  <strong>{name}</strong>
                  <span>{hint}</span>
                </a>
              </li>
            ))}
          </ol>
          <p className={styles.answerText}>
            Start with a tight drum groove, design a layered bass, add atmosphere, arrange for tension and release, then mix
            clean and master to around –7 to –6 LUFS.
          </p>
        </aside>
      </header>

      <Section id="defines" n="00" label="The sound">
        <h2 className={styles.h2}>
          What defines <em data-tone="purple">neurofunk</em>?
        </h2>
        <p>
          Neurofunk is one of the most technical and powerful subgenres of{' '}
          <Link href="/what-is-drum-and-bass">Drum &amp; Bass</Link> — a world of precision sound design, surgical mixing,
          and dark cinematic tension. It emerged in the early 2000s as the <strong>evolution of techstep</strong> — darker,
          more complex, and focused on <strong>bass movement</strong> rather than melody.
        </p>
        <p>It&apos;s a hybrid of art and engineering:</p>
        <blockquote className={styles.quote}>Every sound is designed, not found.</blockquote>
        <dl className={styles.facts}>
          <div>
            <dt>Tempo</dt>
            <dd>
              172–175<small>BPM</small>
            </dd>
          </div>
          <div>
            <dt>Basslines</dt>
            <dd>
              Modulated<small>evolving, aggressive</small>
            </dd>
          </div>
          <div>
            <dt>Drums</dt>
            <dd>
              Tight<small>punchy, layered</small>
            </dd>
          </div>
          <div>
            <dt>Atmosphere</dt>
            <dd>
              Sci-fi<small>dystopian, industrial</small>
            </dd>
          </div>
        </dl>
        <p>
          <strong>Mixdown:</strong> ultra-clean, headroom-controlled, stereo-balanced. Producers like Noisia, Mefjus, Gydra,
          and Joe Ford defined the modern neurofunk sound — equal parts groove, complexity, and chaos. New to the genre?
          Read the <Link href="/neurofunk-dnb">neurofunk guide</Link> or compare it with the other{' '}
          <Link href="/types-of-dnb">types of DnB</Link>.
        </p>
      </Section>

      <Section id="groove" n="01" label="Groove">
        <h2 className={styles.h2}>
          Start with the <em>groove</em>
        </h2>
        <p>
          A strong <strong>drum foundation</strong> is everything. Neurofunk lives and dies by its groove.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table} data-compact>
            <thead>
              <tr>
                <th scope="col">Element</th>
                <th scope="col">Target</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Kick</th>
                <td>
                  Short, controlled low end (around <span className={styles.bpm}>50–70 Hz</span>)
                </td>
              </tr>
              <tr>
                <th scope="row">Snare</th>
                <td>
                  Crisp transient, fundamental around <span className={styles.bpm}>180–200 Hz</span>
                </td>
              </tr>
              <tr>
                <th scope="row">Hi-hats</th>
                <td>Syncopated layers, subtle shuffle</td>
              </tr>
              <tr>
                <th scope="row">Ghost notes</th>
                <td>Light, fast hits that keep motion in the beat</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Start simple: one solid <strong>two-bar loop</strong> with a snare on 2 and 4, then add subtle ghost hits and
          cymbal variations. Use <strong>sample layering</strong> and <strong>transient shaping</strong> to make drums hit
          hard without clipping.
        </p>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Build your drum library</h3>
          <p>Download free neurofunk sample packs to kickstart your productions.</p>
          <Link href="/sample-packs" className={styles.btn}>
            Get the free sample packs <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Section>

      <Section id="bass" n="02" label="Bass">
        <h2 className={styles.h2}>
          Design the <em data-tone="purple">bass</em>
        </h2>
        <p>
          The <strong>bassline is the heart of neurofunk</strong>. It&apos;s not just low-end energy — it&apos;s a character.
        </p>
        <ul className={styles.chips} aria-label="Common tools">
          <li>Xfer Serum</li>
          <li>Phase Plant</li>
          <li>Vital</li>
          <li>Massive X</li>
        </ul>
        <div className={styles.box} data-tone="purple">
          <h3 className={styles.boxTitle}>Core techniques</h3>
          <ol className={styles.list}>
            <li>
              <strong>FM synthesis:</strong> use operators to modulate pitch and create movement.
            </li>
            <li>
              <strong>Distortion layers:</strong> combine different saturation stages (tube, soft clip, bit-crush).
            </li>
            <li>
              <strong>Filtering:</strong> automate high-pass/low-pass sweeps to create motion.
            </li>
            <li>
              <strong>Resampling:</strong> bounce your bass, re-process it, and twist it again.
            </li>
          </ol>
        </div>
        <blockquote className={styles.quote}>
          <strong>Tip:</strong> Neurofunk bass is rarely one synth — it&apos;s usually <strong>3–5 layers</strong> blended
          across frequency bands.
        </blockquote>
      </Section>

      <Section id="atmosphere" n="03" label="Atmosphere">
        <h2 className={styles.h2}>
          Sound design &amp; <em>atmosphere</em>
        </h2>
        <p>
          A true neuro track feels like a <strong>living machine</strong>. Add textures and ambient tension:
        </p>
        <ul className={styles.tiles}>
          <li>
            <span className={styles.tileTag}>Pads</span>
            <p>Dark reverb tails, metallic drones</p>
          </li>
          <li>
            <span className={styles.tileTag}>FX</span>
            <p>Risers, downlifters, glitches, industrial noises</p>
          </li>
          <li>
            <span className={styles.tileTag}>Foley</span>
            <p>Mechanical hits, machinery hum, reverb tails from field recordings</p>
          </li>
        </ul>
        <p>
          Try creating your own samples by recording sounds (metal hits, cables, tools) and <strong>re-processing</strong>{' '}
          them with distortion and reverb.
        </p>
      </Section>

      <Section id="arrangement" n="04" label="Arrangement">
        <h2 className={styles.h2}>
          Arrangement &amp; <em>flow</em>
        </h2>
        <p>
          Structure your track with <strong>tension and release</strong> in mind:
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table} data-compact>
            <thead>
              <tr>
                <th scope="col">Section</th>
                <th scope="col">What happens</th>
              </tr>
            </thead>
            <tbody>
              {ARRANGEMENT.map(([section, what]) => (
                <tr key={section}>
                  <th scope="row">{section}</th>
                  <td>{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Neurofunk works best when it <strong>feels unpredictable but controlled</strong> — each section should evolve
          while maintaining the same pulse.
        </p>
      </Section>

      <Section id="mixing" n="05" label="Mix & master">
        <h2 className={styles.h2}>
          Mixing &amp; <em data-tone="purple">mastering</em>
        </h2>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Mixing goals</h3>
          <ul className={styles.list}>
            <li>
              Keep <strong>sub frequencies clean</strong> — nothing collides with the kick.
            </li>
            <li>
              Use <strong>bus compression</strong> for glue, not loudness.
            </li>
            <li>
              Balance with <strong>mid-side EQ</strong> for width without phase issues.
            </li>
            <li>Automate EQs to keep the low end consistent as the bass moves.</li>
          </ul>
        </div>
        <div className={styles.box} data-tone="purple">
          <h3 className={styles.boxTitle}>Mastering tips</h3>
          <ul className={styles.list}>
            <li>Light multiband compression (C4 or Pro-MB).</li>
            <li>Subtle saturation for perceived loudness.</li>
            <li>
              Target loudness: around <strong>–7 to –6 LUFS</strong> (for heavy DnB).
            </li>
            <li>Leave some headroom — neurofunk lives in dynamics.</li>
          </ul>
        </div>
      </Section>

      <Section id="workflow" n="06" label="Workflow">
        <h2 className={styles.h2}>
          Workflow &amp; <em>mindset</em>
        </h2>
        <p>
          Producing neurofunk isn&apos;t just about plugins — it&apos;s about <strong>discipline and iteration</strong>.
        </p>
        <ul className={styles.list}>
          <li>Work in focused sessions (sound design → composition → mixdown).</li>
          <li>Reference pros (Noisia, Gydra, Mefjus) often.</li>
          <li>A/B your track at low volume — balance reveals itself there.</li>
          <li>
            Don&apos;t chase loudness, chase <strong>clarity and character</strong>.
          </li>
        </ul>
        <blockquote className={styles.quote}>“The groove is human, the mix is mechanical.” — DnB Doctor</blockquote>
      </Section>

      <Section id="release" n="07" label="Release">
        <h2 className={styles.h2}>
          Learn, collaborate, <em>release</em>
        </h2>
        <p>
          Neurofunk is a <strong>community-driven genre</strong> — producers share techniques, collabs, and remix stems.
        </p>
        <ul className={styles.list}>
          <li>Join Discords and forums like Neurofunk Grid or Bass Rabbit.</li>
          <li>
            Follow labels like <strong>DnB Doctor</strong>, <strong>Neuropunk</strong>, and <strong>Close2Death</strong>.
          </li>
          <li>Submit demos once your mixdown feels ready.</li>
        </ul>
        <div className={styles.box}>
          <h3 className={styles.boxTitle}>Finished a track?</h3>
          <p>Send it to DnB Doctor through the demo form — and learn how to get it heard.</p>
          <div className={styles.ctas}>
            <Link href="/submit-demo" className={styles.btn}>
              Submit your demo <span aria-hidden="true">→</span>
            </Link>
            <Link href="/news/why-nobody-listens-to-your-neurofunk-tracks" className={styles.btnGhost}>
              Why nobody listens to your tracks
            </Link>
          </div>
        </div>
      </Section>

      <GuideReleases heading="Reference" accent="tracks" text="Latest neurofunk from the DnB Doctor lab — study the drums and the bass." />

      <Section id="tools" n="08" label="Tools">
        <h2 className={styles.h2}>
          Tools to <em data-tone="purple">level up</em>
        </h2>
        <p>Get the plugins, samples, and tools the pros use.</p>
        <ul className={styles.tiles}>
          {producerLinks.map((l) => (
            <li key={l.name}>
              <a href={l.url} target="_blank" rel="noopener noreferrer sponsored">
                {l.tagline && <span className={styles.tileTag}>{l.tagline}</span>}
                <h3>{l.name} ↗</h3>
                <p>{l.description}</p>
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.note}>Some links are affiliate links. We may earn a commission at no extra cost to you.</p>
      </Section>

      <Section id="faq" n="09" label="FAQ">
        <h2 className={styles.h2}>FAQ</h2>
        <GuideFaq items={FAQ} />
      </Section>

      <section className={`${styles.wrap} ${styles.closing}`}>
        <blockquote>
          “Neurofunk isn&apos;t about perfection — it&apos;s about <span>evolution.</span> Every sound, every bar, every bounce
          teaches you something new.”
        </blockquote>
        <cite>— DnB Doctor</cite>
      </section>
    </article>
  )
}
