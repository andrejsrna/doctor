'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { IoSearch } from 'react-icons/io5'
import SearchResults from '@/app/components/SearchResults'
import { EMPTY_GROUPS, flatHits, searchSite, type SearchGroups } from '@/app/lib/catalog-search'
import styles from '@/app/components/search.module.css'

export default function SearchPageClient() {
  const urlQuery = useSearchParams()?.get('q') ?? ''
  const [query, setQuery] = useState(urlQuery)
  const [groups, setGroups] = useState<SearchGroups>(EMPTY_GROUPS)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const q = query.trim()

  useEffect(() => {
    if (q.length < 2) return
    const ctrl = new AbortController()
    const t = setTimeout(() => {
      setStatus('loading')
      // keep the URL shareable without adding history entries
      window.history.replaceState(null, '', `/search?q=${encodeURIComponent(q)}`)
      searchSite(q, 50, ctrl.signal)
        .then((g) => {
          setGroups(g)
          setStatus('done')
        })
        .catch((e) => {
          if (e?.name !== 'AbortError') setStatus('error')
        })
    }, 250)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [q])

  const onChange = (v: string) => {
    setQuery(v)
    if (v.trim().length < 2) {
      setGroups(EMPTY_GROUPS)
      setStatus('idle')
    }
  }

  const total = flatHits(groups).length

  return (
    <div className={styles.pageBox}>
      <div className={styles.bar}>
        <IoSearch className={styles.barIcon} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search artists, releases, mixes…"
          aria-label="Search"
          autoComplete="off"
          spellCheck={false}
          maxLength={80}
          autoFocus
        />
        {status === 'loading' && <span className={styles.spinner} aria-hidden="true" />}
      </div>

      <div aria-live="polite" data-loading={status === 'loading' || undefined} className={styles.body}>
        {q.length < 2 ? (
          <p className={styles.empty}>Type at least 2 characters — an artist, a track title or a mix.</p>
        ) : status === 'error' ? (
          <p className={styles.empty} role="alert">
            Search is unavailable. Please try again.
          </p>
        ) : status === 'done' && !total ? (
          <div className={styles.empty}>
            <p>
              No signal for <strong>&ldquo;{q}&rdquo;</strong>
            </p>
            <p>
              Try an artist name or a track title, or browse <Link href="/music">all releases</Link>.
            </p>
          </div>
        ) : (
          <>
            {status === 'done' && (
              <p className={styles.count}>
                {total} result{total === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
              </p>
            )}
            <SearchResults groups={groups} idPrefix="sp" />
          </>
        )}
      </div>
    </div>
  )
}
