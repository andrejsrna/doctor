"use client";

import { motion } from "framer-motion";
import { FaInstagram, FaComments, FaUsers, FaChartLine, FaPaperPlane } from "react-icons/fa";
import InstagramMessaging from "../../components/InstagramMessaging";

export default function InstagramPage() {
  const stats = [
    {
      name: "Total Messages",
      value: "1,234",
      change: "+15%",
      changeType: "positive",
      icon: FaComments,
      color: "purple"
    },
    {
      name: "Active Conversations",
      value: "89",
      change: "+8%",
      changeType: "positive",
      icon: FaUsers,
      color: "green"
    },
    {
      name: "Response Rate",
      value: "94%",
      change: "+2%",
      changeType: "positive",
      icon: FaPaperPlane,
      color: "blue"
    },
    {
      name: "Avg Response Time",
      value: "2.3h",
      change: "-12%",
      changeType: "positive",
      icon: FaChartLine,
      color: "yellow"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-green-900/20 rounded-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <FaInstagram className="w-10 h-10 text-purple-400" />
              <FaComments className="w-5 h-5 text-green-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Instagram Management</h1>
              <p className="text-gray-400">Manage direct messages and conversations</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg text-gray-300 mb-4">
                Monitor and respond to Instagram direct messages from your followers and fans.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaComments className="w-4 h-4" />
                <span>Real-time messaging interface</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center"
              >
                <FaComments className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-300">Messages</div>
                <div className="text-xs text-gray-400">Active</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center"
              >
                <FaUsers className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-300">Users</div>
                <div className="text-xs text-gray-400">Connected</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: "text-green-400 border-green-500/30 bg-green-900/30",
            purple: "text-purple-400 border-purple-500/30 bg-purple-900/30",
            blue: "text-blue-400 border-blue-500/30 bg-blue-900/30",
            yellow: "text-yellow-400 border-yellow-500/30 bg-yellow-900/30"
          };
          
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-black/50 backdrop-blur-sm border rounded-xl p-6 ${colorClasses[stat.color as keyof typeof colorClasses]}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 opacity-75" />
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === "positive" ? "text-green-400" : "text-red-400"
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs opacity-75 ml-2">from last week</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Instagram Messaging */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/50 backdrop-blur-sm border border-green-500/20 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-purple-900/20 rounded-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 p-6 border-b border-green-500/20">
            <div className="flex items-center gap-3">
              <FaInstagram className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">
                Message Center
              </h2>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <FaComments className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Direct Messages</span>
            </div>
          </div>
          
          <div className="p-6">
            <InstagramMessaging />
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <FaComments className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Message Templates</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 transition-colors text-sm">
              Create Template
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 transition-colors text-sm">
              Manage Templates
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 transition-colors text-sm">
              Quick Responses
            </button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-black/30 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <FaUsers className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">User Management</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg bg-green-900/30 hover:bg-green-900/50 transition-colors text-sm">
              Block User
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg bg-green-900/30 hover:bg-green-900/50 transition-colors text-sm">
              User History
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg bg-green-900/30 hover:bg-green-900/50 transition-colors text-sm">
              Export Data
            </button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-black/30 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <FaChartLine className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Analytics</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg bg-yellow-900/30 hover:bg-yellow-900/50 transition-colors text-sm">
              Message Stats
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg bg-yellow-900/30 hover:bg-yellow-900/50 transition-colors text-sm">
              Response Times
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg bg-yellow-900/30 hover:bg-yellow-900/50 transition-colors text-sm">
              User Engagement
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 