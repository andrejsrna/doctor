"use client";

import { memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import SubscriberRow from "./SubscriberRow";

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  status: 'ACTIVE' | 'PENDING' | 'UNSUBSCRIBED';
  source?: string;
  tags?: string[];
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    color: string;
    description: string;
  };
  notes?: string;
  lastEmailSent?: string;
  emailCount?: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
}

interface SubscriberListProps {
  subscribers: Subscriber[];
  categories: Category[];
  loading: boolean;
  selectedSubscribers: string[];
  onSubscriberSelect: (id: string) => void;
  onSelectAll: () => void;
  onEditSubscriber: (subscriber: Subscriber) => void;
  onDeleteSubscriber: (id: string) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const SubscriberList = memo(function SubscriberList({
  subscribers,
  categories,
  loading,
  selectedSubscribers,
  onSubscriberSelect,
  onSelectAll,
  onEditSubscriber,
  onDeleteSubscriber,
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: SubscriberListProps) {

  const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onItemsPerPageChange(Number(e.target.value));
  }, [onItemsPerPageChange]);

  const handleSelectAllChange = useCallback(() => {
    onSelectAll();
  }, [onSelectAll]);

  const getPageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  const pageInfo = useMemo(() => ({
    start: ((currentPage - 1) * itemsPerPage) + 1,
    end: Math.min(currentPage * itemsPerPage, totalCount),
    total: totalCount
  }), [currentPage, itemsPerPage, totalCount]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading subscribers...</p>
      </div>
    );
  }

  if (subscribers.length === 0) {
    return (
      <div className="text-center py-12">
        <FaUsers className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No subscribers found</p>
        <p className="text-sm text-gray-500">Add subscribers to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">
          Showing {pageInfo.start}-{pageInfo.end} of {pageInfo.total} subscribers
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-2 py-1 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-gray-500/30">
        <input
          type="checkbox"
          checked={selectedSubscribers.length === subscribers.length}
          onChange={handleSelectAllChange}
          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
        />
        <span className="text-sm text-gray-400">
          {selectedSubscribers.length} of {subscribers.length} selected
        </span>
      </div>

      <div className="space-y-2">
        {subscribers.map((subscriber) => (
          <SubscriberRow
            key={subscriber.id}
            subscriber={subscriber}
            categories={categories}
            isSelected={selectedSubscribers.includes(subscriber.id)}
            onSelect={onSubscriberSelect}
            onEdit={onEditSubscriber}
            onDelete={onDeleteSubscriber}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaAngleDoubleLeft className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronLeft className="w-4 h-4" />
            </motion.button>
            
            <div className="flex items-center gap-1">
              {getPageNumbers.map((page, index) => (
                <div key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onPageChange(page as number)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-black/30'
                      }`}
                    >
                      {page}
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronRight className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaAngleDoubleRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
});

export default SubscriberList;
