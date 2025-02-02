'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface NewsPost {
  id: number
  date: string
  slug: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  acf: {
    scsc: string
  }
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://admin.dnbdoctor.com/wp-json/wp/v2/news')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-500">Loading...</div>
      </div>
    )
  }

  return (
    <section className="py-32 px-4 relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
        >
          Latest News
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/30 border border-white/5 rounded-xl overflow-hidden 
                hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="p-6">
                <time className="text-sm text-purple-500">{formatDate(post.date)}</time>
                <h2 
                  className="text-xl font-bold mt-2 mb-4"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div 
                  className="text-gray-400 mb-6 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
                <Link
                  href={`/news/${post.slug}`}
                  className="inline-block px-6 py-2 rounded-full bg-purple-500 text-white 
                    hover:bg-purple-600 transition-colors"
                >
                  Read More
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
} 