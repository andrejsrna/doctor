"use client";

import { useState, useEffect } from "react";

type Status = 'ACTIVE' | 'INACTIVE' | 'CONTACTED' | 'RESPONDED' | 'COLLABORATING';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'VIP';

export interface Influencer {
  id: string;
  email: string;
  name: string | null;
  platform: string | null;
  handle: string | null;
  followers: number | null;
  engagement: number | null;
  category: string | null;
  location: string | null;
  notes: string | null;
  status: Status;
  priority: Priority;
  tags: string[];
}

export default function EditInfluencerModal({
  open,
  onClose,
  influencer,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  influencer: Influencer | null;
  onSaved: (updated: Influencer) => void;
}) {
  const [form, setForm] = useState<Partial<Influencer>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (influencer) setForm(influencer);
  }, [influencer]);

  if (!open || !influencer) return null;

  const set = (k: keyof Influencer, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/influencers/${influencer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'cache-control': 'no-cache' },
        cache: 'no-store',
        body: JSON.stringify({
          name: form.name ?? null,
          platform: form.platform ?? null,
          handle: form.handle ?? null,
          followers: form.followers ?? null,
          engagement: form.engagement ?? null,
          category: form.category ?? null,
          location: form.location ?? null,
          notes: form.notes ?? null,
          status: form.status ?? 'ACTIVE',
          priority: form.priority ?? 'MEDIUM',
          tags: form.tags ?? [],
        }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const data = await res.json();
      onSaved(data.influencer);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to save influencer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl bg-black/80 border border-purple-500/30 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Influencer</h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input value={influencer.email} disabled className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Platform</label>
            <input value={form.platform ?? ''} onChange={(e) => set('platform', e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Handle</label>
            <input value={form.handle ?? ''} onChange={(e) => set('handle', e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Followers</label>
            <input type="number" value={form.followers ?? ''} onChange={(e) => set('followers', e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Engagement %</label>
            <input type="number" step="0.01" value={form.engagement ?? ''} onChange={(e) => set('engagement', e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Type</label>
            <input value={form.category ?? ''} onChange={(e) => set('category', e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <input value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Notes</label>
            <textarea value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Status</label>
            <select value={form.status ?? 'ACTIVE'} onChange={(e) => set('status', e.target.value as Status)} className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="CONTACTED">Contacted</option>
              <option value="RESPONDED">Responded</option>
              <option value="COLLABORATING">Collaborating</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Priority</label>
            <select value={form.priority ?? 'MEDIUM'} onChange={(e) => set('priority', e.target.value as Priority)} className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Tags (comma-separated)</label>
            <input value={(form.tags ?? []).join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} className="w-full px-3 py-2 rounded bg-black/50 border border-purple-500/30" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-800 border border-gray-600">Cancel</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-purple-700 hover:bg-purple-800 border border-purple-500/50 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}


