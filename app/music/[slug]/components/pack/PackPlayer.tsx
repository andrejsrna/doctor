'use client'

import { useEffect, useRef, useState } from 'react'
import type { PackGroup, PackItem } from '@/lib/shop/pack'
import { itemTitle } from './packText'
import styles from './pack.module.css'

const STEP = 60 / 174 / 4 // one 16th at 174 BPM

type Playing = { group: string; index: number } | null

/** Sampler-style previewer: one shared <audio>, waveform rows, 16-step clock synced to playback. */
export default function PackPlayer({ groups }: { groups: PackGroup[] }) {
  const audioGroups = groups.filter((g) => g.kind === 'audio' && g.items.some((i) => i.preview))
  const [tab, setTab] = useState(audioGroups[0]?.id ?? '')
  const [playing, setPlaying] = useState<Playing>(null)
  const [loop, setLoop] = useState(true)
  const audio = useRef<HTMLAudioElement | null>(null)
  const rowsRef = useRef<HTMLOListElement>(null)
  const clockRef = useRef<HTMLDivElement>(null)
  const raf = useRef(0)

  useEffect(() => {
    const a = new Audio()
    a.preload = 'none'
    audio.current = a
    const end = () => { if (!a.loop) setPlaying(null) }
    a.addEventListener('ended', end)
    return () => { a.pause(); a.removeEventListener('ended', end); cancelAnimationFrame(raf.current) }
  }, [])

  useEffect(() => { if (audio.current) audio.current.loop = loop }, [loop])

  // Progress + step clock run off the audio clock, not timers, so they stay in time with the sound.
  useEffect(() => {
    cancelAnimationFrame(raf.current)
    const a = audio.current
    const row = playing ? rowsRef.current?.querySelector<HTMLElement>(`[data-row="${playing.group}-${playing.index}"]`) : null
    const steps = clockRef.current?.children
    const clear = () => { if (steps) for (const s of steps) s.removeAttribute('data-on') }
    if (!a || !playing || !row) { clear(); return }
    const bars = row.querySelectorAll<HTMLElement>('i')
    let lit = -1
    const paint = (n: number) => {
      if (n === lit) return
      lit = n
      bars.forEach((b, i) => b.toggleAttribute('data-past', i < n))
    }
    const tick = () => {
      const d = a.duration || 1
      paint(Math.round((a.currentTime / d) * bars.length))
      if (steps) {
        const n = Math.floor(a.currentTime / STEP) % 16
        for (let i = 0; i < steps.length; i++) steps[i].toggleAttribute('data-on', i === n)
      }
      raf.current = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(raf.current); paint(0); clear() }
  }, [playing])

  if (!audioGroups.length) return null
  const group = audioGroups.find((g) => g.id === tab) ?? audioGroups[0]

  function toggle(g: PackGroup, index: number, item: PackItem) {
    const a = audio.current
    if (!a || !item.preview) return
    if (playing?.group === g.id && playing.index === index) {
      a.pause()
      setPlaying(null)
      return
    }
    a.src = item.preview
    a.currentTime = 0
    a.play().then(() => setPlaying({ group: g.id, index })).catch(() => setPlaying(null))
  }

  const playingGroup = playing ? audioGroups.find((g) => g.id === playing.group) : undefined
  const now = playing && playingGroup ? playingGroup.items[playing.index] : undefined

  return (
    <div className={styles.player}>
      <div className={styles.deck}>
        <div className={styles.tabs} role="tablist" aria-label="Sound categories">
          {audioGroups.map((g) => (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={g.id === group.id}
              aria-controls={`rows-${g.id}`}
              className={styles.tab}
              onClick={() => setTab(g.id)}
            >
              {g.label} <span>{g.items.length}</span>
            </button>
          ))}
        </div>
        <div className={styles.deckRight}>
          <div ref={clockRef} className={styles.clock} aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => <span key={i} data-beat={i % 4 === 0 ? '' : undefined} />)}
          </div>
          <label className={styles.loopToggle}>
            <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
            <span className={styles.loopBox} aria-hidden="true" />
            Loop
          </label>
        </div>
      </div>

      <p className={styles.nowPlaying} aria-live="polite">
        {now && playingGroup && playing ? <>Playing <b>{itemTitle(playingGroup, playing.index)}</b>{now.key ? ` · ${now.key}` : ''} · 174 BPM</> : 'Tap a row to audition. Previews are MP3, max 4 bars; the pack ships 24-bit WAV.'}
      </p>

      <ol ref={rowsRef} id={`rows-${group.id}`} role="tabpanel" className={styles.rows}>
        {group.items.map((item, i) => {
          const on = playing?.group === group.id && playing.index === i
          return (
            <li key={item.name} data-row={`${group.id}-${i}`} data-on={on ? '' : undefined}>
              <button type="button" className={styles.row} onClick={() => toggle(group, i, item)} aria-pressed={on} aria-label={`${on ? 'Stop' : 'Play'} ${itemTitle(group, i)}`}>
                <span className={styles.play} aria-hidden="true">{on ? '■' : '▶'}</span>
                <span className={styles.rowName}>
                  {itemTitle(group, i)}
                  <small>{item.name}</small>
                </span>
                <span className={styles.wave} aria-hidden="true">
                  {(item.peaks ?? []).map((p, k) => <i key={k} style={{ '--h': Math.max(0.06, p) } as React.CSSProperties} />)}
                </span>
                <span className={styles.chips}>
                  {item.key && <span>{item.key}</span>}
                  {item.bars ? <span>{item.bars} bars</span> : null}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
