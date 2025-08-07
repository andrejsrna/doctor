"use client";

import { motion } from "framer-motion";
import { FaNewspaper, FaEnvelope, FaUsers, FaTags } from "react-icons/fa";

interface NewsletterHeaderProps {
  stats: {
    totalSubscribers: number;
    activeSubscribers: number;
    pendingSubscribers: number;
  };
  categoriesCount: number;
  selectedCount: number;
}

export default function NewsletterHeader({ stats, categoriesCount, selectedCount }: NewsletterHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl p-8"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-green-900/20 rounded-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <FaNewspaper className="w-10 h-10 text-purple-400" />
            <FaEnvelope className="w-5 h-5 text-green-400 absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Newsletter Management</h1>
            <p className="text-gray-400">Manage subscribers and send newsletters</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center"
          >
            <FaUsers className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-300">{stats.totalSubscribers}</div>
            <div className="text-xs text-gray-400">Total Subscribers</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center"
          >
            <FaEnvelope className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-300">{stats.activeSubscribers}</div>
            <div className="text-xs text-gray-400">Active Subscribers</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 text-center"
          >
            <FaTags className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-300">{categoriesCount}</div>
            <div className="text-xs text-gray-400">Categories</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4 text-center"
          >
            <FaEnvelope className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-300">{selectedCount}</div>
            <div className="text-xs text-gray-400">Selected</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
