'use client'

import { DiscussionEmbed } from 'disqus-react'
import { motion } from 'framer-motion'
import '@/app/styles/disqus.css'

interface DisqusCommentsProps {
  url: string
  identifier: string
  title: string
}

export default function DisqusComments({ url, identifier, title }: DisqusCommentsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent 
        bg-gradient-to-r from-purple-500 to-pink-500">
        Join the Discussion
      </h2>
      
      <div className="bg-black/50 p-6 rounded-xl backdrop-blur-sm border border-purple-500/10
        shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all duration-300 hover:border-purple-500/20">
        <DiscussionEmbed
          shortname='dnb-zone'
          config={{
            url: url,
            identifier: identifier,
            title: title,
          }}
        />
      </div>
    </motion.div>
  )
} 