import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight, FaInstagram, FaSoundcloud, FaSpotify } from 'react-icons/fa'
import { prisma } from '@/lib/prisma'
import { getRosterArtists, type RosterArtist } from '@/lib/artistRoster'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { plainTitle, splitTitle } from '@/app/components/hero/releaseMeta'
import styles from './artists.module.css'
import SeoAbout, { faqLd, type FaqItem } from '@/app/components/SeoAbout'

/** Same scene names as the /neurofunk-dnb artists section. */
const SCENE = ['Noisia', 'Phace', 'Mefjus', 'Black Sun Empire', 'Ed Rush & Optical', 'Gydra', 'Joe Ford']

export const revalidate = 600

const pad = (n: number) => String(n).padStart(2, '0')

async function load() {
  // CI/Docker builds may not have DATABASE_URL or DB connectivity: render an empty roster then.
  if (!process.env.DATABASE_URL) return { artists: [] as RosterArtist[], total: 0, releases: 0 }
  try {
    const [{ artists, total }, releases] = await Promise.all([
      getRosterArtists(60),
      prisma.release.count({ where: { publishedAt: { not: null } } }),
    ])
    return { artists, total, releases }
  } catch {
    return { artists: [] as RosterArtist[], total: 0, releases: 0 }
  }
}

export default async function ArtistsPage() {
  const { artists, total, releases } = await load()
  const newest = artists[0]
  const newestNames = artists.slice(0, 3).map((a) => a.name)
  const list = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : (names[0] ?? ''))

  const faq: FaqItem[] = [
    {
      question: 'Who are the best neurofunk artists?',
      answer: `Names most often cited as the reference points of neurofunk are ${list(SCENE)}. On the DnB Doctor label you can also discover newer producers such as ${list(newestNames)}.`,
    },
    {
      question: 'Which artists are on the DnB Doctor roster?',
      answer: `DnB Doctor currently lists ${total} neurofunk and drum & bass artists${newestNames.length ? `, the newest being ${list(newestNames)}` : ''}. Each profile lists the artist's DnB Doctor releases.`,
    },
    {
      question: 'How can a producer join DnB Doctor?',
      answer:
        'Send unreleased neurofunk or drum & bass tracks through the demo form. DnB Doctor signs producers for the long run: releases, artwork, promo and a catalog that grows with the artist.',
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'DnB Doctor neurofunk artists',
      numberOfItems: artists.length,
      itemListElement: artists.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://dnbdoctor.com/artists/${a.slug}`,
        name: a.name,
      })),
    },
    faqLd(faq),
  ]

  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className={styles.head}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <span aria-current="page">Artists</span>
          <span className={styles.crumbMeta}>
            Roster <b>{pad(total)}</b> {'//'} 174 BPM
          </span>
        </nav>

        <h1 className={styles.title}>
          <span className={styles.outline}>Neurofunk</span>
          <span className={styles.solid}>Artists</span>
        </h1>

        <div className={styles.intro}>
          <p className={styles.lede}>
            The neurofunk artists and drum &amp; bass producers of DnB Doctor — building catalogs over time and shaping the{' '}
            <strong>sound, the image and the direction</strong> of the label.
          </p>
          <div className={styles.actions}>
            <Link href="/submit-demo" className={styles.primary}>
              Submit demo <FaArrowRight aria-hidden="true" />
            </Link>
            <Link href="/music" className={styles.ghost}>
              Releases
            </Link>
          </div>
        </div>

        <dl className={styles.stats}>
          <div>
            <dt>Artists signed</dt>
            <dd>{pad(total)}</dd>
          </div>
          <div>
            <dt>Releases out</dt>
            <dd>{releases}</dd>
          </div>
          {newest && (
            <div>
              <dt>Newest signing</dt>
              <dd className={styles.statName}>
                <Link href={`/artists/${newest.slug}`}>{newest.name}</Link>
              </dd>
            </div>
          )}
        </dl>
      </header>

      <section className={styles.roster} aria-labelledby="roster-title">
        <div className={styles.rosterHead}>
          <h2 id="roster-title">
            Featured <span>Neurofunk Artists</span>
          </h2>
          <p aria-hidden="true">Newest first</p>
        </div>

        {artists.length === 0 ? (
          <p className={styles.empty}>No artists to show right now.</p>
        ) : (
          <ol className={styles.grid}>
            {artists.map((a, i) => {
              const latest = a.latest ? splitTitle(plainTitle(a.latest.title), null).title : null
              const big = i < 2
              return (
                <li key={a.id} className={big ? styles.big : undefined} style={{ ['--i' as string]: i }}>
                  <article className={styles.card}>
                    <div className={styles.photo}>
                      {a.imageUrl && (
                        <Image
                          src={a.imageUrl}
                          alt={`Neurofunk artist ${a.name}`}
                          fill
                          priority={i < 2}
                          sizes={big ? '(max-width: 767px) 100vw, 50vw' : '(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw'}
                        />
                      )}
                    </div>
                    <span className={styles.index} aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                    <span className={styles.count}>
                      {a.releases ? `${a.releases} release${a.releases === 1 ? '' : 's'}` : 'New signing'}
                    </span>

                    <div className={styles.body}>
                      <h3 className={styles.name}>
                        <Link href={`/artists/${a.slug}`} className={styles.stretch} data-text={a.name}>
                          {a.name}
                        </Link>
                      </h3>
                      {a.latest && latest && (
                        <p className={styles.latest}>
                          <span>Latest</span>
                          <Link href={`/music/${a.latest.slug}`}>{latest}</Link>
                        </p>
                      )}
                      <div className={styles.links}>
                        {a.soundcloud && (
                          <a href={a.soundcloud} target="_blank" rel="noopener noreferrer" aria-label={`${a.name} on SoundCloud`}>
                            <FaSoundcloud aria-hidden="true" />
                          </a>
                        )}
                        {a.spotify && (
                          <a href={a.spotify} target="_blank" rel="noopener noreferrer" aria-label={`${a.name} on Spotify`}>
                            <FaSpotify aria-hidden="true" />
                          </a>
                        )}
                        {a.instagram && (
                          <a href={a.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${a.name} on Instagram`}>
                            <FaInstagram aria-hidden="true" />
                          </a>
                        )}
                        <span className={styles.profile} aria-hidden="true">
                          View profile <FaArrowRight />
                        </span>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ol>
        )}
      </section>

      <SeoAbout
        id="about-artists"
        faq={faq}
        title={
          <>
            Neurofunk <span>artists</span>
          </>
        }
      >
        <p>
          <strong>Neurofunk artists</strong> make the dark, technical side of drum and bass: precise two-step drums at 174 BPM and heavily
          designed, modulated basslines. The scene&apos;s reference names include {list(SCENE)} — more about them in the{' '}
          <Link href="/neurofunk-dnb#artists">neurofunk guide</Link>.
        </p>
        <p>
          The {total} producers above are the DnB Doctor roster
          {newestNames.length > 0 && <>, newest first — currently {list(newestNames)}</>}. Open a profile for their releases, or browse
          every track in <Link href="/music">new drum and bass releases</Link>. Labels with a similar sound are collected in{' '}
          <Link href="/neurofunk-labels">neurofunk &amp; DnB labels</Link>.
        </p>
      </SeoAbout>

      <section className={styles.outro} aria-labelledby="join-title">
        <p className={styles.kicker}>Open channel {'//'} demos welcome</p>
        <h2 id="join-title" className={styles.outroTitle}>
          <span className={styles.outline}>Your name</span> <span>here next?</span>
        </h2>
        <p className={styles.outroText}>We sign producers for the long run — releases, artwork, promo and a catalog that grows with you.</p>
        <div className={styles.actions}>
          <Link href="/submit-demo" className={styles.primary}>
            Submit your demo <FaArrowRight aria-hidden="true" />
          </Link>
          <Link href="/contact" className={styles.ghost}>
            Contact
          </Link>
        </div>
      </section>
    </div>
  )
}
