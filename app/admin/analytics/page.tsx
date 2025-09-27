"use client";
export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import { FaChartLine, FaChartBar, FaChartPie, FaChartArea } from "react-icons/fa";

export default function AnalyticsPage() {
  const stats = [
    {
      name: "Page Views",
      value: "89.2K",
      change: "+23%",
      changeType: "positive",
      icon: FaChartLine,
      color: "green"
    },
    {
      name: "Unique Visitors",
      value: "12.4K",
      change: "+15%",
      changeType: "positive",
      icon: FaChartBar,
      color: "blue"
    },
    {
      name: "Bounce Rate",
      value: "34%",
      change: "-8%",
      changeType: "positive",
      icon: FaChartPie,
      color: "purple"
    },
    {
      name: "Avg Session",
      value: "4m 32s",
      change: "+12%",
      changeType: "positive",
      icon: FaChartArea,
      color: "yellow"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl shadow-2xl p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 via-transparent to-purple-900/20 rounded-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <FaChartLine className="w-10 h-10 text-yellow-400" />
              <FaChartBar className="w-5 h-5 text-purple-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-gray-400">Comprehensive site analytics and reports</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg text-gray-300 mb-4">
                Track website performance, user behavior, and key metrics with detailed analytics.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaChartLine className="w-4 h-4" />
                <span>Real-time data and insights</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 text-center"
              >
                <FaChartLine className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-300">Analytics</div>
                <div className="text-xs text-gray-400">Live</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center"
              >
                <FaChartBar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-300">Reports</div>
                <div className="text-xs text-gray-400">Available</div>
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
        className="bg-black/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl shadow-2xl p-8"
      >
        <div className="text-center">
          <FaChartLine className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
          <p className="text-gray-400 mb-6">
            This section will contain comprehensive analytics including traffic analysis, 
            user behavior tracking, conversion metrics, and detailed reporting tools.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-lg hover:bg-yellow-900/50 transition-colors"
            >
              <FaChartLine className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Traffic</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg hover:bg-blue-900/50 transition-colors"
            >
              <FaChartBar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Behavior</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg hover:bg-purple-900/50 transition-colors"
            >
              <FaChartPie className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Conversions</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-green-900/30 border border-green-500/30 rounded-lg hover:bg-green-900/50 transition-colors"
            >
              <FaChartArea className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Reports</div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 