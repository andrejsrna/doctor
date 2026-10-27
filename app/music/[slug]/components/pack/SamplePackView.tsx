import Image from 'next/image'
import Link from 'next/link'
import BuyButton, { type BuyOffer } from '@/app/components/shop/BuyButton'
import AddToCartButton from '@/app/components/shop/AddToCartButton'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import { formatBytes, type PackManifest } from '@/lib/shop/pack'
import PackPlayer from './PackPlayer'
import StickyBuy from './StickyBuy'
import { contentsLine, itemTitle } from './packText'
import styles from './pack.module.css'

export type PackArtist = { name: string; slug: string | null; imageUrl: string | null }

export const packFaq = (m: PackManifest | null) => [
  {
    q: 'Can I use these sounds in tracks I release?',
    a: 'Yes. The sounds are licensed royalty-free for your own music productions, including commercially released tracks, remixes, DJ sets and video soundtracks. You may not resell, share or redistribute the samples on their own or inside another sample pack, library or preset bank.',
  },
  {
    q: 'How do I get the files?',
    a: 'Pay by card through Stripe and the download link arrives by email straight away. Your purchase also stays in My account: sign in with the email you used at checkout to download it again.',
  },
  {
    q: 'What do I need to use the pack?',
    a: `${m?.audio ? `The loops are ${m.audio.bits}-bit / ${m.audio.sampleRate / 1000} kHz ${m.audio.format} files that work in any DAW. ` : ''}${m?.groups.some((g) => g.kind === 'preset') ? 'The .fxp presets need Xfer Serum. ' : ''}${m?.abletonWarp ? 'Ableton warp files (.asd) are included.' : ''}`.trim() || 'Any DAW that opens WAV files.',
  },
  {
    q: 'Is VAT included?',
    a: 'The seller is not a VAT payer, so the price shown is the final price. A sales receipt is emailed to you automatically.',
  },
]

export default function SamplePackView({
  slug,
  title,
  coverUrl,
  offer,
  manifest,
  artist,
  storyHtml,
}: {
  slug: string
  title: string
  coverUrl?: string
  offer: BuyOffer
  manifest: PackManifest | null
  artist: PackArtist | null
  storyHtml?: string
}) {
  const m = manifest
  const audioFiles = m?.groups.filter((g) => g.kind === 'audio').reduce((n, g) => n + g.items.length, 0) ?? 0
  const words = title.split(/\s+/)
  const faq = packFaq(m)

  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      {/* ============ HERO ============ */}
      <section className={styles.hero} aria-labelledby="pack-title">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroInner}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/">DnB Doctor</Link>
            <span aria-hidden="true">/</span>
            <Link href="/sample-packs">Sample packs</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>

          <div className={styles.heroCols}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>
                <span className={styles.badge}>Sample pack</span>
                {artist && (
                  <span>
                    by{' '}
                    {artist.slug ? <Link href={`/artists/${artist.slug}`}>{artist.name}</Link> : artist.name}
                  </span>
                )}
                <span>174 BPM</span>
                {m?.audio && <span>{m.audio.format} {m.audio.bits}-bit</span>}
              </p>
              <h1 id="pack-title" className={styles.title}>
                {words.map((w, i) => (
                  <span key={i} data-accent={i === words.length - 1 ? '' : undefined}>{w}</span>
                ))}
              </h1>
              {m && <p className={styles.lede}>{contentsLine(m)}</p>}

              <div id="pack-buy" className={styles.buyBox}>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{offer.price}</span>
                  <span className={styles.priceNote}>Final price<br />Instant download</span>
                </div>
                <div className={styles.buyActions}>
                  <BuyButton offer={offer} className={styles.buy} />
                  <AddToCartButton offer={offer} className={styles.addCart} />
                  {m && audioFiles > 0 && (
                    <a className={styles.listen} href="#sounds">
                      Hear the sounds <span aria-hidden="true">↓</span>
                    </a>
                  )}
                </div>
                <ul className={styles.perks}>
                  {m && <li>ZIP · {formatBytes(m.zipBytes)} · {m.fileCount} files</li>}
                  <li>Royalty-free licence</li>
                  <li>Card payment by Stripe</li>
                  <li>Re-download from <Link href="/account">My account</Link></li>
                </ul>
              </div>
            </div>

            <div className={styles.boxStage}>
              <div className={styles.box}>
                {coverUrl && <Image src={coverUrl} alt={`${title} cover`} fill priority sizes="(max-width: 900px) 80vw, 460px" className={styles.boxImg} />}
                <span className={styles.spine} aria-hidden="true">{title} · DnB Doctor</span>
                <span className={styles.glare} aria-hidden="true" />
              </div>
              {m && (
                <>
                  <span className={`${styles.sticker} ${styles.stickerA}`} aria-hidden="true">{m.fileCount}<small>files</small></span>
                  <span className={`${styles.sticker} ${styles.stickerB}`} aria-hidden="true">174<small>BPM</small></span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTENTS STATS ============ */}
      {m && (
        <section className={styles.stats} aria-label="What's inside">
          {m.groups.map((g, i) => (
            <a key={g.id} href={g.kind === 'audio' ? '#sounds' : '#zip'} className={styles.stat} style={{ '--i': i } as React.CSSProperties}>
              <b>{String(g.items.length).padStart(2, '0')}</b>
              <span>{g.label}</span>
            </a>
          ))}
          {m.audio && (
            <div className={styles.stat}>
              <b>{m.audio.bits}<small>bit</small></b>
              <span>{m.audio.sampleRate / 1000} kHz {m.audio.channels === 2 ? 'stereo' : 'mono'}</span>
            </div>
          )}
          <div className={styles.stat}>
            <b>{Math.round(m.zipBytes / 1e6)}<small>MB</small></b>
            <span>One ZIP download</span>
          </div>
        </section>
      )}

      {/* ============ SOUNDS ============ */}
      {m && audioFiles > 0 && (
        <section id="sounds" className={styles.section} aria-labelledby="sounds-title">
          <header className={styles.head}>
            <p className={styles.kicker}>01 // Audition</p>
            <h2 id="sounds-title" className={styles.h2}>Hear every loop</h2>
            <p className={styles.sub}>All {audioFiles} loops are cut on the grid at 174 BPM. Hit play, switch on loop and the step clock shows where you are in the bar.</p>
          </header>
          <PackPlayer groups={m.groups} />
        </section>
      )}

      {/* ============ ZIP TREE ============ */}
      {m && (
        <section id="zip" className={styles.section} aria-labelledby="zip-title">
          <header className={styles.head}>
            <p className={styles.kicker}>02 // Contents</p>
            <h2 id="zip-title" className={styles.h2}>What&apos;s in the ZIP</h2>
          </header>
          <div className={styles.tree}>
            {m.groups.map((g, gi) => (
              <details key={g.id} open={gi === 0 || g.kind === 'preset'}>
                <summary>
                  <span className={styles.folder}>{g.folder}/</span>
                  <span>{g.items.length} {g.kind === 'preset' ? 'Serum presets (.fxp)' : `${g.items[0]?.name.split('.').pop()?.toUpperCase()} files`}</span>
                </summary>
                <ul>
                  {g.items.map((it, i) => (
                    <li key={it.name}>
                      <span className={styles.fileName}>{it.name}</span>
                      <span className={styles.fileMeta}>
                        {itemTitle(g, i)}
                        {it.key ? ` · ${it.key}` : ''}
                        {it.bars ? ` · ${it.bars} bars` : ''} · {formatBytes(it.bytes)}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            {m.abletonWarp && <p className={styles.treeNote}>+ Ableton warp files (.asd) for every loop</p>}
          </div>
        </section>
      )}

      {/* ============ DELIVERY + LICENCE ============ */}
      <section className={styles.section} aria-labelledby="how-title">
        <header className={styles.head}>
          <p className={styles.kicker}>03 // Delivery &amp; licence</p>
          <h2 id="how-title" className={styles.h2}>Pay. Download. Produce.</h2>
        </header>
        <ol className={styles.steps}>
          <li><b>01</b><span>Pay by card</span><p>Secure checkout by Stripe. No account needed.</p></li>
          <li><b>02</b><span>Get the link</span><p>Your download link and sales receipt arrive by email right after payment.</p></li>
          <li><b>03</b><span>Keep it</span><p>Download again any time from <Link href="/account">My account</Link> with the same email.</p></li>
        </ol>
        <div className={styles.licence}>
          <div>
            <p className={styles.kicker}>Royalty-free licence</p>
            <ul className={styles.yes}>
              <li>Your own productions and commercially released tracks</li>
              <li>Remixes, DJ sets and video soundtracks</li>
            </ul>
          </div>
          <div>
            <p className={styles.kicker} data-tone="no">Not allowed</p>
            <ul className={styles.no}>
              <li>Reselling, sharing or uploading the samples on their own</li>
              <li>Using them inside another sample pack, library or preset bank</li>
            </ul>
          </div>
          <p className={styles.licenceLink}>Personal, non-transferable licence. Full wording in the <Link href="/terms#digital-products">terms</Link>.</p>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      {(storyHtml || artist) && (
        <section className={`${styles.section} ${styles.about}`} aria-labelledby="about-title">
          <div>
            <p className={styles.kicker}>04 // About the pack</p>
            <h2 id="about-title" className={styles.h2}>{title}</h2>
            {storyHtml && <div className={styles.prose} dangerouslySetInnerHTML={{ __html: storyHtml }} />}
          </div>
          {artist && (
            <aside className={styles.artist}>
              {artist.imageUrl && (
                <span className={styles.artistImg}>
                  <Image src={artist.imageUrl} alt={artist.name} fill sizes="160px" />
                </span>
              )}
              <p className={styles.kicker}>Sound design</p>
              <p className={styles.artistName}>{artist.name}</p>
              {artist.slug && <Link className={styles.listen} href={`/artists/${artist.slug}`}>Artist profile →</Link>}
            </aside>
          )}
        </section>
      )}

      {/* ============ FAQ ============ */}
      <section className={styles.section} aria-labelledby="faq-title">
        <header className={styles.head}>
          <p className={styles.kicker}>05 // FAQ</p>
          <h2 id="faq-title" className={styles.h2}>Before you buy</h2>
        </header>
        <div className={styles.faq}>
          {faq.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <div className={styles.final}>
          <span className={styles.price}>{offer.price}</span>
          <BuyButton offer={offer} className={styles.buy} label={`Get ${title}`} />
        </div>
      </section>

      <StickyBuy offer={offer} title={title} watch="pack-buy" />
      <span hidden data-pack-view={slug} />
    </div>
  )
}
