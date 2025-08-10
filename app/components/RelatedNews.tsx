"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { sanitizeHtml } from '@/lib/sanitize'

type NewsPost = {
  id: string
  slug: string
  title: string
  publishedAt?: string | null
}

export default function RelatedNews({
  currentPostId,
  relatedBy = '',
}: {
  currentPostId: string | number
  relatedBy?: string
}) {
  const [posts, setPosts] = useState<NewsPost[]>([])

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const params = new URLSearchParams({ page: '1', limit: '6' })
        if (relatedBy) params.append('search', relatedBy)
        const response = await fetch(`/api/news?${params.toString()}`, { next: { revalidate: 300 } })
        const data = await response.json()
        const unique = (data.items as NewsPost[]).filter(p => p.id !== String(currentPostId)).slice(0, 3)
        setPosts(unique)
      } catch (error) {
        console.error('Error fetching related posts:', error)
      }
    }
    fetchRelatedPosts()
  }, [currentPostId, relatedBy])

  if (posts.length === 0) return null

  return (
    <div className="mt-20 pt-12 border-t border-white/10">
      <h2 className="text-2xl font-bold text-purple-500 mb-8">Related News</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/30 border border-white/5 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm"
          >
            <Link href={`/news/${post.slug}`} className="block">
              <time className="text-sm text-purple-500">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
              </time>
              <h3
                className="text-lg font-bold mt-2 hover:text-purple-400 transition-colors"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
              />
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  )
}