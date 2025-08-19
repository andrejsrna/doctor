"use client"

import { useEffect, useState } from 'react'

interface FeedbackItem {
  id: string
  recipientEmail: string
  senderEmail?: string | null
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

  const formatDate = (v?: string | null) => v ? new Date(v).toLocaleDateString() : '-'
  
  const formatFeedback = (feedback: string | null) => {
    if (!feedback) return <span className="text-gray-500 italic">(no feedback text)</span>
    const cleanText = feedback.replace(/^["']|["']$/g, '') // Remove surrounding quotes
    return cleanText.length > 100 ? (
      <span title={cleanText}>
        {cleanText.substring(0, 100)}...
      </span>
    ) : (
      <span>{cleanText}</span>
    )
  }

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'text-gray-500'
    if (rating >= 4) return 'text-green-400'
    if (rating >= 3) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Feedback</h1>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search feedback, name, email..." 
          className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-sm" 
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={legacyOnly} onChange={e => setLegacyOnly(e.target.checked)} /> 
          Legacy only
        </label>
        <input 
          value={ratingMin} 
          onChange={e => setRatingMin(e.target.value)} 
          placeholder="Min rating" 
          className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-sm" 
        />
        <input 
          value={ratingMax} 
          onChange={e => setRatingMax(e.target.value)} 
          placeholder="Max rating" 
          className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-sm" 
        />
        <input 
          type="date" 
          value={startDate} 
          onChange={e => setStartDate(e.target.value)} 
          className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-sm" 
        />
        <input 
          type="date" 
          value={endDate} 
          onChange={e => setEndDate(e.target.value)} 
          className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-sm" 
        />
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">No feedback found.</div>
      ) : (
        <div className="space-y-2">
          {items.map(it => (
            <div key={it.id} className="border border-purple-500/20 rounded p-3 bg-black/40 hover:bg-black/60 transition-colors">
              {/* Header with date, rating, and sender info */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{formatDate(it.submittedAt) || formatDate(it.createdAt)}</span>
                  <span className={`font-medium ${getRatingColor(it.rating)}`}>
                    {it.rating ? `★ ${it.rating}/5` : 'No rating'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {it.senderEmail && (
                    <div className="mb-1">
                      <span className="text-purple-300">From:</span> {it.senderEmail}
                    </div>
                  )}
                  <div>
                    <span className="text-purple-300">By:</span> {it.name || 'Anonymous'}
                  </div>
                </div>
              </div>

              {/* Feedback content */}
              <div className="mb-2 text-sm">
                {formatFeedback(it.feedback)}
              </div>

              {/* Release info */}
              {it.release && (
                <div className="mb-2 text-xs">
                  <span className="text-purple-300">Release:</span>{' '}
                  <a 
                    className="underline text-blue-300 hover:text-blue-200" 
                    href={`/music/${it.release.slug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {it.release.title}
                  </a>
                </div>
              )}

              {/* Files */}
              {Array.isArray(it.files) && it.files.length > 0 && (
                <div className="text-xs">
                  <span className="text-purple-300">Files ({it.files.length}):</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {it.files.map(f => (
                      <span key={f.id} className="inline-block">
                        {f.path ? (
                          <a 
                            href={f.path} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="underline text-blue-300 hover:text-blue-200"
                          >
                            {f.name}
                          </a>
                        ) : (
                          <span className="text-gray-400">{f.name}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button 
            disabled={page===1} 
            onClick={() => setPage(p => Math.max(1, p-1))} 
            className="px-3 py-1 border border-purple-500/30 rounded disabled:opacity-50 text-sm"
          >
            Prev
          </button>
          <div className="text-gray-400 text-sm">{page} / {totalPages}</div>
          <button 
            disabled={page===totalPages} 
            onClick={() => setPage(p => p+1)} 
            className="px-3 py-1 border border-purple-500/30 rounded disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}


