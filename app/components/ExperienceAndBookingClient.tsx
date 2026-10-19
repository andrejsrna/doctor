'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight, FaInstagram } from 'react-icons/fa'
import { displayFont, monoFont } from './brandFonts'
import styles from './ExperienceAndBooking.module.css'

type Stats = { releases: number; artists: number; mixes: number }

const VALUES = [
  { title: 'Innovation', description: 'Pushing boundaries with cutting-edge sound design.', hue: '#39ff14' },
  { title: 'Community', description: 'Building connections through shared passion.', hue: '#9b5eff' },
  { title: 'Quality', description: 'Curating the finest selections in neurofunk.', hue: '#ff004d' },
  { title: 'Growth', description: 'Supporting emerging talent in the scene.', hue: '#39ff14' },
]

const RIDER = [
  'Professional DJ equipment',
  'Extensive music library',
  'Custom playlists',
  'Sound system available',
  'Experienced performance',
  'Flexible booking options',
]

/** Fixed meter shapes per channel so each value has its own "level". */
const METERS = [
  [62, 88, 54, 95, 70, 82, 48, 91],
  [44, 72, 90, 58, 84, 66, 93, 52],
  [80, 56, 92, 68, 46, 88, 60, 97],
  [52, 94, 64, 86, 72, 50, 90, 76],
]

const pad = (n: number) => String(n).padStart(2, '0')

export default function ExperienceAndBookingClient({ stats }: { stats: Stats }) {
  const rootRef = useRef<HTMLElement>(null)

  // each block reveals once; the section only animates while on screen
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute('data-in', '')
          reveal.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    root.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el))
    const live = new IntersectionObserver(([e]) => root.toggleAttribute('data-live', e.isIntersecting))
    live.observe(root)
    return () => {
      reveal.disconnect()
      live.disconnect()
    }
  }, [])

  const facts = [
    { n: stats.releases, label: 'Releases' },
    { n: stats.artists, label: 'Artists signed' },
    { n: stats.mixes, label: 'Mix episodes' },
    { n: 174, label: 'BPM, always' },
  ].filter((f) => f.n > 0)

  return (
    <section
      ref={rootRef}
      className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}
      aria-labelledby="about-title"
    >
      {/* ---------- 01 manifesto ---------- */}
      <div className={styles.inner}>
        <header className={styles.head} data-reveal="">
          <p className={styles.kicker}>
            <span className={styles.hot}>About the label //</span> Est. in the low end
          </p>
          <h2 id="about-title" className={styles.title}>
            <span className={styles.outline}>The DnB Doctor</span>
            <span className={styles.solid}>Experience</span>
          </h2>
        </header>

        <div className={styles.manifesto} data-reveal="">
          <p className={styles.statement}>
            More than just a record label. <em>A movement</em> pushing the boundaries of neurofunk and drum &amp; bass.
          </p>
          <p className={styles.mission}>
            Our mission is to cultivate and showcase the most innovative sounds in the scene: from first demos to
            full EPs, from bedroom producers to the main stage.
          </p>
        </div>

        {facts.length > 0 && (
          <dl className={styles.facts} data-reveal="">
            {facts.map((f, i) => (
              <div key={f.label} className={styles.fact} style={{ '--i': i } as CSSProperties}>
                <dt>{f.label}</dt>
                <dd>{f.n}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* values as mixer channel strips */}
        <ol className={styles.values}>
          {VALUES.map((v, i) => (
            <li
              key={v.title}
              className={styles.channel}
              data-reveal=""
              style={{ '--i': i, '--hue': v.hue } as CSSProperties}
            >
              <span className={styles.chHead}>
                <span>CH {pad(i + 1)}</span>
                <i aria-hidden="true" />
              </span>
              <span className={styles.meter} aria-hidden="true">
                {METERS[i].map((h, j) => (
                  <b key={j} style={{ '--h': `${h}%`, '--j': j } as CSSProperties} />
                ))}
              </span>
              <h3 className={styles.chTitle}>{v.title}</h3>
              <p className={styles.chText}>{v.description}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ---------- 02 booking ---------- */}
      <div className={styles.booking} data-reveal="">
        <div className={styles.photo}>
          <span className={styles.photoArt}>
            <Image
              src="/about.jpg"
              alt="Asana playing at a moor.door.music event in Prague"
              fill
              sizes="(max-width: 899px) 100vw, 60vw"
              className={styles.photoImg}
            />
          </span>
          <span className={styles.photoShade} aria-hidden="true" />
          <span className={styles.onAir}>
            <i aria-hidden="true" />Available for bookings
          </span>
          <a
            href="https://www.instagram.com/moor_door_music/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.credit}
          >
            <FaInstagram aria-hidden="true" /> Asana @ moor.door.music, Prague
          </a>
        </div>

        <div className={styles.bookBody}>
          <h3 className={styles.bookTitle}>
            <span className={styles.bookSmall}>Book us at</span>
            <span className={styles.bookBig}>Your party</span>
          </h3>
          <p className={styles.bookText}>
            Want to bring the neurofunk vibes to your event? We offer professional DJ services for clubs, private
            parties and special events.
          </p>

          <div className={styles.rider}>
            <p className={styles.riderHead}>Rider //</p>
            <ul>
              {RIDER.map((r, i) => (
                <li key={r} style={{ '--i': i } as CSSProperties}>
                  <span aria-hidden="true">{pad(i + 1)}</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.bookCtas}>
            <Link href="/contact" className={styles.ctaPrimary}>
              Book now <FaArrowRight aria-hidden="true" />
            </Link>
            <Link href="/music" className={styles.ctaGhost}>
              Listen to music
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- 03 sign-off ---------- */}
      <nav className={styles.signoff} aria-label="Label">
        <Link href="/contact" className={styles.split} data-tone="green">
          <span className={styles.splitKick}>01 // Get involved</span>
          <span className={styles.splitWord}>Join the movement</span>
          <span className={styles.splitArrow} aria-hidden="true">→</span>
        </Link>
        <Link href="/about" className={styles.split} data-tone="purple">
          <span className={styles.splitKick}>02 // The story</span>
          <span className={styles.splitWord}>About DnB Doctor</span>
          <span className={styles.splitArrow} aria-hidden="true">→</span>
        </Link>
      </nav>
    </section>
  )
}
