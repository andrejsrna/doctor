"use client";

import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
}

interface AddSubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  newSubscriber: {
    email: string;
    name: string;
    tags: string;
    category: string;
    notes: string;
  };
  setNewSubscriber: (subscriber: {
    email: string;
    name: string;
    tags: string;
    category: string;
    notes: string;
  }) => void;
  onSubmit: () => void;
  onUpdateExisting?: () => void;
  error?: string;
  isLoading?: boolean;
  showUpdateOption?: boolean;
}

export default function AddSubscriberModal({
  isOpen,
  onClose,
  categories,
  newSubscriber,
  setNewSubscriber,
  onSubmit,
  onUpdateExisting,
  error,
  isLoading = false,
  showUpdateOption = false
}: AddSubscriberModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/90 border border-purple-500/30 rounded-xl p-8 w-full max-w-md mx-4 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Add Subscriber</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={newSubscriber.email}
              onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Name (optional)
            </label>
            <input
              type="text"
              value={newSubscriber.name}
              onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Category
            </label>
            <select
              value={newSubscriber.category}
              onChange={(e) => setNewSubscriber({ ...newSubscriber, category: e.target.value })}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select category...</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={newSubscriber.tags}
              onChange={(e) => setNewSubscriber({ ...newSubscriber, tags: e.target.value })}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="newsletter, vip, promoter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Notes
            </label>
            <textarea
              value={newSubscriber.notes}
              onChange={(e) => setNewSubscriber({ ...newSubscriber, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Additional notes about this subscriber..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-3 text-gray-400 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all duration-200"
          >
            Cancel
          </motion.button>
          
          {showUpdateOption && onUpdateExisting && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onUpdateExisting}
              disabled={!newSubscriber.email || isLoading}
              className="px-6 py-3 bg-blue-900/50 text-blue-300 rounded-lg hover:bg-blue-900/70 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FaPlus className="w-4 h-4" />
                  Update Existing
                </>
              )}
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSubmit}
            disabled={!newSubscriber.email || isLoading}
            className="px-6 py-3 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900/70 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <FaPlus className="w-4 h-4" />
                Add Subscriber
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
