"use client"

import { useRef, useState } from "react"
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LinkExt from "@tiptap/extension-link"
import EditorMenu from "../../releases/components/EditorMenu"

interface NewsItem { slug: string; title: string; content?: string | null; coverImageUrl?: string | null; scsc?: string | null; relatedArtistName?: string | null; publishedAt?: string | null }

export default function NewsCreatePage() {
  const router = useRouter()
  const [item, setItem] = useState<NewsItem>({ slug: '', title: '', content: '', coverImageUrl: '', scsc: '', relatedArtistName: '', publishedAt: '' })
  const [saving, setSaving] = useState(false)
  const [slugEdited, setSlugEdited] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [StarterKit, LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } })],
    content: item.content || '',
    onUpdate: ({ editor }) => setItem(prev => ({ ...prev, content: editor.getHTML() })),
  })

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
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Content</label>
          <div className="bg-black/50 border border-purple-500/30 rounded min-h-[300px] p-2">
            <EditorMenu editor={editor} />
            <EditorContent editor={editor} />
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
      </div>
    </div>
  )
}


