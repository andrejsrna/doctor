'use client'

import { motion } from 'framer-motion'
import { FaSkull, FaSyringe, FaBiohazard, FaBolt } from 'react-icons/fa'
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
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/45 via-black/90 to-cyan-900/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(34,211,238,0.22),transparent_42%),radial-gradient(circle_at_85%_85%,rgba(168,85,247,0.22),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.11)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.11)_1px,transparent_1px)] bg-[size:22px_22px]" />
        <Spots />
        <div className="absolute inset-0 border border-cyan-300/25 shadow-[inset_0_0_36px_rgba(34,211,238,0.15)]" />
      </div>

      <div className="relative z-10 rounded-2xl border border-white/10 bg-black/25 backdrop-blur-sm p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/45 bg-cyan-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-cyan-200">
                <FaBolt className="w-3 h-3" />
                Limited Offer
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-purple-300/45 bg-purple-500/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-purple-200">
                <FaSkull className="w-3 h-3" />
                35% Off
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-purple-500/25 border border-purple-300/30 p-2 mt-0.5">
                <FaBiohazard className="w-5 h-5 text-purple-200" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">Bulk Sale Available</h3>
                <p className="text-sm md:text-base text-gray-300 mt-1">
                  Save <span className="font-semibold text-cyan-200">35%</span> when purchasing multiple tracks.
                  Perfect for DJs, podcast sets, and larger curation sessions.
                </p>
              </div>
            </div>
          </div>

          <div className="md:w-auto">
            <Button
              variant="infected"
              className="w-full md:w-auto group relative overflow-hidden justify-center"
              href="/bulk-sale"
              onClick={handleBulkSaleClick}
              size="lg"
            >
              <span>Open Bulk Sale</span>
              <FaSyringe className="w-5 h-5 transform rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
            <p className="text-xs text-gray-400 mt-2 text-center md:text-right">Instant access to discounted bundle pricing.</p>
          </div>
        </div>
      </div>
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
          className="absolute w-32 h-32 rounded-full bg-cyan-400/10 blur-2xl"
          initial={{ x: c.initX, y: c.initY }}
          animate={{ x: c.animX, y: c.animY, scale: [1, 1.2, 1] }}
          transition={{ duration: c.duration, repeat: Infinity, repeatType: 'reverse' }}
        />
      ))}
    </div>
  )
}
