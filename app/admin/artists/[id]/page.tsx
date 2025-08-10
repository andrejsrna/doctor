"use client"

import { use, useEffect, useRef, useState } from "react"
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LinkExt from "@tiptap/extension-link"
import EditorMenu from "../../releases/components/EditorMenu"

interface PageProps { params: Promise<{ id: string }> }

interface ArtistItem {
  id: string
  slug: string
  name: string
  bio?: string | null
  imageUrl?: string | null
  imageKey?: string | null
  soundcloud?: string | null
  spotify?: string | null
  facebook?: string | null
  instagram?: string | null
}

export default function ArtistDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [item, setItem] = useState<ArtistItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [slugEdited, setSlugEdited] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/admin/artists/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setItem(data.item)
        setSlugEdited(false)
      }
    }
    load()
  }, [id])

  const editor = useEditor({
    extensions: [StarterKit, LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } })],
    content: item?.bio || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setItem(prev => prev ? { ...prev, bio: html } : prev)
    }
  })

  useEffect(() => { if (editor && item) editor.commands.setContent(item.bio || '') }, [item, editor])

  const save = async () => {
    if (!item) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/artists/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item)
      })
      if (res.ok) { toast.success('Artist saved'); router.push('/admin/artists') }
      else { const e = await res.json().catch(() => null); toast.error(e?.error || 'Save failed') }
    } finally { setSaving(false) }
  }

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const uploadImage = async (file: File) => {
    const body = new FormData()
    body.append('file', file)
    body.append('kind', 'image')
    body.append('slug', item?.slug || '')
    body.append('baseDir', 'artists')
    const res = await fetch('/api/admin/upload', { method: 'POST', body })
    if (!res.ok) { toast.error('Image upload failed'); return }
    const data = await res.json()
    if (item) setItem({ ...item, imageUrl: data.url || item.imageUrl })
    toast.success('Image uploaded')
  }

  if (!item) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Artist</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/admin/artists')} className="px-4 py-2 border border-purple-500/30 rounded">Back</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-700/60 hover:bg-green-700 rounded">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400">Name</label>
          <input
            value={item.name}
            onChange={e => {
              const name = e.target.value
              setItem(prev => {
                if (!prev) return prev
                const next = { ...prev, name }
                if (!slugEdited) next.slug = slugify(name)
                return next
              })
            }}
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Slug</label>
          <input value={item.slug} onChange={e => { setSlugEdited(true); setItem({ ...item, slug: e.target.value }) }}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Image URL</label>
          <input value={item.imageUrl || ''} onChange={e => setItem({ ...item, imageUrl: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
          <div className="mt-2 flex items-center gap-2">
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
              const f = e.target.files?.[0]; if (f) uploadImage(f)
            }} />
            <button onClick={() => imageInputRef.current?.click()} className="px-3 py-1 border border-purple-500/30 rounded">Upload</button>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Bio</label>
          <div className="bg-black/50 border border-purple-500/30 rounded min-h-[300px] p-3">
            <EditorMenu editor={editor} />
            <EditorContent editor={editor} className="prose prose-invert prose-purple max-w-none min-h-[220px] focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400">SoundCloud</label>
          <input value={item.soundcloud || ''} onChange={e => setItem({ ...item, soundcloud: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Spotify</label>
          <input value={item.spotify || ''} onChange={e => setItem({ ...item, spotify: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Facebook</label>
          <input value={item.facebook || ''} onChange={e => setItem({ ...item, facebook: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Instagram</label>
          <input value={item.instagram || ''} onChange={e => setItem({ ...item, instagram: e.target.value })}
                 className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
      </div>
    </div>
  )
}


