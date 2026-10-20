'use client'

import { useState } from 'react'
import { FaPlay, FaSoundcloud, FaYoutube } from 'react-icons/fa'
import styles from './post.module.css'

type Props = { title: string; youtubeId: string | null; soundcloudSrc: string | null }

/**
 * Video first, SoundCloud as a second tab. The YouTube iframe (~1 MB of JS)
 * only loads after the visitor presses play — the poster is a plain thumbnail.
 */
export default function NewsMedia({ title, youtubeId, soundcloudSrc }: Props) {
  const [tab, setTab] = useState<'yt' | 'sc'>(youtubeId ? 'yt' : 'sc')
  const [playing, setPlaying] = useState(false)
  const [thumb, setThumb] = useState(youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg` : '')
  const both = !!youtubeId && !!soundcloudSrc

  return (
    <div className={styles.media}>
      <div className={styles.mediaHead}>
        {both ? (
          <div role="tablist" aria-label="Player" className={styles.tabs}>
            <button type="button" role="tab" aria-selected={tab === 'yt'} onClick={() => setTab('yt')}>
              <FaYoutube aria-hidden="true" /> Video
            </button>
            <button type="button" role="tab" aria-selected={tab === 'sc'} onClick={() => setTab('sc')}>
              <FaSoundcloud aria-hidden="true" /> SoundCloud
            </button>
          </div>
        ) : (
          <span className={styles.mediaLabel}>{youtubeId ? 'Video' : 'SoundCloud'}</span>
        )}
        <span className={styles.live}>
          <span className={styles.dot} aria-hidden="true" /> 174 BPM
        </span>
      </div>

      {youtubeId && (
        <div className={styles.video} hidden={tab !== 'yt'}>
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={`${title} — YouTube`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button type="button" className={styles.poster} onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- remote thumbnail, no optimisation needed */}
              <img
                src={thumb}
                alt=""
                loading="lazy"
                onError={() => youtubeId && setThumb(`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`)}
              />
              <span className={styles.play}>
                <FaPlay aria-hidden="true" />
              </span>
            </button>
          )}
        </div>
      )}

      {soundcloudSrc && (tab === 'sc' || !youtubeId) && (
        <iframe className={styles.sc} src={soundcloudSrc} title={`${title} — SoundCloud`} allow="autoplay" loading="lazy" />
      )}
    </div>
  )
}
