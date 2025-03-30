'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaPercent } from 'react-icons/fa'

export default function BulkSalePromo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden border border-purple-500/30
                 hover:border-purple-500/50 transition-all group
                 hover:shadow-xl hover:shadow-purple-500/10"
    >
      <Link href="/bulk-sale"
            className="flex items-center justify-between p-6
                       bg-gradient-to-r from-purple-600/80 to-pink-600/80
                       hover:from-purple-600/90 hover:to-pink-600/90
                       transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="bg-purple-500/30 rounded-lg p-3 flex-shrink-0">
            <FaPercent className="w-6 h-6 text-purple-300" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-purple-200">
              Bulk Sale Available
            </h3>
            <p className="text-sm text-gray-300">
              Save 35% on multiple track purchases!
            </p>
          </div>
        </div>
        <motion.div
          className="text-purple-300 group-hover:text-purple-200 transition-colors"
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
