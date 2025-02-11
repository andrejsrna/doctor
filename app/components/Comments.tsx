'use client'

import { useEffect } from 'react'
import { DiscussionEmbed } from 'disqus-react'
import { motion } from 'framer-motion'

interface CommentsProps {
  slug: string
  title: string
  identifier?: string
}

// Add interface for window.DISQUS
declare global {
  interface Window {
    DISQUS: {
      reset: (config: { reload: boolean }) => void;
    };
  }
}

export default function Comments({ slug, title, identifier }: CommentsProps) {
  useEffect(() => {
    // Reset Disqus thread when props change
    if (typeof window !== 'undefined' && window.DISQUS) {
      window.DISQUS.reset({
        reload: true
      })
    }
  }, [slug, identifier])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 md:p-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent 
          bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
          Join the Discussion
        </h2>
        <p className="text-gray-400">
          Share your thoughts and connect with other music lovers
        </p>
      </div>

      <div className="relative">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-lg blur" />
        
        {/* Comments container */}
        <div className="relative bg-black/50 backdrop-blur-sm rounded-lg p-4 md:p-6">
          <DiscussionEmbed
            shortname="dnb-zone" // Replace with your Disqus shortname
            config={{
              url: `https://dnbdoctor.com/${slug}`,
              identifier: identifier || slug,
              title: title,
              language: 'en',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
