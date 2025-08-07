"use client";

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { FaFilter, FaTags, FaPlus, FaCog, FaEnvelope, FaTrash } from "react-icons/fa";
import SearchInput from "./SearchInput";

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
}

interface NewsletterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  showSoftDeleted: boolean;
  setShowSoftDeleted: (show: boolean) => void;
  categories: Category[];
  selectedSubscribersCount: number;
  onAddSubscriber: () => void;
  onManageCategories: () => void;
  onSendNewsletter: () => void;
  onBulkDelete: () => void;
}

const NewsletterControls = memo(function NewsletterControls({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  showSoftDeleted,
  setShowSoftDeleted,
  categories,
  selectedSubscribersCount,
  onAddSubscriber,
  onManageCategories,
  onSendNewsletter,
  onBulkDelete
}: NewsletterControlsProps) {
  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  }, [setFilterStatus]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  }, [setFilterCategory]);

  const handleSoftDeletedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setShowSoftDeleted(e.target.checked);
  }, [setShowSoftDeleted]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, [setSearchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-black/50 backdrop-blur-sm border border-green-500/20 rounded-xl shadow-2xl p-6"
    >
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <FaFilter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={handleStatusChange}
            className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="UNSUBSCRIBED">Unsubscribed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FaTags className="w-4 h-4 text-gray-400" />
          <select
            value={filterCategory}
            onChange={handleCategoryChange}
            className="px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showSoftDeleted"
            checked={showSoftDeleted}
            onChange={handleSoftDeletedChange}
            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="showSoftDeleted" className="text-sm text-gray-300">
            Show soft-deleted
          </label>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddSubscriber}
          className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900/70 transition-all duration-200 flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add Subscriber
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onManageCategories}
          className="px-4 py-2 bg-blue-900/50 text-blue-300 rounded-lg hover:bg-blue-900/70 transition-all duration-200 flex items-center gap-2"
        >
          <FaCog className="w-4 h-4" />
          Manage Categories
        </motion.button>

        {selectedSubscribersCount > 0 && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSendNewsletter}
              className="px-4 py-2 bg-green-900/50 text-green-300 rounded-lg hover:bg-green-900/70 transition-all duration-200 flex items-center gap-2"
            >
              <FaEnvelope className="w-4 h-4" />
              Send Newsletter
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBulkDelete}
              className="px-4 py-2 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-900/70 transition-all duration-200 flex items-center gap-2"
            >
              <FaTrash className="w-4 h-4" />
              Delete Selected ({selectedSubscribersCount})
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
});

export default NewsletterControls;
