'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ListenMenu from './ListenMenu'
import SearchModal from './SearchModal'
import { isShopEnabled } from '@/app/utils/shop'

// removed old ListenNowButton modal trigger in favor of ListenMenu

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { scrollY } = useScroll()
  
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const pathname = usePathname()

  // Transform opacity based on scroll
  const headerOpacity = useTransform(
    scrollY,
    [0, 50],
    [0.8, 1]
  )

  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.8)']
  )

  // Handle scroll events and mounting
  useEffect(() => {
    setIsMounted(true)
    
    // Only add scroll listener on client side
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        try {
          setIsScrolled(window.scrollY > 50)
        } catch {
          // Fallback for Firefox scroll issues
          setIsScrolled(document.documentElement.scrollTop > 50)
        }
      }
      
      // Initial check
      handleScroll()
      
      try {
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
          try {
            window.removeEventListener('scroll', handleScroll)
          } catch {
            // Silent cleanup failure
          }
        }
      } catch {
        // Silent event listener failure
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(min-width: 768px)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false)
    }
    if (mql.matches) setIsOpen(false)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const menuItems = [
    { title: 'Artists', href: '/artists' },
    { title: 'News', href: '/news' },
    { title: 'Shop', href: '/shop' },
    { title: 'About', href: '/about' },
    { title: 'Newsletter', href: '/newsletter' },
    { title: 'Submit demo', href: '/submit-demo' },
  ]
  const visibleMenuItems = isShopEnabled() ? menuItems : menuItems.filter((item) => item.href !== '/shop')

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

  // Initial render with static values to prevent hydration mismatch
  if (!isMounted) {
    return (
      <>
        {/* Logo Container */}
        <div className="fixed left-4 z-[150] md:left-8 md:top-8">
          <Link href="/" className="block">
            <Image
              src="/logo.png"
              alt="Neurofunk Label Logo"
              width={60}
              height={180}
              className="w-[60px] md:w-[120px] md:-mt-6 mt-2 h-auto"
              priority
            />
          </Link>
        </div>

        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/30">
          {/* Static nav content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end h-16 md:h-20">
              <div className="hidden md:flex items-center space-x-8">
                {/* Music Dropdown */}
                <div className="relative group">
                  <button className="text-gray-300 hover:text-green-500 transition-colors font-medium tracking-wide text-sm uppercase flex items-center gap-1">
                    Music
                    <svg className="w-3 h-3 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-green-500/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-2">
                      {musicSubmenuItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="block px-4 py-2 text-gray-300 hover:text-green-500 hover:bg-green-500/10 transition-colors text-sm"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                
                {visibleMenuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="text-gray-300 hover:text-green-500 transition-colors font-medium tracking-wide text-sm uppercase"
                  >
                    {item.title}
                  </Link>
                ))}
                <button onClick={() => setIsSearchModalOpen(true)} className="text-gray-300 hover:text-green-500 transition-colors" aria-label="Search">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
                <ListenMenu />
              </div>
            </div>
          </div>
        </nav>
      </>
    )
  }

  // Rest of the component remains the same
  return (
    <>
      {/* Logo Container */}
      <div className="fixed left-4 z-[150] md:left-8 md:top-8">
        <Link href="/" className="block">
          <Image
            src="/logo.png"
            alt="Neurofunk Label Logo"
            width={60}
            height={180}
            className="w-[60px] md:w-[120px] md:-mt-6 mt-2 h-auto"
            priority
          />
        </Link>
      </div>

      <motion.nav 
        style={{ 
          opacity: headerOpacity,
          backgroundColor: headerBackground,
        }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg transition-all duration-300 ${
          isScrolled ? 'border-b border-green-500/20' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-16 md:h-20">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Music Dropdown */}
              <div className="relative group">
                  <button className="text-gray-300 hover:text-green-500 transition-colors font-medium tracking-wide text-sm uppercase flex items-center gap-1">
                    Music
                    <svg className="w-3 h-3 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-green-500/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-2">
                    {musicSubmenuItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="block px-4 py-2 text-gray-300 hover:text-green-500 hover:bg-green-500/10 transition-colors text-sm"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              {visibleMenuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-gray-300 hover:text-green-500 transition-colors font-medium tracking-wide text-sm uppercase"
                >
                  {item.title}
                </Link>
              ))}
              <button onClick={() => setIsSearchModalOpen(true)} className="text-gray-300 hover:text-green-500 transition-colors" aria-label="Search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
               <ListenMenu />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button onClick={() => setIsSearchModalOpen(true)} className="text-gray-300 md:hidden hover:text-green-500 p-2" aria-label="Search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 md:hidden hover:text-green-500 p-2"
              >
                {!isOpen ? (
                  <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div 
          className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-lg border-t border-green-500/20">
            {/* Music section in mobile menu */}
            <div className="px-3 py-2">
              <div className="text-gray-400 text-xs uppercase tracking-wide mb-2">Music</div>
              {musicSubmenuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-gray-300 hover:text-green-500 block px-3 py-2 text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            
            {visibleMenuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-gray-300 hover:text-green-500 block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsSearchModalOpen(true)
                setIsOpen(false)
              }}
              className="text-gray-300 hover:text-green-500 block px-3 py-2 text-base font-medium transition-colors"
              aria-label="Search"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
              <div onClick={() => setIsOpen(false)}>
                <ListenMenu />
              </div>
          </div>
        </motion.div>
      </motion.nav>

      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      {/* StreamingModal removed from header */}
    </>
  )
} 
