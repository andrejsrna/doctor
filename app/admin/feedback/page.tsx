"use client"

import { useEffect, useState } from 'react'

interface FeedbackItem {
  id: string
  recipientEmail: string
  subject: string
  rating: number | null
  feedback: string | null
  name: string | null
  submittedAt: string | null
  createdAt: string
  release?: { title: string; slug: string } | null
  files?: Array<{ id: string; name: string; path?: string }>
}

export default function FeedbackAdminPage() {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [legacyOnly, setLegacyOnly] = useState(false)
  const [ratingMin, setRatingMin] = useState('')
  const [ratingMax, setRatingMax] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const run = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit), legacy: String(legacyOnly) })
        if (search) params.set('search', search)
        if (ratingMin) params.set('ratingMin', ratingMin)
        if (ratingMax) params.set('ratingMax', ratingMax)
        if (startDate) params.set('startDate', startDate)
        if (endDate) params.set('endDate', endDate)
        const res = await fetch(`/api/admin/feedback?${params}`, { cache: 'no-store', signal: controller.signal })
        if (res.ok) {
          const data = await res.json()
          setItems(data.items)
          setTotalPages(data.pagination?.pages || 1)
        } else if (res.status === 401) {
          setItems([])
        }
      } catch (e) {
        const err = e as { name?: string }
        if (err?.name !== 'AbortError') console.error(e)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    run()
    return () => controller.abort()
  }, [page, search, legacyOnly, ratingMin, ratingMax, startDate, endDate, limit])

  // removed unused fetchItems

  const formatDate = (v?: string | null) => v ? new Date(v).toLocaleDateString() : '-'

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search"
               className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={legacyOnly} onChange={e => setLegacyOnly(e.target.checked)} /> Legacy only
        </label>
        <input value={ratingMin} onChange={e => setRatingMin(e.target.value)} placeholder="Min rating" className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        <input value={ratingMax} onChange={e => setRatingMax(e.target.value)} placeholder="Max rating" className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
      </div>

      {loading ? <div className="text-gray-400">Loading...</div> : items.length === 0 ? (
        <div className="text-gray-500">No feedback found.</div>
      ) : (
        <div className="space-y-2">
          {items.map(it => (
            <div key={it.id} className="border border-purple-500/20 rounded p-3 bg-black/40">
              <div className="flex justify-between text-sm text-gray-400">
                <div>{formatDate(it.submittedAt) || formatDate(it.createdAt)}</div>
                <div>Rating: {it.rating ?? '-'}</div>
              </div>
              <div className="mt-1 text-white">{(() => {
                const t = it.feedback || ''
                if (!t) return '(no text)'
                if (/^\".*\"$/.test(t)) return t.slice(1, -1)
                return t
              })()}</div>
              <div className="mt-1 text-xs text-gray-500">By: {it.name || 'Anonymous'}</div>
              {it.release ? (
                <div className="text-xs text-gray-400">For: <a className="underline" href={`/music/${it.release.slug}`} target="_blank" rel="noopener noreferrer">{it.release.title}</a></div>
              ) : null}
              {Array.isArray(it.files) && it.files.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-400 mb-1">Files:</div>
                  <ul className="text-xs text-purple-300 space-y-1">
                    {it.files.map(f => (
                      <li key={f.id}>
                        {f.path ? (
                          <a href={f.path} target="_blank" rel="noopener noreferrer" className="underline">{f.name}</a>
                        ) : (
                          <span>{f.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 border border-purple-500/30 rounded disabled:opacity-50">Prev</button>
          <div className="text-gray-400">{page} / {totalPages}</div>
          <button disabled={page===totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1 border border-purple-500/30 rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  )
}


