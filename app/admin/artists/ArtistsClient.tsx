"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { FaPlus, FaSearch, FaTrash, FaEdit } from "react-icons/fa"

interface ArtistItem {
  id: string
  slug: string
  name: string
  imageUrl?: string | null
}

interface Pagination { page: number; limit: number; total: number; pages: number }

export default function ArtistsClient({ items, pagination }: { items: ArtistItem[]; pagination: Pagination }) {
  const router = useRouter()
  const sp = useSearchParams()
  const [search, setSearch] = useState(() => sp?.get('search') ?? '')

  const push = (next: URLSearchParams) => router.push(`/admin/artists?${next.toString()}`)

  useMemo(() => {
    const current = sp?.get('search') ?? ''
    if (search !== current) {
      const next = sp ? new URLSearchParams(sp) : new URLSearchParams()
      if (search) next.set('search', search); else next.delete('search')
      next.set('page', '1')
      push(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const remove = async (id: string) => {
    if (!confirm('Delete this artist?')) return
    await fetch(`/api/admin/artists?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Artists</h1>
        <Link href="/admin/artists/new" className="px-4 py-2 bg-purple-700/60 hover:bg-purple-700 rounded-lg flex items-center gap-2">
          <FaPlus className="w-4 h-4" /> New Artist
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or slug"
                 className="w-full pl-9 pr-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map(item => (
          <div key={item.id} className="border border-purple-500/20 rounded-lg p-4 bg-black/40 flex gap-4">
            <div className="w-20 h-20 bg-black/40 border border-purple-500/20 rounded overflow-hidden flex items-center justify-center">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
              ) : (
                <div className="text-gray-500 text-sm">No Image</div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-gray-400">{item.slug}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/artists/${item.id}`} className="p-2 rounded hover:bg-purple-500/10 text-blue-300"><FaEdit /></Link>
              <button onClick={() => remove(item.id)} className="p-2 rounded hover:bg-red-500/10 text-red-300"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button disabled={pagination.page === 1}
                  onClick={() => { const next = sp ? new URLSearchParams(sp) : new URLSearchParams(); next.set('page', String(Math.max(1, pagination.page - 1))); push(next) }}
                  className="px-3 py-1 border border-purple-500/30 rounded disabled:opacity-50">Prev</button>
          <div className="text-gray-400">{pagination.page} / {pagination.pages}</div>
          <button disabled={pagination.page === pagination.pages}
                  onClick={() => { const next = sp ? new URLSearchParams(sp) : new URLSearchParams(); next.set('page', String(Math.min(pagination.pages, pagination.page + 1))); push(next) }}
                  className="px-3 py-1 border border-purple-500/30 rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  )
}
