import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight, FaSyringe } from 'react-icons/fa'
import { prisma } from '@/lib/prisma'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import GalleryVideo from './components/GalleryVideo'
import styles from './about.module.css'

export const revalidate = 3600

const FOUNDED = 2015

const SOCIALS = [
  'https://www.instagram.com/dnbdoctor/',
  'https://www.youtube.com/@dnbdoctor1',
  'https://soundcloud.com/dnbdoctor',
  'https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP',
  'https://discord.gg/GE2HWFdgXG',
]

const FEATURED_CREW = [
  {
    name: 'Anne',
    role: 'Community manager & playlist',
    image: '/anne.jpg',
    email: 'anne@dnbdoctor.com',
    description: 'Contact me regarding playlist inquiries and curation.',
  },
  {
    name: 'Andrej',
    role: 'Distribution and releases',
    image: '/andrej.jpg',
    email: 'releases@dnbdoctor.com',
    description: 'Release planning, distribution and everything that gets your track out.',
  },
]

const CREW = [
  { name: 'Yehor', role: 'Sound Engineer', image: '/yehor.jpg' },
  { name: 'Christopher', role: 'Talent Scout', image: '/christopher.jpeg' },
  { name: 'Jaroslav', role: 'Creative Strategist', image: '/jaroslav.jpeg' },
]

const GALLERY = [
  { src: '/gallery/wax.jpeg', alt: 'DnB Doctor Live Performance', title: 'Live at Wax', year: '2024', description: "Packed house, great vibe — a set we won't forget." },
  { video: '/gallery/neurotikum.mp4', src: '/gallery/cooking.jpeg', alt: 'DnB Doctor in Action', title: 'Cooking with Neurotikum', year: '2023', description: 'Sun in our faces, fresh neurofunk from the speakers.' },
  { src: '/gallery/minidynamo.jpeg', alt: 'Studio Session', title: 'Mini & Dynamo', year: '2023 · 2021', description: 'The best neurofunk cats in the game, together at last.' },
  { src: '/gallery/moordoor.jpeg', alt: 'Live Event', title: 'Moordoor', year: '2024', description: 'Prague. Heavy. Exactly how it should be.' },
  { src: '/gallery/asana-prague-2025.jpg', alt: 'Asana plays Double Trouble Prague', title: 'Double Trouble Prague', year: '2025', description: 'Asana on the decks — Double Trouble, Prague.' },
]

const pad = (n: number) => String(n).padStart(2, '0')

/** round down to a tidy "140+" so the copy never overstates */
const floorPlus = (n: number, step = 10) => `${Math.max(step, Math.floor(n / step) * step)}+`

async function liveCounts() {
  if (!process.env.DATABASE_URL) return null
  try {
    const [releases, artists] = await Promise.all([prisma.release.count(), prisma.artist.count()])
    return { releases, artists }
  } catch {
    return null
  }
}

export default async function AboutPage() {
  const live = await liveCounts()
  const years = new Date().getUTCFullYear() - FOUNDED
  const releases = live ? floorPlus(live.releases) : '100+'
  const artists = live ? floorPlus(live.artists) : '50+'

  const stats = [
    { value: releases, label: 'Releases', note: 'on the label' },
    { value: artists, label: 'Artists', note: 'credited' },
    { value: '50K+', label: 'Monthly listeners', note: 'across platforms' },
    { value: '10K+', label: 'Social followers', note: 'and counting' },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: 'https://dnbdoctor.com/about',
    name: 'About DnB Doctor',
    mainEntity: {
      '@type': 'Organization',
      name: 'DnB Doctor',
      url: 'https://dnbdoctor.com',
      logo: 'https://dnbdoctor.com/logo-1.png',
      foundingDate: String(FOUNDED),
      description: 'Independent neurofunk & drum and bass label.',
      sameAs: SOCIALS,
      contactPoint: FEATURED_CREW.map((m) => ({ '@type': 'ContactPoint', email: m.email, contactType: m.role })),
    },
  }

  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- hero ---------- */}
      <header className={styles.hero}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <span aria-current="page">About</span>
          <span className={styles.crumbMeta}>
            <span className={styles.dot} aria-hidden="true" /> Since {FOUNDED} {'//'} 174 BPM
          </span>
        </nav>

        <h1 className={styles.title}>
          <span className={styles.outline}>DnB</span>
          <span className={styles.solid}>Doctor.</span>
        </h1>

        <div className={styles.heroSide}>
          <p className={styles.tag}>Since {FOUNDED} · Neurofunk · DNB</p>
          <p className={styles.lede}>Your premier destination for drum and bass music, news, and culture.</p>
          <p className={styles.age}>
            <span>{pad(years)}</span> years on the frequency
          </p>
        </div>
      </header>

      {/* ---------- mission ---------- */}
      <section className={styles.mission} aria-labelledby="mission-label">
        <p id="mission-label" className={styles.label}>
          01 / Mission
        </p>
        <div>
          <p className={styles.missionText}>
            We&apos;re dedicated to promoting and preserving drum and bass culture —{' '}
            <em>connecting artists with fans</em> and providing a platform for the best electronic music on the planet.
          </p>
          <div className={styles.actions}>
            <Link href="/music" className={styles.cta}>
              <FaSyringe aria-hidden="true" /> The DnB Doctor Experience
            </Link>
            <Link href="/artists" className={styles.ghost}>
              Meet the artists <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- doctor & you ---------- */}
      <section className={styles.split} aria-label="The Doctor and You">
        <article className={styles.panel} data-tone="purple">
          <p className={styles.subject}>
            <span className={styles.dot} aria-hidden="true" /> Subject_01 · Label · Est. {FOUNDED}
          </p>
          <span className={styles.ghostWord} aria-hidden="true">
            Rx
          </span>
          <p className={styles.panelKicker}>The Doctor.</p>
          <h2 className={styles.panelTitle}>
            {years} years.
            <br />
            One obsession.
            <br />
            No apologies.
          </h2>
          <ol className={styles.points}>
            <li>Surgical curation — only the heaviest drops make the cut.</li>
            <li>Independent since {FOUNDED}. Beholden to no one but the music.</li>
            <li>
              {releases} releases. {artists} artists. One relentless standard.
            </li>
          </ol>
          <p className={styles.badge}>Diagnosis: Neurofunk · Prescription: Active</p>
        </article>

        <article className={styles.panel} data-tone="green">
          <p className={styles.subject}>
            <span className={styles.dot} aria-hidden="true" /> Subject_02 · Listener · Status: Active
          </p>
          <span className={styles.ghostWord} aria-hidden="true">
            You
          </span>
          <p className={styles.panelKicker}>You.</p>
          <h2 className={styles.panelTitle}>
            You hear
            <br />
            what others
            <br />
            can only feel.
          </h2>
          <ol className={styles.points}>
            <li>You came for the bass. You stayed for everything else.</li>
            <li>You know the difference between heavy and just loud.</li>
            <li>You don&apos;t need an explanation. The drop speaks for itself.</li>
          </ol>
          <p className={styles.badge}>Classification: One of us</p>
        </article>

        <p className={styles.diag} aria-hidden="true">
          <span>DNB-Doctor-Diagnostics {'//'} Ref-{FOUNDED}-Neurofunk</span>
          <span>System: Online {'//'} Bass: Prescribed</span>
        </p>
      </section>

      {/* ---------- stats ---------- */}
      <section className={styles.stats} aria-labelledby="stats-label">
        <p id="stats-label" className={styles.label}>
          02 / Signal
        </p>
        <dl className={styles.statGrid}>
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
              <span>{s.note}</span>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- crew ---------- */}
      <section className={styles.crew} aria-labelledby="crew-title">
        <div className={styles.sectionHead}>
          <p className={styles.label}>03 / People</p>
          <h2 id="crew-title" className={styles.h2}>
            Meet the <span className={styles.outline}>crew.</span>
          </h2>
        </div>

        <div className={styles.featured}>
          {FEATURED_CREW.map((m) => (
            <article key={m.name} className={styles.lead}>
              <div className={styles.portrait}>
                <Image src={m.image} alt={m.name} fill sizes="(max-width: 700px) 40vw, 220px" />
              </div>
              <div className={styles.leadBody}>
                <p className={styles.role}>{m.role}</p>
                <h3 className={styles.name}>{m.name}</h3>
                <p className={styles.desc}>{m.description}</p>
                <a href={`mailto:${m.email}`} className={styles.mail}>
                  {m.email} <FaArrowRight aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <ul className={styles.team}>
          {CREW.map((m, i) => (
            <li key={m.name} className={styles.member}>
              <div className={styles.photo}>
                <Image src={m.image} alt={m.name} fill sizes="(max-width: 700px) 50vw, 25vw" />
                <span className={styles.idx} aria-hidden="true">
                  {pad(i + 3)}
                </span>
              </div>
              <p className={styles.role}>{m.role}</p>
              <h3 className={styles.memberName}>{m.name}</h3>
            </li>
          ))}
          <li className={`${styles.member} ${styles.open}`}>
            <Link href="/contact" className={styles.openLink}>
              <span className={styles.openSlot} aria-hidden="true">
                +
              </span>
              <span className={styles.role}>Suggest your role</span>
              <span className={styles.memberName}>Your name here</span>
              <span className={styles.openNote}>
                We&apos;re looking for more team members. Get in touch <FaArrowRight aria-hidden="true" />
              </span>
            </Link>
          </li>
        </ul>
      </section>

      {/* ---------- gallery ---------- */}
      <section className={styles.gallery} aria-labelledby="gallery-title">
        <div className={styles.sectionHead}>
          <p className={styles.label}>04 / Gallery</p>
          <h2 id="gallery-title" className={styles.h2}>
            Doctor <span className={styles.amp}>&amp;</span> You.
          </h2>
          <p className={styles.sectionLede}>Studio sessions. Live sets. Moments that built the culture.</p>
        </div>

        <ul className={styles.frames}>
          {GALLERY.map((g, i) => (
            <li key={g.title} className={styles.frame}>
              <figure>
                <div className={styles.shot}>
                  {g.video ? (
                    <GalleryVideo src={g.video} poster={g.src} label={g.title} />
                  ) : (
                    <Image src={g.src} alt={g.alt} fill sizes={i === 0 ? '(max-width: 900px) 100vw, 60vw' : '(max-width: 900px) 100vw, 40vw'} />
                  )}
                  <span className={styles.idx} aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                </div>
                <figcaption>
                  <span className={styles.year}>{g.year}</span>
                  <h3 className={styles.frameTitle}>{g.title}</h3>
                  <p>{g.description}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- outro ---------- */}
      <section className={styles.outro}>
        <p className={styles.label}>05 / Join</p>
        <h2 className={styles.outroTitle}>
          Got the <span className={styles.outline}>sound?</span>
        </h2>
        <div className={styles.actions}>
          <Link href="/submit-demo" className={styles.cta}>
            Submit your demo <FaArrowRight aria-hidden="true" />
          </Link>
          <Link href="/contact" className={styles.ghost}>
            Contact the crew
          </Link>
        </div>
      </section>
    </div>
  )
}

const DESCRIPTION =
  'DnB Doctor is an independent neurofunk & drum and bass label since 2015 — releases, mixes and a crew connecting artists with fans.'

export const metadata: Metadata = {
  title: 'About DnB Doctor | Neurofunk Label',
  description: DESCRIPTION,
  keywords: 'dnb doctor, drum and bass, neurofunk, electronic music, music label',
  alternates: { canonical: 'https://dnbdoctor.com/about' },
  openGraph: {
    title: 'About DnB Doctor | Neurofunk Label',
    description: DESCRIPTION,
    url: 'https://dnbdoctor.com/about',
    siteName: 'DnB Doctor',
    images: [{ url: 'https://dnbdoctor.com/aboutus.jpg', width: 1200, height: 630, alt: 'DnB Doctor - Neurofunk Label' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About DnB Doctor | Neurofunk Label',
    description: DESCRIPTION,
    images: ['https://dnbdoctor.com/aboutus.jpg'],
  },
}
