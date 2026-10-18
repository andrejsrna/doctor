'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { FaBandcamp, FaBars, FaChevronDown, FaDiscord, FaFacebookF, FaInstagram, FaSearch, FaSoundcloud, FaSpotify, FaTimes, FaYoutube } from 'react-icons/fa'
import { SiBeatport } from 'react-icons/si'
import SearchModal from './SearchModal'
import styles from './Navigation.module.css'

const menuItems = [
  { title: 'Artists', href: '/artists' },
  { title: 'News', href: '/news' },
  { title: 'About', href: '/about' },
  { title: 'Newsletter', href: '/newsletter' },
  { title: 'Submit demo', href: '/submit-demo' },
]

const musicSubmenuItems = [
  { title: 'All Releases', href: '/music' },
  { title: 'Single Releases', href: '/music?category=single-tracks' },
  { title: 'EPs', href: '/music?category=eps' },
  { title: 'LPs', href: '/albums' },
  { title: 'Music Packs', href: '/music-packs' },
  { title: 'Sample Packs', href: '/sample-packs' },
  { title: 'Neurofunk DnB Mixes', href: '/neurofunk-dnb-mixes' },
  { title: 'Search for Music', href: '/music?focus=search' },
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

function PlatformLinks() {
  return (
    <div className={styles.platforms}>
      {platformLinks.map(({ title, href, icon: Icon }) => (
        <a key={title} href={href} target="_blank" rel="noopener noreferrer" aria-label={title} title={title} className={styles.platformLink}>
          <Icon size={18} aria-hidden="true" />
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

  useEffect(() => {
    setIsOpen(false)
    setIsMusicOpen(false)
  }, [pathname])

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

  return (
    <>
      <header ref={navRef} className={styles.header}>
        <nav aria-label="Main navigation">
          <div className={styles.bar}>
            <div>
              <button ref={menuButtonRef} type="button" onClick={() => setIsOpen((prev) => !prev)} className={`${styles.iconButton} ${styles.mobileToggle}`} aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen} aria-controls="mobile-navigation">
                {isOpen ? <FaTimes size={20} aria-hidden="true" /> : <FaBars size={20} aria-hidden="true" />}
              </button>
              <div className={styles.desktopMenu}>
                <div className={styles.dropdown}>
                  <button ref={musicButtonRef} type="button" className={styles.menuLink} onClick={() => setIsMusicOpen((prev) => !prev)} aria-expanded={isMusicOpen} aria-controls="music-navigation">
                    Music <FaChevronDown size={10} aria-hidden="true" />
                  </button>
                  {isMusicOpen && (
                    <div id="music-navigation" className={styles.submenu}>
                      {musicSubmenuItems.map((item) => (
                        <Link key={item.href} href={item.href} onClick={closeMenus}>{item.title}</Link>
                      ))}
                    </div>
                  )}
                </div>
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.menuLink} aria-current={pathname === item.href ? 'page' : undefined}>{item.title}</Link>
                ))}
              </div>
            </div>

            <Link href="/" className={styles.logo} aria-label="DnB Doctor home" onClick={closeMenus}>
              <Image src="/brand/dnb-doctor-logo.webp" alt="DnB Doctor" width={640} height={605} sizes="(min-width: 1280px) 176px, 112px" priority />
            </Link>

            <div className={styles.actions}>
              <div className={styles.desktopPlatforms}><PlatformLinks /></div>
              <button type="button" onClick={() => { closeMenus(); setIsSearchModalOpen(true) }} className={styles.iconButton} aria-label="Search">
                <FaSearch size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          {isOpen && (
            <div id="mobile-navigation" className={styles.mobileMenu}>
              <p className={styles.mobileLabel}>Music</p>
              <div className={styles.mobileLinks}>
                {musicSubmenuItems.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.mobileLink} onClick={closeMenus}>{item.title}</Link>
                ))}
              </div>
              <div className={`${styles.mobileLinks} ${styles.mobileSection}`}>
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.mobileLink} onClick={closeMenus} aria-current={pathname === item.href ? 'page' : undefined}>{item.title}</Link>
                ))}
              </div>
              <div className={styles.mobileSection}>
                <p className={styles.mobileLabel}>Follow & stream</p>
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
