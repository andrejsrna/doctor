"use client";

import { motion } from "framer-motion";

interface ProductivityMessageProps {
  message: string;
}

export const ProductivityMessage = ({ message }: ProductivityMessageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl shadow-2xl p-6"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
        <span className="text-blue-300 text-lg">💡</span>
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">Today&apos;s Mission</h2>
        <p className="text-sm text-blue-300">Your daily productivity goal</p>
      </div>
    </div>
    <p className="text-white text-lg leading-relaxed">{message}</p>
  </motion.div>
);
