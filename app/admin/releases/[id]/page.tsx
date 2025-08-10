"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import toast from 'react-hot-toast'
import DOMPurify from "isomorphic-dompurify"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LinkExt from "@tiptap/extension-link"
import EditorMenu from "../components/EditorMenu"
import { useParams, useRouter } from "next/navigation"
import NextLink from "next/link"

interface ReleaseItem {
  id: string
  slug: string
  title: string
  content?: string | null
  coverImageUrl?: string | null
  previewUrl?: string | null
  spotify?: string | null
  appleMusic?: string | null
  beatport?: string | null
  deezer?: string | null
  soundcloud?: string | null
  youtubeMusic?: string | null
  junoDownload?: string | null
  tidal?: string | null
  gumroad?: string | null
  bandcamp?: string | null
  categories: string[]
  publishedAt?: string | null
}

export default function ReleaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [item, setItem] = useState<ReleaseItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>("")
  const [slugEdited, setSlugEdited] = useState(false)
  const [allCategories, setAllCategories] = useState<string[]>([])
  const coverInputRef = useRef<HTMLInputElement>(null)
  const previewInputRef = useRef<HTMLInputElement>(null)
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/admin/releases/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setItem(data.item)
        setSlugEdited(false)
        setLastSavedSnapshot(JSON.stringify(data.item))
      }
    }
    load()
  }, [id])

  useEffect(() => {
    const loadCats = async () => {
      const res = await fetch('/api/admin/releases/categories', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setAllCategories(data.categories || [])
      }
    }
    loadCats()
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } })],
    content: item?.content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setItem(prev => prev ? { ...prev, content: html } : prev)
    }
  })

  useEffect(() => {
    if (editor && item) editor.commands.setContent(item.content || '')
  }, [item, editor])

  const save = async () => {
    if (!item) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/releases/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item)
      })
      if (res.ok) {
        const saved = await res.json().catch(() => null)
        if (saved?.item) setItem(saved.item)
        setLastSavedSnapshot(JSON.stringify(item))
        toast.success('Release saved')
        router.push('/admin/releases')
      } else { const e = await res.json().catch(() => null); toast.error(e?.error || 'Save failed') }
    } finally {
      setSaving(false)
    }
  }

  const autoSave = async () => {
    if (!item) return
    setAutoSaving(true)
    try {
      const res = await fetch(`/api/admin/releases/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item)
      })
      if (res.ok) {
        const saved = await res.json().catch(() => null)
        if (saved?.item) setItem(saved.item)
        setLastSavedSnapshot(JSON.stringify(item))
      }
    } finally {
      setAutoSaving(false)
    }
  }

  const isDirty = useMemo(() => {
    if (!item) return false
    const snap = lastSavedSnapshot
    if (!snap) return false
    return JSON.stringify(item) !== snap
  }, [item, lastSavedSnapshot])

  useEffect(() => {
    if (!item) return
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    autoSaveTimerRef.current = setTimeout(() => {
      if (isDirty) autoSave()
    }, 1200)
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current) }
  }, [item, isDirty])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [save])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty || saving || autoSaving) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty, saving, autoSaving])

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const uploadFile = async (file: File, kind: 'cover' | 'preview') => {
    const body = new FormData()
    body.append('file', file)
    body.append('kind', kind)
    body.append('slug', item?.slug || '')
    body.append('baseDir', 'releases')
    const res = await fetch('/api/admin/upload', { method: 'POST', body })
    if (!res.ok) { toast.error('Upload failed'); return }
    const data = await res.json()
    if (!item) return
    if (kind === 'cover') setItem({ ...item, coverImageUrl: data.url || item.coverImageUrl })
    if (kind === 'preview') setItem({ ...item, previewUrl: data.url || item.previewUrl })
    toast.success('File uploaded')
  }

  if (!item) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Release</h1>
        <div className="flex gap-2">
          <div className="text-sm text-gray-400 flex items-center">{saving || autoSaving ? 'Saving…' : isDirty ? 'Unsaved changes' : 'Saved'}</div>
          {item?.slug && (
            <NextLink href={`/music/${item.slug}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-purple-500/30 rounded">
              View
            </NextLink>
          )}
          <button onClick={() => router.push('/admin/releases')} className="px-4 py-2 border border-purple-500/30 rounded">Back</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-700/60 hover:bg-green-700 rounded">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Title</label>
          <input
            value={item.title}
            onChange={e => {
              const title = e.target.value
              setItem(prev => {
                if (!prev) return prev
                const next = { ...prev, title }
                if (!slugEdited) next.slug = slugify(title)
                return next
              })
            }}
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Slug</label>
          <input
            value={item.slug}
            onChange={e => { setSlugEdited(true); setItem({ ...item, slug: e.target.value }) }}
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Content</label>
            <div className="bg-black/50 border border-purple-500/30 rounded min-h-[300px] p-3">
              <EditorMenu editor={editor} />
              <EditorContent editor={editor} className="prose prose-invert prose-purple max-w-none min-h-[220px] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400">Preview</label>
            <div
              className="min-h-[300px] px-3 py-2 bg-black/30 border border-purple-500/30 rounded prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content || '') }}
            />
          </div>
        </div>
        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f, 'cover')
        }}>
          <label className="text-sm text-gray-400">Cover Image URL</label>
          <input value={item.coverImageUrl || ''} onChange={e => setItem({ ...item, coverImageUrl: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
          <div className="mt-2 flex items-center gap-2">
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
              const f = e.target.files?.[0]; if (f) uploadFile(f, 'cover')
            }} />
            <button onClick={() => coverInputRef.current?.click()} className="px-3 py-1 border border-purple-500/30 rounded">Upload</button>
          </div>
        </div>
        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f, 'preview')
        }}>
          <label className="text-sm text-gray-400">Preview URL</label>
          <input value={item.previewUrl || ''} onChange={e => setItem({ ...item, previewUrl: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
          <div className="mt-2 flex items-center gap-2">
            <input ref={previewInputRef} type="file" accept="audio/*,video/*" className="hidden" onChange={e => {
              const f = e.target.files?.[0]; if (f) uploadFile(f, 'preview')
            }} />
            <button onClick={() => previewInputRef.current?.click()} className="px-3 py-1 border border-purple-500/30 rounded">Upload</button>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400">Spotify</label>
          <input value={item.spotify || ''} onChange={e => setItem({ ...item, spotify: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Apple Music</label>
          <input value={item.appleMusic || ''} onChange={e => setItem({ ...item, appleMusic: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Beatport</label>
          <input value={item.beatport || ''} onChange={e => setItem({ ...item, beatport: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Deezer</label>
          <input value={item.deezer || ''} onChange={e => setItem({ ...item, deezer: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">SoundCloud</label>
          <input value={item.soundcloud || ''} onChange={e => setItem({ ...item, soundcloud: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Gumroad</label>
          <input value={item.gumroad || ''} onChange={e => setItem({ ...item, gumroad: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Bandcamp</label>
          <input value={item.bandcamp || ''} onChange={e => setItem({ ...item, bandcamp: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">YouTube Music</label>
          <input value={item.youtubeMusic || ''} onChange={e => setItem({ ...item, youtubeMusic: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">JunoDownload</label>
          <input value={item.junoDownload || ''} onChange={e => setItem({ ...item, junoDownload: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Tidal</label>
          <input value={item.tidal || ''} onChange={e => setItem({ ...item, tidal: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Categories (comma separated)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {item.categories?.map(c => (
              <span key={c} className="text-xs px-2 py-1 rounded border border-purple-500/30 text-purple-300 flex items-center gap-2">
                {c}
                <button
                  onClick={() => setItem(prev => prev ? { ...prev, categories: (prev.categories || []).filter(x => x !== c) } : prev)}
                  className="text-gray-400 hover:text-red-300"
                  aria-label={`Remove ${c}`}
                >×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <select
              onChange={e => {
                const v = e.target.value
                if (!v) return
                setItem(prev => prev ? { ...prev, categories: Array.from(new Set([...(prev.categories || []), v])) } : prev)
              }}
              className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
            >
              <option value="">Add category…</option>
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              placeholder="New category"
              className="flex-1 px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const v = (e.currentTarget as HTMLInputElement).value.trim()
                  if (v) setItem(prev => prev ? { ...prev, categories: Array.from(new Set([...(prev.categories || []), v])) } : prev)
                  ;(e.currentTarget as HTMLInputElement).value = ''
                }
              }}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Published At</label>
          <input
            type="date"
            value={item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0,10) : ''}
            onChange={e => setItem({ ...item, publishedAt: e.target.value ? new Date(e.target.value + 'T00:00:00Z').toISOString() : null })}
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          />
        </div>
      </div>
    </div>
  )
}


