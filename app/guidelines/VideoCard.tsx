'use client'

import { useState } from 'react'
import { FaPlay } from 'react-icons/fa'
import styles from './guidelines.module.css'

type Props = { id: string; start?: number; title: string }

/** Poster-first YouTube player: the iframe (~1 MB of JS) loads only after a click. */
export default function VideoCard({ id, start, title }: Props) {
  const [playing, setPlaying] = useState(false)
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)

  return (
    <div className={styles.video}>
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0${start ? `&start=${start}` : ''}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" className={styles.poster} onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- remote thumbnail, no optimisation needed */}
          <img src={thumb} alt="" loading="lazy" onError={() => setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)} />
          <span className={styles.play}>
            <FaPlay aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  )
}
