"use client"

import { useMemo, useState } from "react"
import toast from 'react-hot-toast'
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FaPlus, FaSearch, FaTrash, FaEdit } from "react-icons/fa"
import NiceSelect from "@/app/components/NiceSelect"
import { useDebounce } from "@/app/hooks/useDebounce"

interface ReleaseItem {
  id: string
  slug: string
  title: string
  coverImageUrl?: string | null
  categories: string[]
  publishedAt?: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function ReleasesClient({ items, pagination }: { items: ReleaseItem[]; pagination: Pagination }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const debouncedSearch = useDebounce(search, 250)

  const categoryList = useMemo(() => {
    const set = new Set<string>()
    items.forEach(i => i.categories?.forEach(c => set.add(c)))
    return Array.from(set)
  }, [items])

  const formatDate = (val?: string | null) => (val ? new Date(val).toLocaleString() : "-")

  const pushParams = (next: URLSearchParams) => {
    router.push(`/admin/releases?${next.toString()}`)
  }

  const updateQuery = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    next.set("page", "1")
    pushParams(next)
  }

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this release?")) return
    const res = await fetch(`/api/admin/releases?id=${encodeURIComponent(id)}`, { method: "DELETE" })
    if (res.ok) { toast.success('Release deleted'); router.refresh() }
    else { const e = await res.json().catch(() => null); toast.error(e?.error || 'Delete failed') }
  }

  // propagate debounced search to URL
  useMemo(() => {
    const current = searchParams.get("search") || ""
    if (debouncedSearch !== current) updateQuery("search", debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Releases</h1>
        <Link href="/admin/releases/new" className="px-4 py-2 bg-purple-700/60 hover:bg-purple-700 rounded-lg flex items-center gap-2">
          <FaPlus className="w-4 h-4" /> New Release
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title or slug"
            className="w-full pl-9 pr-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          />
        </div>
        <div className="w-56">
          <NiceSelect
            value={category}
            options={[{ value: "", label: "All categories" }, ...categoryList]}
            onChange={v => {
              setCategory(v)
              updateQuery("category", v)
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map(item => (
          <div key={item.id} className="border border-purple-500/20 rounded-lg p-4 bg-black/40 flex gap-4">
            <div className="w-20 h-20 bg-black/40 border border-purple-500/20 rounded overflow-hidden flex items-center justify-center">
              {item.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.coverImageUrl} alt={item.title} className="object-cover w-full h-full" />
              ) : (
                <div className="text-gray-500 text-sm">No Image</div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs text-gray-400">{item.slug}</div>
              <div className="text-xs text-gray-400 mt-1">Published: {formatDate(item.publishedAt)}</div>
              {!!item.categories?.length && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {item.categories.map(c => (
                    <span key={c} className="text-xs px-2 py-1 rounded border border-purple-500/30 text-purple-300">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/releases/${item.id}`} className="p-2 rounded hover:bg-purple-500/10 text-blue-300">
                <FaEdit />
              </Link>
              <button onClick={() => deleteItem(item.id)} className="p-2 rounded hover:bg-red-500/10 text-red-300">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={pagination.page === 1}
            onClick={() => {
              const next = new URLSearchParams(searchParams.toString())
              next.set("page", String(Math.max(1, pagination.page - 1)))
              pushParams(next)
            }}
            className="px-3 py-1 border border-purple-500/30 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-gray-400">
            {pagination.page} / {pagination.pages}
          </div>
          <button
            disabled={pagination.page === pagination.pages}
            onClick={() => {
              const next = new URLSearchParams(searchParams.toString())
              next.set("page", String(Math.min(pagination.pages, pagination.page + 1)))
              pushParams(next)
            }}
            className="px-3 py-1 border border-purple-500/30 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}


