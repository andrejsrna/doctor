'use client'

import { motion } from 'framer-motion'
import { FaSkull, FaSyringe, FaBiohazard } from 'react-icons/fa'
import Button from './Button'
import { trackEvent } from '@/app/utils/analytics'

export default function BulkSalePromo() {
  const handleBulkSaleClick = () => {
    trackEvent('promotion_click', {
      promotion_type: 'bulk_sale',
      content_type: 'promotion',
      content_name: 'Bulk Sale Promotion'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        {/* Pulsing gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30 animate-pulse rounded-xl" />
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:24px_24px] rounded-xl" />
        
        {/* Moving infection spots (deterministic across SSR/CSR) */}
        <Spots />

        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-xl border border-purple-500/20 shadow-[inset_0_0_30px_rgba(168,85,247,0.2)]" />
      </div>

      {/* Content */}
      <Button
        variant="infected"
        className="w-full group relative overflow-hidden"
        href="/bulk-sale"
        onClick={handleBulkSaleClick}
      >
        <div className="flex items-center gap-4 p-4">
          {/* Icon Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl 
              group-hover:bg-purple-500/40 transition-all duration-500" />
            <div className="relative z-10 bg-purple-500/30 rounded-lg p-3 flex items-center justify-center">
              <FaBiohazard className="w-6 h-6 text-purple-300 group-hover:rotate-180 transition-transform duration-700" />
            </div>
          </div>
          
          {/* Text Content */}
          <div className="flex flex-col items-start flex-1">
            <span className="text-sm opacity-70 group-hover:opacity-90 transition-opacity
              flex items-center gap-2"
            >
              <FaSkull className="w-3 h-3" />
              <span>Special Infection Package</span>
            </span>
            <span className="text-xl font-bold">
              Bulk Sale Available
            </span>
            <span className="text-sm opacity-50 mt-1">
              35% discount on multiple track purchases
            </span>
          </div>

          {/* Arrow indicator */}
          <FaSyringe className="w-5 h-5 transform rotate-45 
            group-hover:translate-x-1 group-hover:-translate-y-1 
            transition-transform duration-300" />
        </div>
      </Button>
    </motion.div>
  )
}
 
function Spots() {
  const configs = [
    { initX: -20, initY: 15, animX: 30, animY: -25, duration: 8 },
    { initX: 25, initY: -30, animX: -35, animY: 20, duration: 9.5 },
    { initX: -40, initY: 10, animX: 15, animY: -15, duration: 7.5 },
  ]
  return (
    <div className="absolute inset-0">
      {configs.map((c, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full bg-purple-500/5 blur-xl"
          initial={{ x: c.initX, y: c.initY }}
          animate={{ x: c.animX, y: c.animY, scale: [1, 1.2, 1] }}
          transition={{ duration: c.duration, repeat: Infinity, repeatType: 'reverse' }}
        />
      ))}
    </div>
  )
}
