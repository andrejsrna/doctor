import Image from 'next/image'
import Link from 'next/link'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { shortDate } from '@/app/utils/shortDate'
import { producerLinks } from '@/lib/affiliates'
import { COLLECTIONS, KINDS, MIXES_PATH, type CollectionItem, type CollectionKind } from './collections'
import { PreviewButton, StoreLink } from './CollectionClient'
import styles from './collections.module.css'

const SITE = 'https://dnbdoctor.com'
/** buy/download stores get a full button, the rest are small streaming chips */
const PRIMARY = new Set(['Beatport', 'Bandcamp', 'Gumroad'])

function Extra({ kind, items }: { kind: CollectionKind; items: CollectionItem[] }) {
  if (kind === 'albums' || kind === 'music-packs') {
    const newest = items[0]
    const list = (from: number) => (
      <>
        {items.slice(from, from + 4).map((r, i, arr) => (
          <span key={r.id}>
            {i > 0 && (i === arr.length - 1 ? ' and ' : ', ')}
            <Link href={`/music/${r.slug}`}>{r.title}</Link>
            {r.artist && ` by ${r.artist}`}
          </span>
        ))}
      </>
    )
    return kind === 'albums' ? (
      <section className={styles.extra} aria-labelledby="extra-title">
        <h2 id="extra-title" className={styles.h2}>
          About these <span className={styles.outline}>DnB albums</span>
        </h2>
        <div className={styles.prose}>
          <p>
            A drum and bass album is a full-length release — an artist LP or a label compilation — built to be heard front to back rather than as a
            single track. On DnB Doctor that means neurofunk: rolling, heavily modulated basslines and tight 172–175 BPM drums. If you are new to the
            sound, start with <Link href="/neurofunk-dnb">what neurofunk is</Link> or the wider guide to{' '}
            <Link href="/types-of-dnb">drum and bass subgenres</Link>.
          </p>
          {items.length > 0 && (
            <p>
              The collection currently holds {items.length} {items.length === 1 ? 'album' : 'albums'}: {list(0)}. Every release page links to the stores and
              streaming services that carry it, and the artists behind the tracks are on the <Link href="/artists">DnB Doctor roster</Link>.
            </p>
          )}
          <p>
            Want more? New singles and EPs land in the <Link href="/music">full catalogue</Link>, continuous sets live in{' '}
            <Link href="/neurofunk-dnb-mixes">neurofunk mixes</Link>, and producers working on a full-length project can{' '}
            <Link href="/submit-demo">submit an album demo</Link>.
          </p>
        </div>
      </section>
    ) : (
      <section className={styles.extra} aria-labelledby="extra-title">
        <h2 id="extra-title" className={styles.h2}>
          What is a <span className={styles.outline}>music pack</span>?
        </h2>
        <div className={styles.prose}>
          <p>
            A DnB Doctor music pack is a compilation or a continuous label mix that collects tracks from several artists on the roster into one
            release — a snapshot of a quarter or a whole year of neurofunk.
            {newest && (
              <>
                {' '}
                The newest is <Link href={`/music/${newest.slug}`}>{newest.title}</Link>.
              </>
            )}
          </p>
          {items.length > 1 && (
            <p>
              Earlier packs: {list(1)}. Open a release to preview it and find every store and streaming service that carries it; the full-length ones are also listed under <Link href="/albums">albums</Link>.
            </p>
          )}
          <p>
            Looking for neurofunk <em>sound</em> packs to produce with? Those are samples, not finished music — grab the{' '}
            <Link href="/sample-packs">free neurofunk sample pack</Link> and follow the{' '}
            <Link href="/how-to-produce-neurofunk">neurofunk production guide</Link>.
          </p>
        </div>
      </section>
    )
  }
  if (kind === 'sample-packs') {
    const features = [
      ['Rolling Basslines', 'High-quality neurofunk bass samples with complex modulation, perfect for creating the signature rolling basslines that define the genre.'],
      ['Complex Drums', 'Professional drum loops and one-shots featuring intricate patterns, tight kicks, and crisp snares engineered for neurofunk productions.'],
      ['Dark Atmospheres', 'Atmospheric pads, industrial textures, and sci-fi soundscapes that create the dark, technical aesthetic of neurofunk music.'],
    ]
    return (
      <section className={styles.extra} aria-labelledby="extra-title">
        <h2 id="extra-title" className={styles.h2}>
          Professional <span className={styles.outline}>Neurofunk Samples</span>
        </h2>
        <ol className={styles.features}>
          {features.map(([t, d], i) => (
            <li key={t}>
              <span className={styles.featureNo}>0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <div className={styles.tools}>
          <p className={styles.label}>Get More Samples &amp; Tools</p>
          <div className={styles.toolLinks}>
            {producerLinks.map((l) => (
              <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer sponsored">
                <strong>{l.name}</strong>
                <span>{l.tagline}</span>
              </a>
            ))}
          </div>
          <p className={styles.disclose}>Some links are affiliate links. We may earn a commission at no extra cost to you.</p>
        </div>
      </section>
    )
  }
  return null
}

const counts = (all: Record<CollectionKind, CollectionItem[]>) =>
  Object.fromEntries(KINDS.map((k) => [k, all[k].length])) as Record<CollectionKind, number>

/** Albums, music packs, sample packs and mixes are separate URLs that read as tabs of one page. */
export function CollectionTabs({ current, counts }: { current: CollectionKind | 'mixes'; counts: Record<CollectionKind | 'mixes', number> }) {
  return (
    <nav className={styles.tabs} aria-label="Collections">
      <span className={styles.tabsLabel}>Collections</span>
      {KINDS.map((k) => (
        <Link key={k} href={COLLECTIONS[k].path} aria-current={k === current ? 'page' : undefined} scroll={false}>
          {COLLECTIONS[k].tab} <span>{counts[k]}</span>
        </Link>
      ))}
      <Link href={MIXES_PATH} aria-current={current === 'mixes' ? 'page' : undefined} scroll={false}>
        DJ mixes <span>{counts.mixes}</span>
      </Link>
    </nav>
  )
}

export default function CollectionView({ kind, all, mixes }: { kind: CollectionKind; all: Record<CollectionKind, CollectionItem[]>; mixes: number }) {
  const c = COLLECTIONS[kind]
  const items = all[kind]
  const stack = items.filter((i) => i.cover).slice(0, 4)
  const url = `${SITE}${c.path}`

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${c.h1[0]} ${c.h1[1]}`,
      url,
      description: c.lede,
      isPartOf: { '@type': 'WebSite', name: 'DnB Doctor', url: SITE },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: items.length,
        itemListElement: items.map((r, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': c.itemType,
            name: r.title,
            url: `${SITE}/music/${r.slug}`,
            ...(c.itemType === 'MusicAlbum' && { genre: 'Drum and Bass', recordLabel: { '@type': 'Organization', name: 'DnB Doctor' } }),
            ...(r.artist && { [c.itemType === 'MusicAlbum' ? 'byArtist' : 'creator']: { '@type': 'Person', name: r.artist } }),
            ...(r.cover && { image: r.cover }),
            ...(r.date && { datePublished: r.date.slice(0, 10) }),
          },
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'DnB Doctor', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Music', item: `${SITE}/music` },
        { '@type': 'ListItem', position: 3, name: c.tab, item: url },
      ],
    },
  ]

  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- hero ---------- */}
      <header className={styles.hero}>
        {stack[0]?.cover && (
          <div className={styles.heroBg} aria-hidden="true">
            <Image src={stack[0].cover} alt="" fill priority sizes="100vw" />
          </div>
        )}
        <div className={styles.heroInner}>
          <CollectionTabs current={kind} counts={{ ...counts(all), mixes }} />

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>
                <span className={styles.dot} aria-hidden="true" /> {c.kicker}
              </p>
              <h1 className={styles.title}>
                <span>{c.h1[0]}</span>
                <span className={styles.outline}>{c.h1[1]}</span>
              </h1>
              <p className={styles.lede}>{c.lede}</p>
              <div className={styles.ctas}>
                <a href="#list" className={styles.primary}>
                  Browse {c.tab.toLowerCase()} ↓
                </a>
                <Link href="/music" className={styles.secondary}>
                  Browse All Releases →
                </Link>
                {kind === 'albums' && (
                  <Link href="/submit-demo" className={styles.ghost}>
                    Submit Your Album
                  </Link>
                )}
              </div>
            </div>

            {stack.length > 0 && (
              <div className={styles.stack} style={{ '--n': stack.length } as React.CSSProperties} aria-hidden="true">
                {stack.map((r, i) => (
                  <span key={r.id} className={styles.stackCover} style={{ '--i': i } as React.CSSProperties}>
                    <Image src={r.cover!} alt="" fill sizes="(max-width: 960px) 60vw, 380px" priority={i === 0} />
                  </span>
                ))}
                <span className={styles.stackCount}>
                  <b>{String(items.length).padStart(2, '0')}</b> {items.length === 1 ? c.noun[0] : c.noun[1]}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ---------- list ---------- */}
      <section className={styles.list} id="list" aria-labelledby="list-title">
        <div className={styles.listHead}>
          <h2 id="list-title" className={styles.h2}>
            {c.listTitle[0]} <span className={styles.outline}>{c.listTitle[1]}</span>
          </h2>
          <p>{c.listLede}</p>
        </div>

        {items.length === 0 ? (
          <p className={styles.empty}>
            Nothing here yet. <Link href="/music">Browse all releases →</Link>
          </p>
        ) : (
          <ol className={styles.items}>
            {items.map((r, i) => {
              const primary = r.stores.filter((s) => PRIMARY.has(s.name))
              const streaming = r.stores.filter((s) => !PRIMARY.has(s.name))
              return (
                <li key={r.id} className={styles.item} style={{ '--i': i } as React.CSSProperties}>
                  <Link href={`/music/${r.slug}`} className={styles.cover} tabIndex={-1} aria-hidden="true">
                    {r.cover ? <Image src={r.cover} alt="" fill sizes="(max-width: 700px) 92vw, (max-width: 1100px) 40vw, 460px" /> : <span>No signal</span>}
                    <span className={styles.scan} />
                  </Link>
                  <div className={styles.body}>
                    <p className={styles.meta}>
                      <span className={styles.no}>
                        {String(i + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
                      </span>
                      {r.date && <time dateTime={r.date}>{shortDate(r.date)}</time>}
                      {r.free && <b className={styles.free}>Free download</b>}
                    </p>
                    <h3 className={styles.itemTitle}>
                      <Link href={`/music/${r.slug}`}>{r.title}</Link>
                    </h3>
                    {r.artist && <p className={styles.artist}>{r.artist}</p>}
                    {r.excerpt && <p className={styles.excerpt}>{r.excerpt}</p>}
                    {r.alsoIn.length > 0 && (
                      <p className={styles.also}>
                        Also in{' '}
                        {r.alsoIn.map((k, j) => (
                          <span key={k}>
                            {j > 0 && ', '}
                            <Link href={COLLECTIONS[k].path}>{COLLECTIONS[k].tab}</Link>
                          </span>
                        ))}
                      </p>
                    )}
                    <div className={styles.actions}>
                      <Link href={`/music/${r.slug}`} className={styles.primary}>
                        {r.free ? 'Get it free' : 'Open release'} →
                      </Link>
                      {r.preview && <PreviewButton src={r.preview} slug={r.slug} title={r.title} className={styles.secondary} />}
                      {primary.map((s) => (
                        <StoreLink key={s.name} name={s.name} url={s.url} slug={r.slug} className={styles.secondary}>
                          {s.name === 'Gumroad' ? 'Buy on Gumroad' : s.name}
                        </StoreLink>
                      ))}
                    </div>
                    {streaming.length > 0 && (
                      <p className={styles.streams}>
                        <span>Stream</span>
                        {streaming.map((s) => (
                          <StoreLink key={s.name} name={s.name} url={s.url} slug={r.slug}>
                            {s.name}
                          </StoreLink>
                        ))}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </section>

      <Extra kind={kind} items={items} />

      {/* ---------- other collections ---------- */}
      <nav className={styles.more} aria-labelledby="more-title">
        <h2 id="more-title" className={styles.label}>
          Keep digging
        </h2>
        <ul>
          {KINDS.filter((k) => k !== kind).map((k) => (
            <li key={k}>
              <Link href={COLLECTIONS[k].path}>
                <strong>{COLLECTIONS[k].tab}</strong>
                <span>
                  {all[k].length} {all[k].length === 1 ? COLLECTIONS[k].noun[0] : COLLECTIONS[k].noun[1]}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/neurofunk-dnb-mixes">
              <strong>Neurofunk mixes</strong>
              <span>DJ mixes &amp; podcasts</span>
            </Link>
          </li>
          <li>
            <Link href="/music">
              <strong>All releases</strong>
              <span>The full catalogue</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
