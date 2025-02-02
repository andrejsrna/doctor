'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
interface NewsPost {
  id: number
  date: string
  title: {
    rendered: string
  }
  slug: string
}

export default function RelatedNews({ currentPostId }: { currentPostId: number }) {
  const [posts, setPosts] = useState<NewsPost[]>([])

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch('https://admin.dnbdoctor.com/wp-json/wp/v2/news?per_page=3')
        const data = await response.json()
        setPosts(data.filter((post: NewsPost) => post.id !== currentPostId))
      } catch (error) {
        console.error('Error fetching related posts:', error)
      }
    }

    fetchRelatedPosts()
  }, [currentPostId])

  if (posts.length === 0) return null

  return (
    <div className="mt-20 pt-12 border-t border-white/10">
      <h2 className="text-2xl font-bold text-purple-500 mb-8">Related News</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/30 border border-white/5 rounded-xl p-6
              hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm"
          >
            <Link href={`/news/${post.slug}`} className="block">
              <time className="text-sm text-purple-500">
                {new Date(post.date).toLocaleDateString()}
              </time>
              <h3 
                className="text-lg font-bold mt-2 hover:text-purple-400 transition-colors"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  )
} 