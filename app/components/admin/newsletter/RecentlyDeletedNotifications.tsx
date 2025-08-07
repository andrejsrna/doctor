"use client";

import { motion } from "framer-motion";
import { FaUndo } from "react-icons/fa";
import { Subscriber, RecentlyDeleted } from "./types";

interface RecentlyDeletedNotificationsProps {
  recentlyDeleted: RecentlyDeleted[];
  onUndoDelete: (subscriber: Subscriber) => void;
}

export default function RecentlyDeletedNotifications({ 
  recentlyDeleted, 
  onUndoDelete 
}: RecentlyDeletedNotificationsProps) {
  if (recentlyDeleted.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 space-y-2"
    >
      {recentlyDeleted.map((item) => (
        <div
          key={item.subscriber.id}
          className="bg-yellow-900/90 border border-yellow-500/50 text-yellow-200 p-4 rounded-lg shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Subscriber deleted</p>
              <p className="text-sm opacity-75">{item.subscriber.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUndoDelete(item.subscriber)}
              className="px-3 py-1 bg-yellow-700/50 hover:bg-yellow-600/50 rounded text-sm font-medium transition-colors"
            >
              <FaUndo className="w-3 h-3 inline mr-1" />
              Undo
            </motion.button>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
