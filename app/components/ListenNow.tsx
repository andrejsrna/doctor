'use client'

import { useEffect, useRef } from 'react'
import { FaCompactDisc, FaSoundcloud, FaSpotify, FaYoutube } from 'react-icons/fa'
import ChannelStack, { type Channel } from '@/app/components/ChannelStack'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import styles from './ListenNow.module.css'

const CHANNELS: Channel[] = [
  {
    id: 'spotify-monthly',
    icon: FaSpotify,
    kicker: 'Playlist // Monthly',
    word: 'Selection',
    note: 'The freshest, darkest and most technical neurofunk cuts, hand-picked every month.',
    cta: 'Follow on Spotify',
    href: 'https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9',
    hue: '#1ed760',
    thumb: '/playlists/monthly.jpg',
    priority: true,
  },
  {
    id: 'spotify-releases',
    icon: FaSpotify,
    kicker: 'Playlist // Label',
    word: 'Exclusives',
    note: 'Every track released by DnB Doctor artists, from YEHOR and Asana to Warp Fa2e and more.',
    cta: 'Follow on Spotify',
    href: 'https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP?si=4857d6cfb8154f51',
    hue: '#9b5eff',
    thumb: '/playlists/ours.jpg',
  },
  {
    id: 'youtube',
    icon: FaYoutube,
    kicker: 'Video',
    word: 'YouTube',
    note: 'Premieres, visuals, DJ sets and behind-the-scenes content you will not find anywhere else.',
    cta: 'Subscribe on YouTube',
    href: 'https://www.youtube.com/@dnbdoctor1',
    hue: '#ff004d',
  },
  {
    id: 'soundcloud',
    icon: FaSoundcloud,
    kicker: 'Early access',
    word: 'SoundCloud',
    note: 'Demos, works in progress and releases before they hit every other platform.',
    cta: 'Follow on SoundCloud',
    href: 'https://soundcloud.com/dnbdoctor',
    hue: '#ff6a00',
  },
  {
    id: 'music-packs',
    icon: FaCompactDisc,
    kicker: 'Long-form',
    word: 'Music Packs',
    note: 'Curated compilations and full albums with the finest neurofunk from the roster.',
    cta: 'Explore music packs',
    href: '/music-packs',
    hue: '#39ff14',
  },
]

export default function ListenNow() {
  const rootRef = useRef<HTMLElement>(null)

  // reveal rows once as they scroll in (CSS does the motion)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute('data-in', '')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={rootRef}
      id="listen-now"
      className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}
      aria-labelledby="listen-now-title"
    >
      <div className={styles.inner}>
        <header className={styles.head} data-reveal="">
          <p className={styles.kicker}>
            <span className={styles.hot}>Listen &amp; follow //</span> {CHANNELS.length} channels, one signal
          </p>
          <h2 id="listen-now-title" className={styles.title}>
            <span className={styles.outline}>Listen</span>
            <span className={styles.solid}>Now</span>
          </h2>
        </header>

        <ChannelStack channels={CHANNELS} badge="Updated monthly" />
      </div>
    </section>
  )
}
