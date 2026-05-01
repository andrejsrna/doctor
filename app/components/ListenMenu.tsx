'use client'

import Link from 'next/link'

export default function ListenMenu() {
  return (
    <Link
      href="/#listen-now"
      className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white text-sm font-bold tracking-wide transition-all duration-300 hover:shadow-[0_0_28px_rgba(168,85,247,0.5)] hover:scale-[1.03] active:scale-[0.98]"
    >
      {/* Glow ring */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-40 blur-sm group-hover:opacity-60 transition-opacity duration-300 -z-10" />

      {/* Headphone icon */}
      <span className="text-base">🎧</span>

      <span>Listen Now</span>

      {/* Animated chevron down */}
      <svg
        className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </Link>
  )
}
