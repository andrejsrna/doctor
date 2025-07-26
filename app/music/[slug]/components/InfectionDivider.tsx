'use client'

import { motion } from 'framer-motion'
import { FaBiohazard } from 'react-icons/fa'
import SafeIcon from '@/app/components/SafeIcon'

const InfectionDivider = () => (
  <div className="relative py-2">
    <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent">
      <div className="absolute left-1/4 top-0 w-px h-8 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
      <div className="absolute left-2/4 top-0 w-px h-12 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
      <div className="absolute left-3/4 top-0 w-px h-6 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
    </div>
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
      bg-black p-4 rounded-full z-10">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl"></div>
        <SafeIcon Icon={FaBiohazard} className="w-8 h-8 text-purple-500 relative z-10" />
      </motion.div>
    </div>
  </div>
)

export default InfectionDivider 