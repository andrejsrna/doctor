'use client'

import { useRef, useState } from 'react'
import styles from '../about.module.css'

/** Poster-first clip: nothing downloads until the visitor presses play. */
export default function GalleryVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <video ref={ref} poster={poster} loop playsInline preload="none" className={styles.video} onClick={toggle} onEnded={() => setPlaying(false)}>
        <source src={src} type="video/mp4" />
      </video>
      <button type="button" className={styles.play} data-playing={playing || undefined} onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} video: ${label}`}>
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          {playing ? <path d="M5 3h3.5v14H5zM11.5 3H15v14h-3.5z" /> : <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.34-5.89a1.5 1.5 0 0 0 0-2.54z" />}
        </svg>
        <span>{playing ? 'Pause' : 'Play clip'}</span>
      </button>
    </>
  )
}
