'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'

interface ReactionsProps {
  postId: number
  postType: 'post'
}

interface ReactionCounts {
  likes: number
  dislikes: number
}

interface ReactionResponse {
  likes: number
  dislikes: number
  message?: string
  updated_field?: 'like' | 'dislike'
  new_value?: number
}

export default function Reactions({ postId }: ReactionsProps) {
  const [counts, setCounts] = useState<ReactionCounts>({ likes: 0, dislikes: 0 })
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setError(null)
        const response = await fetch(`/api/reactions?postId=${postId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch reactions')
        }
        const data = await response.json()
        setCounts(data)
        
        const stored = localStorage.getItem(`reaction-${postId}`)
        if (stored) {
          setUserReaction(stored as 'like' | 'dislike')
        }
      } catch (error) {
        console.error('Error fetching reactions:', error)
        setError('Failed to load reactions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCounts()
  }, [postId])

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (isLoading) return

    try {
      setError(null)
      setIsLoading(true)

      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          reactionType: type
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update reaction')
      }
      
      const data = await response.json()
      setCounts(data)

      if (userReaction === type) {
        setUserReaction(null)
        localStorage.removeItem(`reaction-${postId}`)
      } else {
        setUserReaction(type)
        localStorage.setItem(`reaction-${postId}`, type)
      }
    } catch (error) {
      console.error('Error updating reaction:', error)
      setError('Failed to update reaction')
    } finally {
      setIsLoading(false)
    }
  }

  const total = counts.likes + counts.dislikes
  const likePercentage = total > 0 ? (counts.likes / total) * 100 : 50

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-purple-500">
        What do you think?
      </h3>
      
      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full 
            ${userReaction === 'like' 
              ? 'bg-green-500 text-white' 
              : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
          onClick={() => handleReaction('like')}
          disabled={isLoading}
        >
          <FaThumbsUp className="w-5 h-5" />
          <span>{counts.likes}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full
            ${userReaction === 'dislike' 
              ? 'bg-red-500 text-white' 
              : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
          onClick={() => handleReaction('dislike')}
          disabled={isLoading}
        >
          <FaThumbsDown className="w-5 h-5" />
          <span>{counts.dislikes}</span>
        </motion.button>
      </div>

      {/* Reaction ratio bar */}
      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${likePercentage}%` }}
          transition={{ duration: 0.5 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-400"
        />
      </div>
    </div>
  )
} 