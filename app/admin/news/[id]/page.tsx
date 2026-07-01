"use client"

import { use, useEffect, useRef, useState } from "react"
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LinkExt from "@tiptap/extension-link"
import EditorMenu from "../../releases/components/EditorMenu"
import { sanitizeHtml } from "@/app/utils/sanitize"

interface PageProps { params: Promise<{ id: string }> }

const NEWS_CATEGORIES = ["Artist Interviews", "Streaming", "Press", "General", "Mixes"]

interface NewsItem { id: string; slug: string; title: string; content?: string | null; coverImageUrl?: string | null; scsc?: string | null; youtubeUrl?: string | null; soundcloudUrl?: string | null; tracklist?: string | null; mixDownloadUrl?: string | null; mixDownloadKey?: string | null; mixArtistId?: string | null; relatedArtistName?: string | null; publishedAt?: string | null; categories: string[] }
interface ArtistOption { id: string; name: string; slug: string; imageUrl?: string | null }

export default function NewsDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [item, setItem] = useState<NewsItem | null>(null)
  const [artists, setArtists] = useState<ArtistOption[]>([])
  const [saving, setSaving] = useState(false)
  const [, setSlugEdited] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const mixDownloadInputRef = useRef<HTMLInputElement>(null)
  const fromEditor = useRef(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/admin/news/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setItem({ ...data.item, categories: data.item?.categories || ['General'] })
        setSlugEdited(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    const loadArtists = async () => {
      const res = await fetch('/api/admin/artists?limit=200', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setArtists(data.items || [])
    }
    loadArtists()
  }, [])

  const editor = useEditor({
    extensions: [StarterKit, LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } })],
    content: item?.content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      fromEditor.current = true
      setItem(prev => prev ? { ...prev, content: html } : prev)
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!editor || !item) return
    if (fromEditor.current) {
      fromEditor.current = false
      return
    }
    editor.commands.setContent(item.content || '')
  }, [item, editor])

  const save = async () => {
    if (!item) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
      if (res.ok) {
        toast.success('News saved')
        router.push('/admin/news')
      } else {
        const e = await res.json().catch(() => null)
        toast.error(e?.error || 'Save failed')
      }
    } finally { setSaving(false) }
  }

  // removed unused slugify helper

  const uploadImage = async (file: File) => {
    const body = new FormData()
    body.append('file', file)
    body.append('kind', 'image')
    body.append('slug', item?.slug || '')
    body.append('baseDir', 'news')
    const res = await fetch('/api/admin/upload', { method: 'POST', body })
    if (!res.ok) { toast.error('Image upload failed'); return }
    const data = await res.json()
    if (item) setItem({ ...item, coverImageUrl: data.url || item.coverImageUrl })
    toast.success('Image uploaded')
  }

  const uploadMixDownload = async (file: File) => {
    if (!item) return
    if (!item.slug) { toast.error('Add a slug before uploading'); return }
    const presignRes = await fetch('/api/admin/upload/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name, size: file.size, type: file.type || 'application/octet-stream', kind: 'download', slug: item.slug, baseDir: 'news' }),
    })
    const presign = await presignRes.json().catch(() => null)
    if (!presignRes.ok) { toast.error(presign?.error || 'Mix upload could not start'); return }

    const uploadRes = await fetch(presign.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    })
    if (!uploadRes.ok) { toast.error(`R2 upload failed (${uploadRes.status})`); return }

    setItem({ ...item, mixDownloadUrl: presign.url || item.mixDownloadUrl, mixDownloadKey: presign.key || item.mixDownloadKey })
    toast.success('Mix uploaded to R2')
  }

  const clearMixDownload = () => {
    if (!item) return
    setItem({ ...item, mixDownloadUrl: '', mixDownloadKey: '' })
    if (mixDownloadInputRef.current) mixDownloadInputRef.current.value = ''
  }

  if (!item) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit News</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/admin/news')} className="px-4 py-2 border border-purple-500/30 rounded">Back</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-700/60 hover:bg-green-700 rounded">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Title</label>
          <input value={item.title} onChange={e => setItem({ ...item, title: e.target.value })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Slug</label>
          <input value={item.slug} onChange={e => { setSlugEdited(true); setItem({ ...item, slug: e.target.value }) }} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Published At</label>
          <input type="date" value={item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0,10) : ''} onChange={e => setItem({ ...item, publishedAt: e.target.value ? new Date(e.target.value + 'T00:00:00Z').toISOString() : null })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Cover Image URL</label>
          <input value={item.coverImageUrl || ''} onChange={e => setItem({ ...item, coverImageUrl: e.target.value })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
          <div className="mt-2 flex items-center gap-2">
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f) }} />
            <button onClick={() => imageInputRef.current?.click()} className="px-3 py-1 border border-purple-500/30 rounded">Upload</button>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Content</label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-black/50 border border-purple-500/30 rounded min-h-[300px] p-3">
              <EditorMenu editor={editor} />
              <EditorContent editor={editor} className="prose prose-invert prose-purple max-w-none min-h-[220px] focus:outline-none" />
            </div>
            <div className="min-h-[300px] px-3 py-2 bg-black/30 border border-purple-500/30 rounded prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content || "") }} />
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400">SoundCloud Embed HTML (legacy scsc)</label>
          <input value={item.scsc || ''} onChange={e => setItem({ ...item, scsc: e.target.value })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">YouTube URL</label>
          <input
            value={item.youtubeUrl || ''}
            onChange={e => setItem({ ...item, youtubeUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          />
          <p className="mt-1 text-xs text-gray-500">Paste a regular YouTube link; the article turns it into an embed.</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">SoundCloud URL</label>
          <input
            value={item.soundcloudUrl || ''}
            onChange={e => setItem({ ...item, soundcloudUrl: e.target.value })}
            placeholder="https://soundcloud.com/..."
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          />
          <p className="mt-1 text-xs text-gray-500">Paste a regular SoundCloud track/set link; no iframe needed.</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Mix Artist (from Artists DB)</label>
          <select
            value={item.mixArtistId || ''}
            onChange={e => {
              const artist = artists.find(a => a.id === e.target.value)
              setItem({ ...item, mixArtistId: e.target.value || '', relatedArtistName: artist?.name || item.relatedArtistName || '' })
            }}
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          >
            <option value="">No mix artist selected</option>
            {artists.map(artist => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">Related Artist Name</label>
          <input value={item.relatedArtistName || ''} onChange={e => setItem({ ...item, relatedArtistName: e.target.value })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Tracklist (for Mixes)</label>
          <textarea
            value={item.tracklist || ''}
            onChange={e => setItem({ ...item, tracklist: e.target.value })}
            rows={8}
            placeholder="01. Artist - Track Title\n02. Artist - Track Title"
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded font-mono text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">One track per line. Displayed only on news articles in the Mixes category.</p>
        </div>
        <div className="md:col-span-2 rounded-lg border border-purple-500/20 bg-purple-950/10 p-4">
          <label className="text-sm text-gray-400">Download Mix (for Mixes)</label>
          <input
            value={item.mixDownloadUrl || ''}
            onChange={e => setItem({ ...item, mixDownloadUrl: e.target.value })}
            placeholder="Upload a file or paste a direct download URL"
            className="mt-1 w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          />
          <input
            ref={mixDownloadInputRef}
            type="file"
            accept="audio/*,video/*,application/zip,application/x-zip-compressed,application/octet-stream"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadMixDownload(f) }}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => mixDownloadInputRef.current?.click()} className="px-3 py-1 border border-purple-500/30 rounded hover:border-purple-400/60">Upload mix to R2</button>
            {(item.mixDownloadUrl || item.mixDownloadKey) && <button type="button" onClick={clearMixDownload} className="px-3 py-1 border border-red-500/30 text-red-200 rounded hover:border-red-400/60">Clear</button>}
            {item.mixDownloadUrl && <a href={item.mixDownloadUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-300 underline underline-offset-4">Open file</a>}
          </div>
          {item.mixDownloadKey && <p className="mt-2 text-xs text-gray-500 font-mono break-all">R2 key: {item.mixDownloadKey}</p>}
          <p className="mt-1 text-xs text-gray-500">Displayed as a download CTA only on Mixes articles.</p>
        </div>
        <div>
          <label className="text-sm text-gray-400">Categories</label>
          <div className="flex flex-wrap gap-2 mt-3">
            {NEWS_CATEGORIES.map((cat) => {
              const checked = (item.categories || []).includes(cat)
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={checked}
                  onClick={() => {
                    const existing = item.categories || []
                    const next = checked
                      ? existing.filter((c) => c !== cat)
                      : Array.from(new Set([...existing, cat]))
                    setItem({ ...item, categories: next.length ? next : ['General'] })
                  }}
                  className={`px-3 py-2 rounded-full border transition-all ${
                    checked
                      ? 'border-purple-500/60 bg-purple-600/30 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      : 'border-purple-500/20 bg-black/40 text-gray-200 hover:border-purple-500/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
