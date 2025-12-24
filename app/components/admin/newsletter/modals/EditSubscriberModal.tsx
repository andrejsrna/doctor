"use client";

import { useEffect, useState } from "react";

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: "ACTIVE" | "PENDING" | "UNSUBSCRIBED";
  tags?: string[];
  categoryId?: string;
  notes?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function EditSubscriberModal({
  isOpen,
  onClose,
  subscriber,
  categories,
  onSubmit,
  isLoading = false,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  subscriber: Subscriber | null;
  categories: Category[];
  onSubmit: (data: {
    name?: string;
    tags: string[];
    categoryId?: string;
    notes?: string;
    status: "ACTIVE" | "PENDING" | "UNSUBSCRIBED";
  }) => void;
  isLoading?: boolean;
  error?: string;
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "PENDING" | "UNSUBSCRIBED">("ACTIVE");

  useEffect(() => {
    if (subscriber) {
      setName(subscriber.name || "");
      const exists = categories.some(c => c.id === subscriber.categoryId);
      setCategoryId(exists ? (subscriber.categoryId || "") : "");
      setTags((subscriber.tags || []).join(", "));
      setNotes(subscriber.notes || "");
      setStatus(subscriber.status);
    }
  }, [subscriber, isOpen, categories]);

  if (!isOpen || !subscriber) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/90 border border-purple-500/30 rounded-xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">Edit Subscriber</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/30 rounded-lg text-red-300 text-sm">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Email</label>
            <input
              type="email"
              value={subscriber.email}
              disabled
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-gray-400 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="newsletter, vip"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="PENDING">PENDING</option>
              <option value="UNSUBSCRIBED">UNSUBSCRIBED</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-400 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSubmit({
                name: name || undefined,
                categoryId: categoryId || undefined,
                tags: tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
                notes: notes || undefined,
                status,
              })
            }
            disabled={isLoading}
            className="px-6 py-3 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900/70 disabled:opacity-50 transition-all duration-200"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

