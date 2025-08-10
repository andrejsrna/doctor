"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast'

interface PageProps { params: Promise<{ id: string }> }

type Status = 'ACTIVE' | 'INACTIVE' | 'CONTACTED' | 'RESPONDED' | 'COLLABORATING'
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'VIP'

interface InfluencerItem {
  id: string
  email: string
  name: string | null
  platform: string | null
  handle: string | null
  followers: number | null
  engagement: number | null
  category: string | null
  location: string | null
  notes: string | null
  status: Status
  priority: Priority
  tags: string[]
}

interface FeedbackItem {
  id: string
  subject: string
  rating: number | null
  feedback: string | null
  submittedAt: string | null
  createdAt: string
  wpPostId?: number | null
}

export default function InfluencerDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [item, setItem] = useState<InfluencerItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/admin/influencers/${id}`, { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setItem(data.influencer)
      setFeedbacks(data.feedbacks || [])
    }
    load()
  }, [id])

  const save = async () => {
    if (!item) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/influencers/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item)
      })
      if (res.ok) { toast.success('Influencer saved'); router.push('/admin/influencers') }
      else { const e = await res.json().catch(() => null); toast.error(e?.error || 'Save failed') }
    } finally { setSaving(false) }
  }

  if (!item) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Influencer</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/admin/influencers')} className="px-4 py-2 border border-purple-500/30 rounded">Back</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-700/60 hover:bg-green-700 rounded">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400">Email</label>
          <input value={item.email} disabled className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Name</label>
          <input value={item.name || ''} onChange={e => setItem({ ...item, name: e.target.value })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Platform</label>
          <input value={item.platform || ''} onChange={e => setItem({ ...item, platform: e.target.value })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Handle</label>
          <input value={item.handle || ''} onChange={e => setItem({ ...item, handle: e.target.value })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Followers</label>
          <input type="number" value={item.followers ?? ''} onChange={e => setItem({ ...item, followers: e.target.value === '' ? null : Number(e.target.value) })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Engagement %</label>
          <input type="number" step="0.01" value={item.engagement ?? ''} onChange={e => setItem({ ...item, engagement: e.target.value === '' ? null : Number(e.target.value) })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Type</label>
          <input value={item.category || ''} onChange={e => setItem({ ...item, category: e.target.value })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Location</label>
          <input value={item.location || ''} onChange={e => setItem({ ...item, location: e.target.value })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Notes</label>
          <textarea value={item.notes || ''} onChange={e => setItem({ ...item, notes: e.target.value })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Status</label>
          <select value={item.status} onChange={e => setItem({ ...item, status: e.target.value as Status })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded">
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="CONTACTED">Contacted</option>
            <option value="RESPONDED">Responded</option>
            <option value="COLLABORATING">Collaborating</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">Priority</label>
          <select value={item.priority} onChange={e => setItem({ ...item, priority: e.target.value as Priority })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Tags (comma-separated)</label>
          <input value={(item.tags || []).join(', ')} onChange={e => setItem({ ...item, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded" />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Recent Feedback</h2>
        {feedbacks.length === 0 ? (
          <div className="text-gray-500">No feedback yet.</div>
        ) : (
          <div className="space-y-3">
            {feedbacks.map(fb => (
              <div key={fb.id} className="p-3 border border-purple-500/20 rounded bg-black/40">
                <div className="text-sm text-gray-300">{fb.subject || 'Feedback'}</div>
                <div className="text-xs text-gray-500">{fb.submittedAt ? new Date(fb.submittedAt).toLocaleString() : new Date(fb.createdAt).toLocaleString()} {typeof fb.wpPostId === 'number' ? `• WP ${fb.wpPostId}` : ''}</div>
                {fb.rating != null && <div className="text-sm text-yellow-300 mt-1">Rating: {fb.rating}</div>}
                {fb.feedback && <div className="text-sm text-white mt-2 whitespace-pre-wrap">{fb.feedback}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


