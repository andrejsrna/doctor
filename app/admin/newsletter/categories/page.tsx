"use client";

import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface CategoryItem {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
  influencersEnabled: boolean;
}

export default function NewsletterCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/newsletter/categories', { cache: 'no-store' });
      const data: { categories: CategoryItem[] } = await res.json();
      setCategories((data.categories || []).map((c) => ({ ...c, influencersEnabled: !!c.influencersEnabled })));
    } catch {
      setToast({ message: 'Failed to load categories', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const canNavigateBack = useMemo(() => savingId === null && !creating && !loading, [savingId, creating, loading]);

  const handleField = (id: string, key: keyof CategoryItem, value: string | boolean) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, [key]: value } : c)));
  };

  const handleCreate = async () => {
    const draft = categories.find(c => c.id === '__new__');
    if (!draft) return;
    setCreating(true);
    try {
      const res = await fetch('/api/admin/newsletter/categories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: draft.name.trim(), color: draft.color.trim(), description: draft.description.trim(), influencersEnabled: !!draft.influencersEnabled })
      });
      if (res.ok) {
        setToast({ message: 'Category created', type: 'success' });
        await fetchCategories();
      } else {
        setToast({ message: 'Create failed', type: 'error' });
      }
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async (id: string) => {
    const item = categories.find(c => c.id === id);
    if (!item) return;
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/newsletter/categories/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: item.name.trim(), color: item.color.trim(), description: item.description.trim(), influencersEnabled: !!item.influencersEnabled })
      });
      if (res.ok) {
        setToast({ message: 'Category saved', type: 'success' });
        await fetchCategories();
      } else {
        setToast({ message: 'Save failed', type: 'error' });
      }
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/newsletter/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToast({ message: 'Category deleted', type: 'success' });
        await fetchCategories();
      } else {
        setToast({ message: 'Delete failed', type: 'error' });
      }
    } finally {
      setSavingId(null);
    }
  };

  const addDraft = () => {
    if (categories.some(c => c.id === '__new__')) return;
    setCategories(prev => [{ id: '__new__', name: '', color: 'purple', description: '', subscriberCount: 0, influencersEnabled: false }, ...prev]);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Newsletter Categories</h1>
        <div className="flex gap-2">
          <button onClick={addDraft} className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg flex items-center gap-2">
            <FaPlus className="w-4 h-4" /> New Category
          </button>
          <button onClick={() => canNavigateBack && router.push('/admin/newsletter')} disabled={!canNavigateBack} className="px-4 py-2 bg-gray-900/50 text-gray-300 rounded-lg disabled:opacity-50">Back</button>
        </div>
      </div>

      {toast && (
        <div className={`mb-4 px-3 py-2 rounded text-sm ${toast.type === 'success' ? 'bg-green-900/70 text-green-200' : 'bg-red-900/70 text-red-200'}`}>{toast.message}</div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="grid grid-cols-12 gap-3 items-center bg-black/50 border border-blue-500/20 rounded-lg p-3">
              <input value={cat.name} onChange={e => handleField(cat.id, 'name', e.target.value)} placeholder="Name" className="col-span-3 px-3 py-2 bg-black/50 border border-blue-500/30 rounded text-white" />
              <input value={cat.color} onChange={e => handleField(cat.id, 'color', e.target.value)} placeholder="color (tailwind hue)" className="col-span-2 px-3 py-2 bg-black/50 border border-blue-500/30 rounded text-white" />
              <input value={cat.description} onChange={e => handleField(cat.id, 'description', e.target.value)} placeholder="Description" className="col-span-4 px-3 py-2 bg-black/50 border border-blue-500/30 rounded text-white" />
              <label className="col-span-2 inline-flex items-center gap-2 text-sm text-blue-200">
                <input type="checkbox" checked={!!cat.influencersEnabled} onChange={e => handleField(cat.id, 'influencersEnabled', e.target.checked)} className="w-4 h-4" />
                Influencers
              </label>
              <div className="col-span-1 flex justify-end gap-2">
                {cat.id === '__new__' ? (
                  <button onClick={handleCreate} disabled={creating || !cat.name || !cat.color || !cat.description} className="px-3 py-2 bg-green-900/50 text-green-300 rounded-lg disabled:opacity-50 flex items-center gap-2">
                    <FaPlus className="w-4 h-4" /> Create
                  </button>
                ) : (
                  <>
                    <button onClick={() => handleSave(cat.id)} disabled={savingId === cat.id} className="px-3 py-2 bg-blue-900/50 text-blue-300 rounded-lg disabled:opacity-50 flex items-center gap-2">
                      <FaSave className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => handleDelete(cat.id)} disabled={savingId === cat.id} className="px-3 py-2 bg-red-900/50 text-red-300 rounded-lg disabled:opacity-50 flex items-center gap-2">
                      <FaTrash className="w-4 h-4" /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


