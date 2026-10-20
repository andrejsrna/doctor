'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaArrowRight, FaEnvelope, FaSpotify, FaYoutube } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { displayFont, monoFont } from './brandFonts'
import styles from './outbound.module.css'

interface OutboundInterstitialProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  /** Platform the visitor is heading to, e.g. "Spotify" — shown in the CTA. */
  destination?: string
}

const DISMISS_KEY = 'outbound_interstitial_dismissed_until'
const DAY = 24 * 60 * 60 * 1000

export const getOutboundDismissed = () => {
  if (typeof window === 'undefined') return false
  try {
    const ts = Number(localStorage.getItem(DISMISS_KEY))
    return Number.isFinite(ts) && Date.now() < ts
  } catch {
    return false
  }
}

export const setOutboundDismissed = (days = 30) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + days * DAY))
  } catch {
    /* private mode — just show it again next time */
  }
}

const SUPPORT = [
  { href: 'https://www.youtube.com/@dnbdoctor1?sub_confirmation=1', label: 'Subscribe on YouTube', note: 'New releases & mixes', icon: FaYoutube, tone: 'crimson' },
  { href: 'https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9', label: 'Follow our Spotify playlist', note: 'Curated neurofunk selection', icon: FaSpotify, tone: 'green' },
  { href: '/newsletter', label: 'Join the newsletter', note: 'One email a month', icon: FaEnvelope, tone: 'purple' },
] as const

export default function OutboundInterstitial({ isOpen, onClose, onContinue, destination }: OutboundInterstitialProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !isOpen) return null
  return createPortal(<Dialog onClose={onClose} onContinue={onContinue} destination={destination} />, document.body)
}

/** Mounted only while open → fresh state, focus and scroll lock on every open. */
function Dialog({ onClose, onContinue, destination }: Omit<OutboundInterstitialProps, 'isOpen'>) {
  const [mute, setMute] = useState(false)
  const cta = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const textId = useId()

  useEffect(() => {
    const lastFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cta.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !panel.current) return
      // keep focus inside the dialog
      const items = panel.current.querySelectorAll<HTMLElement>('a[href], button, input')
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      lastFocus?.focus?.()
    }
  }, [onClose])

  const handleContinue = () => {
    // Continuing always snoozes for a day; the checkbox extends it to 30 days.
    setOutboundDismissed(mute ? 30 : 1)
    onContinue()
  }

  return (
    <div className={`${styles.overlay} ${displayFont.variable} ${monoFont.variable}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panel} className={styles.panel} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={textId}>
        <div className={styles.head}>
          <span className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" />
            {destination ? `Opening ${destination}` : 'Leaving DnB Doctor'}
          </span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <IoClose aria-hidden="true" />
          </button>
        </div>

        <div className={styles.body}>
          <h2 id={titleId} className={styles.title}>
            Before you <span>go.</span>
          </h2>
          <p id={textId} className={styles.text}>
            We&apos;re an independent label. A follow costs you nothing and keeps the neurofunk coming.
          </p>

          <ul className={styles.support}>
            {SUPPORT.map((s) => {
              const external = s.href.startsWith('http')
              return (
                <li key={s.href}>
                  <a href={s.href} data-tone={s.tone} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <s.icon aria-hidden="true" />
                    <span className={styles.sLabel}>{s.label}</span>
                    <span className={styles.sNote}>{s.note}</span>
                    <span className={styles.sArrow} aria-hidden="true">
                      {external ? '↗' : '→'}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>

          <button ref={cta} type="button" className={styles.cta} onClick={handleContinue}>
            <span>{destination ? `Continue to ${destination}` : 'Continue'}</span>
            <FaArrowRight aria-hidden="true" />
          </button>

          <label className={styles.mute}>
            <input type="checkbox" checked={mute} onChange={(e) => setMute(e.target.checked)} />
            <span>Don&apos;t show this again for 30 days</span>
          </label>
        </div>
      </div>
    </div>
  )
}
