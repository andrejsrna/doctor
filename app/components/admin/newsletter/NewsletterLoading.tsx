"use client";

import { motion } from "framer-motion";

export default function NewsletterLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"
        />
        <p className="mt-4 text-purple-300">Loading newsletter data...</p>
      </div>
    </div>
  );
}
