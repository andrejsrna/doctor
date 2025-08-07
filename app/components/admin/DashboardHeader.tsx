"use client";

import { motion } from "framer-motion";
import { FaSyringe, FaShieldAlt, FaEnvelope, FaUsers } from "react-icons/fa";

interface DashboardHeaderProps {
  userName: string;
  stats: {
    recentEmails: number;
    recentSubscribers: number;
  };
  formatNumber: (num: number) => string;
}

export const DashboardHeader = ({ userName, stats, formatNumber }: DashboardHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl p-8 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-green-900/20 rounded-xl" />
    
    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <FaSyringe className="w-10 h-10 text-green-400" />
          <FaShieldAlt className="w-5 h-5 text-purple-400 absolute -top-1 -right-1" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back, {userName}!</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-lg text-gray-300 mb-4">
            Here&apos;s what&apos;s happening with your newsletter today.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaShieldAlt className="w-4 h-4" />
            <span>System is running smoothly</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center"
          >
            <FaEnvelope className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-300">
              {formatNumber(stats.recentEmails)}
            </div>
            <div className="text-xs text-gray-400">Emails Today</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center"
          >
            <FaUsers className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-300">
              {formatNumber(stats.recentSubscribers)}
            </div>
            <div className="text-xs text-gray-400">New This Week</div>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.div>
);
