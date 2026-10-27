'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { FaBandcamp, FaDiscord, FaFacebookF, FaInstagram, FaSearch, FaSoundcloud, FaSpotify, FaUser, FaYoutube } from 'react-icons/fa'
import { SiBeatport } from 'react-icons/si'
import SearchModal from './SearchModal'
import CartDrawer from './shop/CartDrawer'
import { displayFont, monoFont } from './brandFonts'
import styles from './Navigation.module.css'

const menuItems = [
  { title: 'Artists', href: '/artists' },
  { title: 'News', href: '/news' },
  { title: 'About', href: '/about' },
  { title: 'Newsletter', href: '/newsletter' },
  { title: 'Submit demo', href: '/submit-demo' },
]

const musicGroups = [
  {
    label: 'Releases',
    items: [
      { title: 'All releases', href: '/music' },
      { title: 'Singles', href: '/music?category=single-tracks' },
      { title: 'EPs', href: '/music?category=eps' },
      { title: 'LPs', href: '/albums' },
    ],
  },
  {
    label: 'For producers',
    items: [
      { title: 'Music packs', href: '/music-packs' },
      { title: 'Sample packs', href: '/sample-packs' },
    ],
  },
  {
    label: 'Listen',
    items: [
      { title: 'Neurofunk mixes', href: '/neurofunk-dnb-mixes' },
      { title: 'Search music', href: '/music?focus=search' },
    ],
  },
]

const platformLinks = [
  { title: 'Instagram', href: 'https://www.instagram.com/dnbdoctor/', icon: FaInstagram },
  { title: 'Facebook', href: 'https://www.facebook.com/dnbdoctor', icon: FaFacebookF },
  { title: 'Discord', href: 'https://discord.gg/GE2HWFdgXG', icon: FaDiscord },
  { title: 'YouTube', href: 'https://www.youtube.com/@dnbdoctor1', icon: FaYoutube },
  { title: 'Spotify', href: 'https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP', icon: FaSpotify },
  { title: 'SoundCloud', href: 'https://soundcloud.com/dnbdoctor', icon: FaSoundcloud },
  { title: 'Bandcamp', href: 'https://dnbdoctor.bandcamp.com/', icon: FaBandcamp },
  { title: 'Beatport', href: 'https://www.beatport.com/label/dnb-doctor/75618', icon: SiBeatport },
]

const GLYPHS = '#%&/\\<>[]{}=+*^?01'

/** Text that decodes from glyph noise when its parent link is hovered or focused. */
function useScramble(text: string) {
  const [out, setOut] = useState(text)
  const raf = useRef(0)

  const run = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    cancelAnimationFrame(raf.current)
    const start = performance.now()
    const dur = 360
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur)
      const revealed = Math.floor(p * text.length)
      setOut(
        text
          .split('')
          .map((c, i) => (i < revealed || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      )
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }, [text])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  return [out, run] as const
}

function NavLink({ href, title, active }: { href: string; title: string; active: boolean }) {
  const [out, run] = useScramble(title)
  return (
    <Link
      href={href}
      className={styles.menuLink}
      aria-current={active ? 'page' : undefined}
      aria-label={title}
      onMouseEnter={run}
      onFocus={run}
    >
      <span aria-hidden="true">{out}</span>
    </Link>
  )
}

function PlatformLinks() {
  return (
    <div className={styles.platforms}>
      {platformLinks.map(({ title, href, icon: Icon }) => (
        <a key={title} href={href} target="_blank" rel="noopener noreferrer" aria-label={title} title={title} className={styles.platformLink}>
          <Icon size={17} aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMusicOpen, setIsMusicOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const musicButtonRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [musicOut, runMusic] = useScramble('Music')

  useEffect(() => {
    setIsOpen(false)
    setIsMusicOpen(false)
  }, [pathname])

  // Scroll-linked collapse: the header is sticky with a negative top, so it
  // scrolls partly away; --p (0..1) pulls the contents into the visible strip.
  useEffect(() => {
    const header = navRef.current
    if (!header) return
    let raf = 0
    const update = () => {
      raf = 0
      const collapse = parseFloat(getComputedStyle(header).getPropertyValue('--collapse')) || 0
      const p = collapse > 0 ? Math.min(1, Math.max(0, window.scrollY / collapse)) : 0
      header.style.setProperty('--p', p.toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setIsMusicOpen(false)
        setIsOpen(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMusicOpen) musicButtonRef.current?.focus()
        if (isOpen) menuButtonRef.current?.focus()
        setIsMusicOpen(false)
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMusicOpen, isOpen])

  const closeMenus = () => {
    setIsOpen(false)
    setIsMusicOpen(false)
  }

  const musicActive = pathname === '/music' || pathname.startsWith('/music/') || pathname === '/albums' || pathname.endsWith('-packs') || pathname === '/neurofunk-dnb-mixes'

  return (
    <>
      <header ref={navRef} className={`${styles.header} ${displayFont.variable} ${monoFont.variable}`} data-open={isOpen || isMusicOpen ? 'true' : undefined}>
        <nav aria-label="Main navigation">
          <div className={styles.bar}>
            <div className={styles.side}>
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => { setIsMusicOpen(false); setIsOpen((prev) => !prev) }}
                className={styles.burger}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </button>
              <div className={styles.desktopMenu}>
                <button
                  ref={musicButtonRef}
                  type="button"
                  className={styles.menuLink}
                  onClick={() => setIsMusicOpen((prev) => !prev)}
                  onMouseEnter={runMusic}
                  onFocus={runMusic}
                  aria-expanded={isMusicOpen}
                  aria-controls="music-navigation"
                  aria-label="Music"
                  data-active={musicActive ? 'true' : undefined}
                >
                  <span aria-hidden="true">{musicOut}</span>
                  <i className={styles.plus} aria-hidden="true" />
                </button>
                {menuItems.map((item) => (
                  <NavLink key={item.href} href={item.href} title={item.title} active={pathname === item.href} />
                ))}
              </div>
            </div>

            <Link href="/" className={styles.logo} aria-label="DnB Doctor home" onClick={closeMenus}>
              <Image src="/brand/dnb-doctor-logo.webp" alt="DnB Doctor" width={640} height={605} sizes="(min-width: 1280px) 176px, 112px" priority />
            </Link>

            <div className={`${styles.side} ${styles.actions}`}>
              <div className={styles.desktopPlatforms}><PlatformLinks /></div>
              <button type="button" onClick={() => { closeMenus(); setIsSearchModalOpen(true) }} className={styles.search} aria-label="Search">
                <FaSearch size={15} aria-hidden="true" />
                <span className={styles.searchLabel} aria-hidden="true">Search</span>
              </button>
              <Link href="/account" className={`${styles.search} ${styles.account}`} aria-label="My account" onClick={closeMenus} data-active={pathname === '/account' ? 'true' : undefined}>
                <FaUser size={13} aria-hidden="true" />
              </Link>
              <CartDrawer buttonClassName={`${styles.search} ${styles.cart}`} />
            </div>
          </div>

          {isMusicOpen && (
            <div id="music-navigation" className={styles.mega}>
              <div className={styles.megaInner}>
                {musicGroups.map((group, gi) => (
                  <div key={group.label} className={styles.megaGroup} style={{ '--i': gi } as React.CSSProperties}>
                    <p className={styles.megaLabel}>{group.label}</p>
                    {group.items.map((item) => (
                      <Link key={item.href} href={item.href} className={styles.megaLink} onClick={closeMenus}>
                        {item.title}
                        <span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isOpen && (
            <div id="mobile-navigation" className={styles.mobileMenu}>
              <div className={styles.mobilePrimary}>
                {menuItems.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.mobileBig}
                    style={{ '--i': i } as React.CSSProperties}
                    onClick={closeMenus}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
              <div className={styles.mobileGroups}>
                {musicGroups.map((group) => (
                  <div key={group.label}>
                    <p className={styles.megaLabel}>{group.label}</p>
                    {group.items.map((item) => (
                      <Link key={item.href} href={item.href} className={styles.mobileSmall} onClick={closeMenus}>{item.title}</Link>
                    ))}
                  </div>
                ))}
              </div>
              <Link href="/account" className={styles.mobileAccount} onClick={closeMenus} aria-current={pathname === '/account' ? 'page' : undefined}>
                <FaUser size={13} aria-hidden="true" /> My account <span aria-hidden="true">→</span>
              </Link>
              <div className={styles.mobileFooter}>
                <p className={styles.megaLabel}>Follow &amp; stream</p>
                <PlatformLinks />
              </div>
            </div>
          )}
        </nav>
      </header>

      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>
  )
}
