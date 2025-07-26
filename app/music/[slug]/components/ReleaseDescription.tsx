'use client'

import { motion } from 'framer-motion'
import { FaBrain, FaWaveSquare } from 'react-icons/fa'

interface ReleaseDescriptionProps {
  content: string
}

const ReleaseDescription = ({ content }: ReleaseDescriptionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="relative bg-black/50 border border-purple-500/20 rounded-xl p-8 shadow-2xl shadow-purple-500/10 overflow-hidden"
  >
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:24px_24px] animate-pulse" />
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/10 via-transparent to-black" />

    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <FaBrain className="text-3xl text-purple-400" />
        <h2 className="text-3xl font-bold text-white">Track Story</h2>
      </div>
      <div
        className="prose prose-invert prose-lg text-gray-300 max-w-none 
          prose-p:my-4 prose-p:leading-relaxed 
          prose-headings:text-purple-400 prose-strong:text-white"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="mt-8 flex items-center justify-end text-purple-400/50">
        <FaWaveSquare className="mr-2" />
        <span className="text-sm font-mono">Signal Acquired</span>
      </div>
    </div>
  </motion.div>
)

export default ReleaseDescription 