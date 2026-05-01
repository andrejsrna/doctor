'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ListenMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative flex items-center gap-2">
      {/* Main Listen Now button with arrow */}
      <Link
        href="#listen-now"
        className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold text-sm transition-all duration-300 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
      >
        <span className="mr-1">🎧</span>
        Listen Now
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </Link>

      {/* Optional dropdown toggle - keeping minimal */}
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="px-2 py-2 rounded-md border border-purple-500/30 bg-black/50 text-purple-200 hover:bg-black/70 text-xs"
      >
        ▾
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-black/90 border border-purple-500/20 rounded-lg shadow-xl p-2 z-[60]">
          <a
            href="https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-green-400 hover:bg-green-500/10 transition-colors"
          >
            <span>🎵</span> Spotify Playlist
          </a>
          <a
            href="https://www.youtube.com/@dnbdoctor1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span>📺</span> YouTube Channel
          </a>
          <a
            href="https://soundcloud.com/dnbdoctor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-orange-400 hover:bg-orange-500/10 transition-colors"
          >
            <span>☁️</span> SoundCloud
          </a>
        </div>
      )}
    </div>
  )
}
