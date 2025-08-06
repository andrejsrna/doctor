"use client";

import { motion } from "framer-motion";
import { FaUsers, FaUserPlus, FaUserEdit, FaUserTimes } from "react-icons/fa";

export default function UsersPage() {
  const stats = [
    {
      name: "Total Users",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: FaUsers,
      color: "green"
    },
    {
      name: "Active Users",
      value: "892",
      change: "+8%",
      changeType: "positive",
      icon: FaUserPlus,
      color: "blue"
    },
    {
      name: "New This Month",
      value: "156",
      change: "+23%",
      changeType: "positive",
      icon: FaUserEdit,
      color: "purple"
    },
    {
      name: "Banned Users",
      value: "23",
      change: "-5%",
      changeType: "negative",
      icon: FaUserTimes,
      color: "red"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-sm border border-green-500/20 rounded-xl shadow-2xl p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-purple-900/20 rounded-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <FaUsers className="w-10 h-10 text-green-400" />
              <FaUserPlus className="w-5 h-5 text-purple-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-gray-400">Manage user accounts and permissions</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg text-gray-300 mb-4">
                Monitor user activity, manage accounts, and control access permissions.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaUsers className="w-4 h-4" />
                <span>Comprehensive user management system</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center"
              >
                <FaUsers className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-300">Users</div>
                <div className="text-xs text-gray-400">Active</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center"
              >
                <FaUserPlus className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-300">New</div>
                <div className="text-xs text-gray-400">This Month</div>
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
            red: "text-red-400 border-red-500/30 bg-red-900/30"
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
                <span className="text-xs opacity-75 ml-2">from last month</span>
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
        className="bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl p-8"
      >
        <div className="text-center">
          <FaUsers className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
          <p className="text-gray-400 mb-6">
            This section will contain user management features including user lists, 
            account details, permissions, and administrative actions.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg hover:bg-purple-900/50 transition-colors"
            >
              <FaUserPlus className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Add User</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-green-900/30 border border-green-500/30 rounded-lg hover:bg-green-900/50 transition-colors"
            >
              <FaUserEdit className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Edit Users</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-red-900/30 border border-red-500/30 rounded-lg hover:bg-red-900/50 transition-colors"
            >
              <FaUserTimes className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Ban Users</div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 