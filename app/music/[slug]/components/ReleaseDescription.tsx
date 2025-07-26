'use client'

import { motion } from 'framer-motion'

interface ReleaseDescriptionProps {
  content: string
}

const ReleaseDescription = ({ content }: ReleaseDescriptionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-700/50 via-purple-900/50 to-green-700/50 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      
      <div className="relative bg-black/30 backdrop-blur-sm rounded-lg p-6 md:p-8 shadow-lg
        before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(68,175,105,0.1),transparent_50%)] before:rounded-lg
        after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_80%_20%,rgba(128,0,128,0.1),transparent_50%)] after:rounded-lg">
        
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent">
          <div className="absolute top-0 left-1/4 w-px h-8 bg-gradient-to-b from-green-500/50 to-transparent"></div>
          <div className="absolute top-0 left-2/4 w-px h-12 bg-gradient-to-b from-green-500/50 to-transparent"></div>
          <div className="absolute top-0 left-3/4 w-px h-6 bg-gradient-to-b from-green-500/50 to-transparent"></div>
        </div>
        
        <div className="prose prose-invert prose-lg max-w-none
          prose-p:text-gray-300 prose-p:relative prose-p:z-10
          first-letter:text-5xl first-letter:font-bold first-letter:text-green-400
          first-letter:mr-3 first-letter:float-left
          prose-headings:text-green-400 prose-headings:font-nurgle
          prose-a:text-purple-400 prose-a:hover:text-green-400
          prose-strong:text-green-300
          prose-blockquote:border-green-700 prose-blockquote:bg-green-900/10
          prose-code:text-green-300"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  </motion.div>
)

export default ReleaseDescription 