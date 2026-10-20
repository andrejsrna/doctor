'use client'

import { useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import { trackEvent, trackStreamingClick } from '@/app/utils/analytics'
import { withBeatportAffiliate } from '@/lib/affiliates'

/** Preview toggle; starting one preview pauses any other on the page. */
export function PreviewButton({ src, slug, title, className }: { src: string; slug: string; title: string; className?: string }) {
  const ref = useRef<HTMLAudioElement | null>(null)
  const [on, setOn] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const stop = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== slug) {
        ref.current?.pause()
        setOn(false)
      }
    }
    window.addEventListener('dnbd-preview', stop)
    return () => {
      window.removeEventListener('dnbd-preview', stop)
      ref.current?.pause()
    }
  }, [slug])

  const toggle = async () => {
    if (on) {
      ref.current?.pause()
      setOn(false)
      return
    }
    window.dispatchEvent(new CustomEvent('dnbd-preview', { detail: slug }))
    if (!ref.current) {
      ref.current = new Audio(src)
      ref.current.onended = () => setOn(false)
    }
    try {
      setError(false)
      await ref.current.play()
      setOn(true)
      trackEvent('preview_play', { content_type: 'release', content_name: title, item_id: slug, location: 'collections' })
    } catch {
      setError(true)
    }
  }

  return (
    <button type="button" className={className} onClick={toggle} aria-pressed={on} data-on={on ? '' : undefined}>
      {on ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
      {error ? 'Preview unavailable' : on ? 'Pause' : 'Preview'}
    </button>
  )
}

/** Outbound store link: Beatport gets the affiliate id, every click is reported. */
export function StoreLink({ name, url, slug, className, children }: { name: string; url: string; slug: string; className?: string; children: React.ReactNode }) {
  const isBeatport = name === 'Beatport'
  return (
    <a
      href={isBeatport ? withBeatportAffiliate(url) : url}
      target="_blank"
      rel={isBeatport ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
      className={className}
      onClick={() => trackStreamingClick(name.toLowerCase().replace(/\s+/g, ''), slug)}
    >
      {children}
    </a>
  )
}
