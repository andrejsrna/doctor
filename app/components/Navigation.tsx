'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { FaDiscord } from 'react-icons/fa'
import ListenMenu from './ListenMenu'
import SearchModal from './SearchModal'

interface MenuItem {
  title: string
  href: string
  external?: boolean
}

const menuItems: MenuItem[] = [
  { title: 'Artists', href: '/artists' },
  { title: 'News', href: '/news' },
  { title: 'About', href: '/about' },
  { title: 'Newsletter', href: '/newsletter' },
  { title: 'Merch', href: 'https://dnbdoctor.bandcamp.com/merch/dnb-doctor-rx-tee', external: true },
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

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const visibleMenuItems = menuItems

  return (
    <>
      <header ref={navRef}>
        <nav
          className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${
            isScrolled
              ? 'bg-black/95 border-b border-green-500/20 shadow-lg shadow-black/50'
              : 'bg-[#050505]/90 border-b border-white/5'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 h-20">

              {/* Logo */}
              <Link href="/" className="block shrink-0">
                <Image
                  src="/logo-1.png"
                  alt="DnB Doctor"
                  width={720}
                  height={192}
                  sizes="(min-width: 768px) 200px, 140px"
                  className="w-[140px] md:w-[200px] h-auto"
                  priority
                />
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-6 flex-1">
                {/* Music dropdown */}
                <div className="relative group">
                  <button className="text-gray-300 hover:text-secondary transition-colors font-medium tracking-wide text-sm uppercase flex items-center gap-1">
                    Music
                    <svg className="w-3 h-3 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-52 bg-black/95 backdrop-blur-lg border border-green-500/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {musicSubmenuItems.map((item) => (
                        <Link key={item.href} href={item.href} className="block px-4 py-2 text-gray-300 hover:text-secondary hover:bg-green-500/10 transition-colors text-sm">
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {visibleMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="text-gray-300 hover:text-secondary transition-colors font-medium tracking-wide text-sm uppercase"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

              {/* Desktop right side */}
              <div className="hidden md:flex items-center gap-4 ml-auto shrink-0">
                <button onClick={() => setIsSearchModalOpen(true)} className="text-gray-300 hover:text-secondary transition-colors" aria-label="Search">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
                <ListenMenu />
              </div>

              {/* Mobile right side */}
              <div className="mobile-only flex items-center gap-2 ml-auto shrink-0">
                <button onClick={() => setIsSearchModalOpen(true)} className="text-gray-300 hover:text-secondary p-2" aria-label="Search">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="text-gray-300 hover:text-secondary p-2"
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Mobile menu – conditionally rendered */}
          {isOpen && (
            <div className="mobile-only border-t border-green-500/10 bg-black/95">
              <div className="px-4 pt-3 pb-5 space-y-1">
                <p className="px-3 pb-1 text-gray-500 text-xs uppercase tracking-widest">Music</p>
                {musicSubmenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 text-gray-300 hover:text-secondary text-sm font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="border-t border-white/5 pt-2 mt-2">
                  {visibleMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="block px-3 py-2 text-gray-300 hover:text-secondary text-sm font-medium uppercase tracking-wide transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                  <a
                    href="https://discord.gg/sKZHtDrwn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-indigo-400 text-sm font-medium uppercase tracking-wide transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaDiscord className="w-4 h-4" />
                    Discord
                  </a>
                </div>
                <div className="border-t border-white/5 pt-3 px-3">
                  <ListenMenu />
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  )
}
