'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { FaSpotify, FaApple, FaSoundcloud, FaBandcamp, FaEllipsisV } from 'react-icons/fa'

interface StreamingMenuProps {
  spotify?: string | null
  appleMusic?: string | null
  beatport?: string | null
  bandcamp?: string | null
  soundcloud?: string | null
}

export default function StreamingMenu({ 
  spotify, 
  appleMusic, 
  beatport, 
  bandcamp, 
  soundcloud 
}: StreamingMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const streamingLinks = [
    {
      name: 'Spotify',
      url: spotify,
      icon: FaSpotify,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20'
    },
    {
      name: 'Apple Music',
      url: appleMusic,
      icon: FaApple,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20'
    },
    {
      name: 'Beatport',
      url: beatport,
      icon: () => (
        <Image src="/beatport.svg" alt="Beatport" width={16} height={16} className="w-4 h-4" />
      ),
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20'
    },
    {
      name: 'Bandcamp',
      url: bandcamp,
      icon: FaBandcamp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
    },
    {
      name: 'SoundCloud',
      url: soundcloud,
      icon: FaSoundcloud,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 hover:bg-orange-500/20'
    }
  ].filter(link => link.url)

  if (streamingLinks.length === 0) return null

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-colors"
      >
        <FaEllipsisV className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50">
          <div className="py-2">
            {streamingLinks.map((link) => (
              <a
                key={link.name}
                href={link.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <link.icon className={`w-4 h-4 ${link.color}`} />
                <span className="text-gray-300">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
