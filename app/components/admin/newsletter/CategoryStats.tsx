"use client";

import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  subscriberCount: number;
}

interface CategoryStatsProps {
  categories: Category[];
}

export default function CategoryStats({ categories }: CategoryStatsProps) {
  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {};
    categories.forEach(cat => {
      stats[cat.id] = cat.subscriberCount || 0;
    });
    return stats;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-2xl p-6"
    >
      <h2 className="text-xl font-bold text-white mb-4">Category Distribution</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category) => {
          const stats = getCategoryStats();
          const count = stats[category.id] || 0;
          return (
            <div key={category.id} className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg bg-${category.color}-900/50 border border-${category.color}-500/30`}>
                {count}
              </div>
              <div className="text-sm font-medium text-white">{category.name}</div>
              <div className="text-xs text-gray-400">{category.description}</div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
