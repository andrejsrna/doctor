"use client"

import { useEffect, useRef, useState } from "react"
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LinkExt from "@tiptap/extension-link"
import EditorMenu from "../../releases/components/EditorMenu"
import { sanitizeHtml } from "@/app/utils/sanitize"

const NEWS_CATEGORIES = ["Artist Interviews", "Streaming", "Press", "General", "Mixes"]

interface NewsItem { slug: string; title: string; content?: string | null; coverImageUrl?: string | null; scsc?: string | null; tracklist?: string | null; mixDownloadUrl?: string | null; mixDownloadKey?: string | null; relatedArtistName?: string | null; publishedAt?: string | null; categories: string[] }

export default function NewsCreatePage() {
  const router = useRouter()
  const [item, setItem] = useState<NewsItem>({ slug: '', title: '', content: '', coverImageUrl: '', scsc: '', tracklist: '', mixDownloadUrl: '', mixDownloadKey: '', relatedArtistName: '', publishedAt: '', categories: ['General'] })
  const [saving, setSaving] = useState(false)
  const [slugEdited, setSlugEdited] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const mixDownloadInputRef = useRef<HTMLInputElement>(null)
  const fromEditor = useRef(false)

  const editor = useEditor({
    extensions: [StarterKit, LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } })],
    content: item.content || '',
    onUpdate: ({ editor }) => {
      fromEditor.current = true
      setItem(prev => ({ ...prev, content: editor.getHTML() }))
    },
    immediatelyRender: false,
  })

  // keep TipTap in sync if state changes outside of editor
  useEffect(() => {
    if (!editor || typeof item.content !== 'string') return
    if (fromEditor.current) {
      fromEditor.current = false
      return
    }
    editor.commands.setContent(item.content)
  }, [editor, item.content])

  const slugify = (text: string) => text.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

  const uploadImage = async (file: File) => {
    const body = new FormData()
    body.append('file', file)
    body.append('kind', 'image')
    body.append('slug', item.slug || slugify(item.title) || '')
    body.append('baseDir', 'news')
    const res = await fetch('/api/admin/upload', { method: 'POST', body })
    if (!res.ok) { toast.error('Image upload failed'); return }
    const data = await res.json()
    setItem(prev => ({ ...prev, coverImageUrl: data.url || prev.coverImageUrl }))
    toast.success('Image uploaded')
  }

  const uploadMixDownload = async (file: File) => {
    const slug = item.slug || slugify(item.title) || ''
    if (!slug) { toast.error('Add a title or slug before uploading'); return }
    const presignRes = await fetch('/api/admin/upload/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name, size: file.size, type: file.type || 'application/octet-stream', kind: 'download', slug, baseDir: 'news' }),
    })
    const presign = await presignRes.json().catch(() => null)
    if (!presignRes.ok) { toast.error(presign?.error || 'Mix upload could not start'); return }

    const uploadRes = await fetch(presign.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    })
    if (!uploadRes.ok) { toast.error(`R2 upload failed (${uploadRes.status})`); return }

    setItem(prev => ({ ...prev, mixDownloadUrl: presign.url || prev.mixDownloadUrl, mixDownloadKey: presign.key || prev.mixDownloadKey }))
    toast.success('Mix uploaded to R2')
  }

  const clearMixDownload = () => {
    setItem(prev => ({ ...prev, mixDownloadUrl: '', mixDownloadKey: '' }))
    if (mixDownloadInputRef.current) mixDownloadInputRef.current.value = ''
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        ...item,
        slug: item.slug || slugify(item.title),
      }) })
      if (res.ok) { toast.success('News created'); router.push('/admin/news') }
      else { const e = await res.json().catch(() => null); toast.error(e?.error || 'Create failed') }
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New News Article</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/admin/news')} className="px-4 py-2 border border-purple-500/30 rounded">Back</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-700/60 hover:bg-green-700 rounded">{saving ? 'Saving...' : 'Create'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Title</label>
          <input value={item.title} onChange={e => setItem(prev => ({ ...prev, title: e.target.value, slug: slugEdited ? prev.slug : slugify(e.target.value) }))} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Slug</label>
          <input value={item.slug} onChange={e => { setSlugEdited(true); setItem(prev => ({ ...prev, slug: e.target.value })) }} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Published At</label>
          <input type="date" value={item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0,10) : ''} onChange={e => setItem(prev => ({ ...prev, publishedAt: e.target.value ? new Date(e.target.value + 'T00:00:00Z').toISOString() : '' }))} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Cover Image URL</label>
          <input value={item.coverImageUrl || ''} onChange={e => setItem(prev => ({ ...prev, coverImageUrl: e.target.value }))} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
          <div className="mt-2 flex items-center gap-2">
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f) }} />
            <button onClick={() => imageInputRef.current?.click()} className="px-3 py-1 border border-purple-500/30 rounded">Upload</button>
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Content</label>
            <div className="bg-black/50 border border-purple-500/30 rounded min-h-[300px] p-2">
              <EditorMenu editor={editor} />
              <EditorContent editor={editor} className="prose prose-invert prose-purple max-w-none min-h-[220px] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400">Preview (sanitized)</label>
            <div
              className="min-h-[300px] px-3 py-2 bg-black/30 border border-purple-500/30 rounded prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content || "") }}
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400">SoundCloud Embed (scsc)</label>
          <input value={item.scsc || ''} onChange={e => setItem(prev => ({ ...prev, scsc: e.target.value }))} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Related Artist Name</label>
          <input value={item.relatedArtistName || ''} onChange={e => setItem(prev => ({ ...prev, relatedArtistName: e.target.value }))} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Tracklist (for Mixes)</label>
          <textarea
            value={item.tracklist || ''}
            onChange={e => setItem(prev => ({ ...prev, tracklist: e.target.value }))}
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
            onChange={e => setItem(prev => ({ ...prev, mixDownloadUrl: e.target.value }))}
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
              const checked = item.categories.includes(cat)
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={checked}
                  onClick={() => {
                    setItem((prev) => {
                      const existing = prev.categories || []
                      const next = checked
                        ? existing.filter((c) => c !== cat)
                        : Array.from(new Set([...existing, cat]))
                      return { ...prev, categories: next.length ? next : ['General'] }
                    })
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
