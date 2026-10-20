'use client'

import { useEffect, useState } from 'react'
import { FaPlay, FaTimes } from 'react-icons/fa'
import { trackEvent } from '@/app/utils/analytics'

/**
 * Click-to-load SoundCloud player. The iframe is only mounted after a click, so the page
 * does not pull 13 SoundCloud widgets on load; opening one player closes any other.
 */
export default function MixPlayer({ src, slug, title, className, playerClass, big }: { src: string; slug: string; title: string; className?: string; playerClass?: string; big?: boolean }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== slug) setOpen(false)
    }
    window.addEventListener('dnbd-preview', close)
    return () => window.removeEventListener('dnbd-preview', close)
  }, [slug])

  if (open) {
    return (
      <div className={playerClass}>
        <iframe
          src={src.replace('auto_play=false', 'auto_play=true')}
          title={`${title} — SoundCloud`}
          allow="autoplay; encrypted-media"
          height={big ? 300 : 166}
        />
        <button type="button" onClick={() => setOpen(false)} aria-label="Close player">
          <FaTimes aria-hidden="true" /> Close
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent('dnbd-preview', { detail: slug }))
        setOpen(true)
        trackEvent('mix_play', { content_type: 'mix', content_name: title, item_id: slug, location: 'mixes_page' })
      }}
    >
      <FaPlay aria-hidden="true" /> Play mix
    </button>
  )
}
