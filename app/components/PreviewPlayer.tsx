'use client'

import { useState } from 'react'
import { FaPlay, FaTimes } from 'react-icons/fa'

interface PreviewPlayerProps {
  previewUrl: string
  title: string
  artistName?: string | null
}

export default function PreviewPlayer({ previewUrl, title, artistName }: PreviewPlayerProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!previewUrl) return null

  return (
    <>
      {/* Preview Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-gray-700/70 hover:bg-gray-700/90 text-white rounded-xl transition-colors border border-white/10 hover:border-white/25 shadow-[0_0_24px_rgba(0,0,0,0.35)]"
      >
        <FaPlay className="w-4 h-4" />
        <span className="text-sm md:text-base font-semibold">Preview</span>
      </button>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-black/90 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Player Content */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                {title}
              </h3>
              {artistName && (
                <p className="text-purple-400 text-sm mb-4">
                  by {artistName}
                </p>
              )}
              
              {/* Audio Player */}
              <div className="mb-4">
                <audio 
                  controls 
                  className="w-full"
                  preload="metadata"
                >
                  <source src={previewUrl} type="audio/mpeg" />
                  <source src={previewUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </div>

              <p className="text-gray-400 text-xs">
                Preview only - Full track available on streaming platforms
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
