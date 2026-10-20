'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IoClose, IoSearch } from 'react-icons/io5'
import { displayFont, monoFont } from './brandFonts'
import SearchResults from './SearchResults'
import { EMPTY_GROUPS, flatHits, searchSite, type SearchGroups } from '../lib/catalog-search'
import styles from './search.module.css'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const QUICK = [
  { href: '/music', label: 'All releases' },
  { href: '/artists', label: 'Artists' },
  { href: '/neurofunk-dnb-mixes', label: 'DJ mixes' },
  { href: '/sample-packs', label: 'Sample packs' },
  { href: '/news', label: 'News' },
]

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  if (!isOpen) return null
  return <Overlay onClose={onClose} />
}

/** Mounted only while open, so every open starts with a clean state. */
function Overlay({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [groups, setGroups] = useState<SearchGroups>(EMPTY_GROUPS)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [active, setActive] = useState(-1)
  const input = useRef<HTMLInputElement>(null)

  const hits = flatHits(groups)
  const q = query.trim()

  // debounced fetch; aborts the previous request
  useEffect(() => {
    if (q.length < 2) return
    const ctrl = new AbortController()
    const t = setTimeout(() => {
      setStatus('loading')
      searchSite(q, 6, ctrl.signal)
        .then((g) => {
          setGroups(g)
          setActive(-1)
          setStatus('done')
        })
        .catch((e) => {
          if (e?.name !== 'AbortError') setStatus('error')
        })
    }, 220)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [q])

  // lock page scroll, close on Escape
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    input.current?.focus()
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const onChange = (v: string) => {
    setQuery(v)
    if (v.trim().length < 2) {
      setGroups(EMPTY_GROUPS)
      setStatus('idle')
      setActive(-1)
    }
  }

  const viewAll = () => {
    if (q.length < 2) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
    onClose()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!hits.length) return
      e.preventDefault()
      const next = e.key === 'ArrowDown' ? (active + 1) % hits.length : (active - 1 + hits.length) % hits.length
      setActive(next)
      document.getElementById(`sm-${next}`)?.scrollIntoView({ block: 'nearest' })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (active >= 0 && hits[active]) {
        router.push(hits[active].href)
        onClose()
      } else viewAll()
    }
  }

  const loading = status === 'loading'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
      className={`${styles.overlay} ${displayFont.variable} ${monoFont.variable}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.sheet}>
        <div className={styles.bar}>
          <IoSearch className={styles.barIcon} aria-hidden="true" />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search artists, releases, mixes…"
            aria-label="Search"
            aria-controls="sm-results"
            aria-activedescendant={active >= 0 ? `sm-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
            maxLength={80}
          />
          {loading && <span className={styles.spinner} aria-hidden="true" />}
          <button type="button" onClick={onClose} className={styles.close} aria-label="Close search">
            <span>Esc</span>
            <IoClose aria-hidden="true" />
          </button>
        </div>

        <div className={styles.body} id="sm-results" aria-live="polite" data-loading={loading || undefined}>
          {q.length < 2 ? (
            <div className={styles.idle}>
              <p className={styles.kicker}>Quick links</p>
              <ul className={styles.quick}>
                {QUICK.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={onClose}>
                      {l.label} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : status === 'error' ? (
            <p className={styles.empty} role="alert">
              Search is unavailable. Please try again.
            </p>
          ) : status === 'done' && !hits.length ? (
            <div className={styles.empty}>
              <p>
                No signal for <strong>&ldquo;{q}&rdquo;</strong>
              </p>
              <p>
                Try an artist name or a track title, or browse <Link href="/music" onClick={onClose}>all releases</Link>.
              </p>
            </div>
          ) : (
            <SearchResults groups={groups} active={active} onHover={setActive} onPick={onClose} idPrefix="sm" />
          )}
        </div>

        <div className={styles.foot}>
          <span className={styles.keys} aria-hidden="true">
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate <kbd>↵</kbd> open
          </span>
          {q.length >= 2 && (
            <button type="button" className={styles.all} onClick={viewAll}>
              All results for &ldquo;{q}&rdquo; <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
