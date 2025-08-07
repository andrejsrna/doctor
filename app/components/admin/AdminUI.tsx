"use client";

import { motion } from "framer-motion";
import { IconType } from "react-icons";

export const LoadingState = ({ message }: { message: string }) => (
  <div className="container mx-auto flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-white text-xl">{message}</div>
    </div>
  </div>
);

export const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="container mx-auto flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-400 text-xl mb-4">Error loading dashboard</div>
      <div className="text-gray-400 mb-4">{error}</div>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-900/70 transition-all duration-200"
      >
        Retry
      </button>
    </div>
  </div>
);

export const Card = ({ 
  children, 
  className = "", 
  delay = 0, 
  borderColor = "purple" 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
  borderColor?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`bg-black/50 backdrop-blur-sm border border-${borderColor}-500/20 rounded-xl shadow-2xl ${className}`}
  >
    {children}
  </motion.div>
);

export const StatCard = ({ 
  stat, 
  index 
}: { 
  stat: {
    name: string;
    value: string;
    change: string;
    changeType: "positive" | "negative";
    icon: IconType;
    color: string;
  }; 
  index: number;
}) => {
  const Icon = stat.icon;
  const colorClasses = {
    green: "text-green-400 border-green-500/30 bg-green-900/30",
    purple: "text-purple-400 border-purple-500/30 bg-purple-900/30",
    blue: "text-blue-400 border-blue-500/30 bg-blue-900/30",
    yellow: "text-yellow-400 border-yellow-500/30 bg-yellow-900/30"
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
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
        <span className="text-xs opacity-75 ml-2">from last period</span>
      </div>
    </motion.div>
  );
};

export const QuickActionButton = ({ 
  icon: Icon, 
  title, 
  description, 
  color = "purple", 
  onClick 
}: { 
  icon: IconType; 
  title: string; 
  description: string; 
  color?: string;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full text-left p-4 rounded-lg bg-${color}-900/30 hover:bg-${color}-900/50 transition-colors border border-${color}-500/30`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 text-${color}-400`} />
      <div>
        <div className="font-medium text-white">{title}</div>
        <div className="text-sm text-gray-400">{description}</div>
      </div>
    </div>
  </motion.button>
);

export const NavigationCard = ({ 
  items, 
  onNavigate 
}: { 
  items: Array<{
    name: string;
    href: string;
    icon: IconType;
    description: string;
  }>;
  onNavigate: (href: string) => void;
}) => (
  <Card className="p-6">
    <h2 className="text-xl font-bold text-white mb-4">Admin Navigation</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={item.href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(item.href)}
            className="p-3 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 transition-all duration-200 border border-purple-500/30 text-center group"
          >
            <Icon className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:text-purple-300" />
            <div className="text-xs font-medium text-white">{item.name}</div>
            <div className="text-xs text-gray-400 mt-1">{item.description}</div>
          </motion.button>
        );
      })}
    </div>
  </Card>
);

export const ActivityItem = ({ 
  activity, 
  index, 
  formatTimeAgo, 
  getCategoryColor 
}: { 
  activity: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    category: {
      id: string;
      name: string;
      color: string;
    } | null;
  };
  index: number;
  formatTimeAgo: (dateString: string) => string;
  getCategoryColor: (color: string) => string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 + index * 0.1 }}
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
  >
    <div className="w-2 h-2 rounded-full bg-green-400" />
    <div className="flex-1">
      <p className="text-sm text-white">
        <span className="font-medium">{activity.email}</span>
        {activity.name && ` (${activity.name})`}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-xs text-gray-500">{formatTimeAgo(activity.createdAt)}</p>
        {activity.category && (
          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(activity.category.color)}`}>
            {activity.category.name}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);
