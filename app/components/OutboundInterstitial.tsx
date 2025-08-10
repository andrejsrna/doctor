'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from './Button'
import { FaYoutube, FaSpotify, FaEnvelope } from 'react-icons/fa'
import { createPortal } from 'react-dom'

interface OutboundInterstitialProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

const DISMISS_KEY = 'outbound_interstitial_dismissed_until'

export const getOutboundDismissed = () => {
  if (typeof window === 'undefined') return false
  const v = localStorage.getItem(DISMISS_KEY)
  if (!v) return false
  const ts = Number(v)
  return Number.isFinite(ts) && Date.now() < ts
}

export const setOutboundDismissed = (days = 1) => {
  if (typeof window === 'undefined') return
  const until = Date.now() + days * 24 * 60 * 60 * 1000
  localStorage.setItem(DISMISS_KEY, String(until))
}

export default function OutboundInterstitial({ isOpen, onClose, onContinue }: OutboundInterstitialProps) {
  const [checked, setChecked] = useState(true)
  const lastFocus = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      lastFocus.current = (document.activeElement as HTMLElement) || null
    } else if (lastFocus.current) {
      lastFocus.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!mounted) return
    const prevOverflow = document.body.style.overflow
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, mounted])

  const handleContinue = () => {
    if (checked) setOutboundDismissed(1)
    onContinue()
  }

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80" onClick={onClose} />
          <div className="absolute inset-0 grid place-items-center p-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-md rounded-xl border border-purple-500/30 bg-black/90 p-6"
              role="dialog"
              aria-modal="true"
            >
            <div className="flex items-center gap-3 mb-3">
              <FaYoutube className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Before you go</h3>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Support the project by subscribing to our YouTube or following our Spotify playlist.
            </p>
            <div className="grid grid-cols-1 gap-3 mb-3">
              <a href="https://www.youtube.com/@dnbdoctor1?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
                <Button variant="decayed" className="w-full whitespace-nowrap">
                  <FaYoutube className="w-4 h-4" />
                  Subscribe YouTube
                </Button>
              </a>
              <a href="https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9" target="_blank" rel="noopener noreferrer">
                <Button variant="infected" className="w-full whitespace-nowrap">
                  <FaSpotify className="w-4 h-4" />
                  Follow Spotify
                </Button>
              </a>
              <a href="/newsletter">
                <Button variant="toxic" className="w-full whitespace-nowrap">
                  <FaEnvelope className="w-4 h-4" />
                  Join Newsletter
                </Button>
              </a>
            </div>
            <Button variant="toxic" className="w-full mb-3" onClick={handleContinue}>Continue</Button>
            <label className="flex items-center gap-2 text-xs text-gray-400">
              <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
              Don&apos;t show this again for a day
            </label>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
  if (!mounted) return null
  return createPortal(content, document.body)
}


