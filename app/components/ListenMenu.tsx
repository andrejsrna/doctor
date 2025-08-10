'use client'

import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import { FaSpotify, FaYoutube, FaSoundcloud } from 'react-icons/fa'

export default function ListenMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-1">
        <Button
          href="https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9"
          target="_blank"
          rel="noopener noreferrer"
          variant="infected"
          className="group"
        >
          <span className="mr-2">🎧</span>
          Listen Now
        </Button>
        <button
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="px-2 py-2 rounded-md border border-purple-500/30 bg-black/50 text-purple-200 hover:bg-black/70"
        >
          ▾
        </button>
      </div>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-black/90 border border-purple-500/20 rounded-lg shadow-xl p-2 z-[60]">
          <a href="https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9" target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="infected" className="w-full justify-start !py-2" target="_blank" rel="noopener noreferrer">
              <FaSpotify className="w-4 h-4 mr-2" /> Spotify Playlist
            </Button>
          </a>
          <a href="https://www.youtube.com/@dnbdoctor1" target="_blank" rel="noopener noreferrer" className="block mt-2">
            <Button variant="toxic" className="w-full justify-start !py-2" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="w-4 h-4 mr-2" /> YouTube Channel
            </Button>
          </a>
          <a href="https://soundcloud.com/dnbdoctor" target="_blank" rel="noopener noreferrer" className="block mt-2">
            <Button variant="decayed" className="w-full justify-start !py-2" target="_blank" rel="noopener noreferrer">
              <FaSoundcloud className="w-4 h-4 mr-2" /> SoundCloud
            </Button>
          </a>
        </div>
      )}
    </div>
  )
}


