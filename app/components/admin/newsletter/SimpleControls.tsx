"use client";

import { memo, useCallback } from "react";
import SearchInput from "./SearchInput";

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
}

const SimpleControls = memo(function SimpleControls({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  categories,
  onAddSubscriber,
  onManageCategories,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  categories: Category[];
  onAddSubscriber: () => void;
  onManageCategories: () => void;
}) {
  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  }, [setFilterStatus]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  }, [setFilterCategory]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, [setSearchTerm]);

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <SearchInput value={searchTerm} onChange={handleSearchChange} />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="UNSUBSCRIBED">Unsubscribed</option>
          </select>
        </div>
        <div>
          <select
            value={filterCategory}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={onAddSubscriber} className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900/70">Add Subscriber</button>
        <button onClick={onManageCategories} className="px-4 py-2 bg-blue-900/50 text-blue-300 rounded-lg hover:bg-blue-900/70">Manage Categories</button>
      </div>
    </div>
  );
});

export default SimpleControls;


