'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './patternPlayer.module.css'

export type Lane = 'kick' | 'snare' | 'ghost' | 'hat'
export type Pattern = Partial<Record<Lane, number[]>>

const LANES: { id: Lane; label: string }[] = [
  { id: 'kick', label: 'Kick' },
  { id: 'snare', label: 'Snare' },
  { id: 'ghost', label: 'Ghost' },
  { id: 'hat', label: 'Hat' },
]

const STEPS = 16

/* one shared AudioContext + "only one player at a time" */
let ctx: AudioContext | null = null
let stopOther: (() => void) | null = null
let noise: AudioBuffer | null = null

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
    noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
    const d = noise.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  return ctx
}

function hit(lane: Lane, t: number) {
  const a = audio()
  const out = a.createGain()
  out.connect(a.destination)
  if (lane === 'kick') {
    const o = a.createOscillator()
    o.frequency.setValueAtTime(150, t)
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12)
    out.gain.setValueAtTime(0.9, t)
    out.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    o.connect(out)
    o.start(t)
    o.stop(t + 0.31)
    return
  }
  const n = a.createBufferSource()
  n.buffer = noise
  const f = a.createBiquadFilter()
  n.connect(f)
  f.connect(out)
  if (lane === 'hat') {
    f.type = 'highpass'
    f.frequency.value = 7000
    out.gain.setValueAtTime(0.18, t)
    out.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
    n.start(t)
    n.stop(t + 0.06)
    return
  }
  const level = lane === 'ghost' ? 0.14 : 0.5
  f.type = 'bandpass'
  f.frequency.value = 1800
  out.gain.setValueAtTime(level, t)
  out.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
  n.start(t)
  n.stop(t + 0.2)
  const o = a.createOscillator()
  const og = a.createGain()
  o.frequency.value = 190
  og.gain.setValueAtTime(level * 0.8, t)
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
  o.connect(og)
  og.connect(a.destination)
  o.start(t)
  o.stop(t + 0.11)
}

const toSets = (p: Pattern) => Object.fromEntries(LANES.map((l) => [l.id, new Set(p[l.id] ?? [])])) as Record<Lane, Set<number>>

export default function PatternPlayer({ name, pattern, bpm = 174 }: { name: string; pattern: Pattern; bpm?: number }) {
  const [grid, setGrid] = useState(() => toSets(pattern))
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(-1)
  const [tempo, setTempo] = useState(bpm)
  const gridRef = useRef(grid)
  const tempoRef = useRef(tempo)
  const timer = useRef<number | null>(null)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    gridRef.current = grid
    tempoRef.current = tempo
  }, [grid, tempo])

  const lanes = LANES.filter((l) => l.id !== 'ghost' || (pattern.ghost?.length ?? 0) > 0)

  const stop = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current)
    if (raf.current) cancelAnimationFrame(raf.current)
    timer.current = raf.current = null
    setPlaying(false)
    setStep(-1)
  }, [])

  const start = useCallback(() => {
    stopOther?.()
    const a = audio()
    void a.resume()
    let next = a.currentTime + 0.06
    let s = 0
    const queue: { s: number; t: number }[] = []
    timer.current = window.setInterval(() => {
      while (next < a.currentTime + 0.12) {
        for (const l of LANES) if (gridRef.current[l.id].has(s)) hit(l.id, next)
        queue.push({ s, t: next })
        next += 60 / tempoRef.current / 4
        s = (s + 1) % STEPS
      }
    }, 25)
    const draw = () => {
      while (queue.length > 1 && queue[1].t <= a.currentTime) queue.shift()
      if (queue.length && queue[0].t <= a.currentTime) setStep(queue[0].s)
      raf.current = requestAnimationFrame(draw)
    }
    raf.current = requestAnimationFrame(draw)
    stopOther = stop
    setPlaying(true)
  }, [stop])

  useEffect(() => () => {
    if (stopOther === stop) stopOther = null
    stop()
  }, [stop])

  const toggle = (lane: Lane, i: number) =>
    setGrid((g) => {
      const n = new Set(g[lane])
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return { ...g, [lane]: n }
    })

  const edited = LANES.some((l) => {
    const a = grid[l.id]
    const b = new Set(pattern[l.id] ?? [])
    return a.size !== b.size || [...a].some((x) => !b.has(x))
  })

  return (
    <figure className={styles.player} aria-label={`${name} drum pattern`}>
      <div className={styles.bar}>
        <button type="button" className={styles.play} onClick={playing ? stop : start} aria-pressed={playing}>
          {playing ? '■ Stop' : '▶ Play'}
        </button>
        <span className={styles.name}>{name}</span>
        <label className={styles.tempo}>
          <span>{tempo} BPM</span>
          <input type="range" min={160} max={180} value={tempo} onChange={(e) => setTempo(Number(e.target.value))} aria-label="Tempo" />
        </label>
        {edited && (
          <button type="button" className={styles.reset} onClick={() => setGrid(toSets(pattern))}>
            Reset
          </button>
        )}
      </div>
      <div className={styles.grid} role="group" aria-label="Step grid — click a step to toggle it">
        <div className={styles.row} aria-hidden="true">
          <span />
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} className={styles.count}>
              {i % 4 === 0 ? i / 4 + 1 : i % 2 === 0 ? '&' : ''}
            </span>
          ))}
        </div>
        {lanes.map((l) => (
          <div key={l.id} className={styles.row}>
            <span className={styles.lane}>{l.label}</span>
            {Array.from({ length: STEPS }, (_, i) => (
              <button
                key={i}
                type="button"
                className={styles.step}
                data-lane={l.id}
                data-on={grid[l.id].has(i) || undefined}
                data-now={step === i || undefined}
                data-beat={i % 4 === 0 || undefined}
                aria-pressed={grid[l.id].has(i)}
                aria-label={`${l.label}, step ${i + 1}`}
                onClick={() => toggle(l.id, i)}
              />
            ))}
          </div>
        ))}
      </div>
      <figcaption className={styles.caption}>1 bar · 16 steps · click a step to edit, then press play</figcaption>
    </figure>
  )
}
