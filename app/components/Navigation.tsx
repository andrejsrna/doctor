'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import StreamingModal from './StreamingModal'
import { IoSearchOutline } from 'react-icons/io5'
import { FaChevronDown } from 'react-icons/fa'
import SearchModal from './SearchModal'
import Button from './Button'

const ListenNowButton = ({ setIsModalOpen }: { 
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void 
}) => {
  return (
    <Button
      variant="infected"
      onClick={() => setIsModalOpen(true)}
      className="group"
    >
      <motion.span
        animate={{
          rotate: [0, -15, 15, -15, 0],
          scale: [1, 1.2, 1, 1.2, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
          }}
        className="mr-2"
        >
          🎧
        </motion.span>
        Listen Now
    </Button>
  )
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { scrollY } = useScroll()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

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

  const menuItems = [
    { title: 'Artists', href: '/artists' },
    { title: 'News', href: '/news' },
    { title: 'About', href: '/about' },
    { title: 'Newsletter', href: '/newsletter' },
    { title: 'Submit demo', href: '/submit-demo' },
  ]

  const musicSubmenuItems = [
    { title: 'All Releases', href: '/music' },
    { title: 'Music Packs', href: '/music-packs' },
    { title: 'Sample Packs', href: '/sample-packs' },
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
                    <FaChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
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
                
                {menuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="text-gray-300 hover:text-green-500 transition-colors font-medium tracking-wide text-sm uppercase"
                  >
                    {item.title}
                  </Link>
                ))}
                <button
                  onClick={() => setIsSearchModalOpen(true)}
                  className="text-gray-300 hover:text-green-500 transition-colors"
                  aria-label="Search"
                >
                  <IoSearchOutline size={24} />
                </button>
                <ListenNowButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
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
                  <FaChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
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
              
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-gray-300 hover:text-green-500 transition-colors font-medium tracking-wide text-sm uppercase"
                >
                  {item.title}
                </Link>
              ))}
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="text-gray-300 hover:text-green-500 transition-colors"
                aria-label="Search"
              >
                <IoSearchOutline size={24} />
              </button>
              <ListenNowButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="text-gray-300 hover:text-green-500 p-2"
                aria-label="Search"
              >
                <IoSearchOutline size={24} />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-green-500 p-2"
              >
                <span className="sr-only">Open main menu</span>
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
            
            {menuItems.map((item) => (
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
              <IoSearchOutline size={24} />
            </button>
            <div onClick={() => setIsOpen(false)}>
              <ListenNowButton isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </div>
          </div>
        </motion.div>
      </motion.nav>

      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <StreamingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
} 