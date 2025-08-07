"use client";

import { motion } from "framer-motion";
import { FaUsers, FaEnvelope, FaChartLine } from "react-icons/fa";
import { useNewsletterStats } from "./hooks/useNewsletterSelectors";

export default function NewsletterStats() {
  const stats = useNewsletterStats();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <FaUsers className="w-6 h-6 text-purple-400" />
          <div>
            <p className="text-gray-400 text-sm">Total Subscribers</p>
            <p className="text-2xl font-bold text-white">{stats?.totalSubscribers || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-black/50 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <FaEnvelope className="w-6 h-6 text-green-400" />
          <div>
            <p className="text-gray-400 text-sm">Active Subscribers</p>
            <p className="text-2xl font-bold text-white">{stats?.activeSubscribers || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <FaChartLine className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-gray-400 text-sm">Pending Subscribers</p>
            <p className="text-2xl font-bold text-white">{stats?.pendingSubscribers || 0}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
