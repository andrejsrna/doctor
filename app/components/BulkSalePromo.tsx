'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaPercent } from 'react-icons/fa'

export default function BulkSalePromo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-xl p-4 
        border border-green-500/20 hover:border-green-500/30 transition-all"
    >
      <Link href="/bulk-sale" className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-green-500/20 rounded-lg p-2">
            <FaPercent className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex flex-col p-2 mt-4">
            <h3 className="text-lg font-semibold text-green-400">
              Bulk Sale Available
            </h3>
            <p className="text-sm text-gray-400">
              Get 35% off on bulk purchases
            </p>
          </div>
        </div>
        <motion.div
          className="text-green-500"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </Link>
    </motion.div>
  )
} 