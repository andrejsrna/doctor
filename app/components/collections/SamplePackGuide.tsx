import Link from 'next/link'
import { producerLinks } from '@/lib/affiliates'
import base from './collections.module.css'
import styles from './samplePackGuide.module.css'

/**
 * Server-rendered guide under the /sample-packs list.
 * Pack contents were checked against the ZIPs (Nov 2026): free X-Mass pack = 60 WAV,
 * Yehor pack = 28 files per its manifest. Licence wording mirrors Terms 6a.
 */
const FREE = '/music/yehor-x-mass-free-neurofunk-sample-pack'
const PAID = '/music/yehor-sample-pack'

const COMPARE: [string, string, string][] = [
  ['Price', 'Free — download link by email', '€10'],
  ['Files', '60 WAV', '28 files: 17 WAV + 11 Serum presets'],
  ['Contents', '15 bass loops, 15 drum loops, 15 top loops, 15 bass one-shots', '6 bass loops, 5 drum loops, 6 synths & pads, 11 Serum presets'],
  ['Format', '24-bit / 44.1 kHz stereo WAV', '24-bit / 44.1 kHz stereo WAV + .fxp presets'],
  ['Tempo', '174 BPM', '174 BPM, key in bass & synth file names'],
  ['Made by', 'Yehor', 'Yehor'],
]

const FAQ = [
  {
    question: 'Is there a free neurofunk sample pack?',
    answer:
      'Yes. The Yehor X-Mass Free Neurofunk Sample Pack has 60 WAV files — 15 bass loops, 15 drum loops, 15 top loops and 15 bass one-shots at 174 BPM. Enter your email on the release page and the download link is sent to you.',
  },
  {
    question: 'Are the samples royalty-free?',
    answer:
      'Yes. Sounds from DnB Doctor sample packs are licensed royalty-free for your own music, including commercially released tracks, remixes, DJ sets and video soundtracks. You may not resell or redistribute the samples themselves, on their own or inside another sample pack or preset bank.',
  },
  {
    question: 'What format and BPM are the samples?',
    answer:
      'All audio is 24-bit / 44.1 kHz stereo WAV, and the loops are at 174 BPM — the standard drum and bass tempo — so they drop straight into a DnB project.',
  },
  {
    question: 'Do I need Serum?',
    answer:
      'Only for the 11 presets in the Yehor Sample Pack, which are made for Xfer Serum. The loops, one-shots and pads are plain WAV files that work in any DAW or sampler.',
  },
  {
    question: 'How do I get a paid pack after buying?',
    answer:
      'You pay by card through Stripe and receive a download link by email right away. Your purchases also stay available in My account, where you sign in with the same email.',
  },
  {
    question: 'Can I use the samples in other styles than neurofunk?',
    answer:
      'Yes. The loops are built for neurofunk, but at 174 BPM they work in any drum and bass style, and the bass shots and presets are useful well beyond DnB.',
  },
]

export const samplePacksFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
}

export default function SamplePackGuide() {
  return (
    <div className={styles.guide}>
      <section className={styles.block} aria-labelledby="sp-compare">
        <p className={base.label}>Which pack?</p>
        <h2 id="sp-compare" className={base.h2}>
          Free vs <span className={base.outline}>pro pack</span>
        </h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">
                  <span className={styles.sr}>Detail</span>
                </th>
                <th scope="col">
                  <Link href={FREE}>X-Mass Free Pack</Link>
                </th>
                <th scope="col">
                  <Link href={PAID}>Yehor Sample Pack</Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([k, a, b]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.ctas}>
          <Link href={FREE} className={base.primary}>
            Get the free pack →
          </Link>
          <Link href={PAID} className={base.secondary}>
            Preview the Yehor pack
          </Link>
        </div>
      </section>

      <div className={styles.cols}>
        <section className={styles.topic} aria-labelledby="sp-loops">
          <span className={styles.no}>01</span>
          <h2 id="sp-loops">Neurofunk loops</h2>
          <p>
            <strong>Bass loops</strong> are the heart of neurofunk: modulated, rolling basslines you can chop, resample and layer.{' '}
            <strong>Drum loops</strong> give you finished two-step grooves, and <strong>top loops</strong> add hats, shakers and
            percussion on top of your own break. Everything is cut at 174 BPM, so loops lock to the grid without stretching.
          </p>
        </section>
        <section className={styles.topic} aria-labelledby="sp-shots">
          <span className={styles.no}>02</span>
          <h2 id="sp-shots">Bass one-shots</h2>
          <p>
            One-shots are single bass hits — load them into a sampler, play them in key and build your own riff around them. The free
            pack includes 15, which is a quick way to get the gritty neurofunk bass texture without designing every sound from scratch.
          </p>
        </section>
        <section className={styles.topic} aria-labelledby="sp-serum">
          <span className={styles.no}>03</span>
          <h2 id="sp-serum">Serum presets</h2>
          <p>
            The Yehor Sample Pack adds 11 presets for Xfer Serum, plus synths and pads, so you can tweak the sound at the source instead
            of working only with audio. New to bass design? Start with the{' '}
            <Link href="/how-to-produce-neurofunk">neurofunk production guide</Link>.
          </p>
        </section>
      </div>

      <section className={styles.licence} aria-labelledby="sp-licence">
        <h2 id="sp-licence" className={base.label}>
          Licence in one line
        </h2>
        <p>
          Royalty-free for your own music — released tracks, remixes, DJ sets and video soundtracks. Not allowed: reselling or sharing
          the samples themselves. Full wording in the <Link href="/terms">Terms (6a)</Link>.
        </p>
      </section>

      <section className={styles.block} aria-labelledby="sp-faq">
        <p className={base.label}>FAQ</p>
        <h2 id="sp-faq" className={base.h2}>
          Sample pack <span className={base.outline}>questions</span>
        </h2>
        <div className={styles.faq}>
          {FAQ.map((f, i) => (
            <details key={f.question} open={i === 0}>
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
        <p className={styles.note}>
          Keep learning: <Link href="/neurofunk-dnb">what neurofunk is</Link>, <Link href="/dnb-bpm">why DnB sits at 174 BPM</Link>{' '}
          and <Link href="/types-of-dnb">the main types of DnB</Link>.
        </p>
      </section>

      <div className={base.tools}>
        <p className={base.label}>Get More Samples &amp; Tools</p>
        <div className={base.toolLinks}>
          {producerLinks.map((l) => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer sponsored">
              <strong>{l.name}</strong>
              <span>{l.tagline}</span>
            </a>
          ))}
        </div>
        <p className={base.disclose}>Some links are affiliate links. We may earn a commission at no extra cost to you.</p>
      </div>
    </div>
  )
}
