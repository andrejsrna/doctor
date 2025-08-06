"use client";

import { motion } from "framer-motion";
import { FaCog, FaShieldAlt, FaDatabase, FaBell, FaKey } from "react-icons/fa";

export default function SettingsPage() {
  const settingsCategories = [
    {
      name: "Security",
      icon: FaShieldAlt,
      color: "green",
      description: "Password, 2FA, session management"
    },
    {
      name: "Database",
      icon: FaDatabase,
      color: "blue",
      description: "Backup, maintenance, optimization"
    },
    {
      name: "Notifications",
      icon: FaBell,
      color: "purple",
      description: "Email alerts, system notifications"
    },
    {
      name: "API Keys",
      icon: FaKey,
      color: "yellow",
      description: "External service integrations"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-2xl p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20 rounded-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <FaCog className="w-10 h-10 text-blue-400" />
              <FaShieldAlt className="w-5 h-5 text-purple-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">System Settings</h1>
              <p className="text-gray-400">Configure system preferences and security</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg text-gray-300 mb-4">
                Manage system configuration, security settings, and administrative preferences.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaCog className="w-4 h-4" />
                <span>Comprehensive system configuration</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 text-center"
              >
                <FaCog className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-300">Settings</div>
                <div className="text-xs text-gray-400">Configured</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center"
              >
                <FaShieldAlt className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-300">Security</div>
                <div className="text-xs text-gray-400">Active</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {settingsCategories.map((category, index) => {
          const Icon = category.icon;
          const colorClasses = {
            green: "text-green-400 border-green-500/30 bg-green-900/30",
            purple: "text-purple-400 border-purple-500/30 bg-purple-900/30",
            blue: "text-blue-400 border-blue-500/30 bg-blue-900/30",
            yellow: "text-yellow-400 border-yellow-500/30 bg-yellow-900/30"
          };
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-black/50 backdrop-blur-sm border rounded-xl p-6 ${colorClasses[category.color as keyof typeof colorClasses]}`}
            >
              <div className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-3 opacity-75" />
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-sm opacity-75">{category.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Placeholder Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-2xl p-8"
      >
        <div className="text-center">
          <FaCog className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">System Settings</h2>
          <p className="text-gray-400 mb-6">
            This section will contain system configuration options including security settings, 
            database management, notification preferences, and API key management.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-green-900/30 border border-green-500/30 rounded-lg hover:bg-green-900/50 transition-colors"
            >
              <FaShieldAlt className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Security</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg hover:bg-blue-900/50 transition-colors"
            >
              <FaDatabase className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Database</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg hover:bg-purple-900/50 transition-colors"
            >
              <FaBell className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Notifications</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-lg hover:bg-yellow-900/50 transition-colors"
            >
              <FaKey className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">API Keys</div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 